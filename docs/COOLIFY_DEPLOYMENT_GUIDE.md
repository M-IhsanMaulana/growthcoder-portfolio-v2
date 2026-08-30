# 🚀 Panduan Lengkap Deployment Monorepo Menggunakan Coolify & Cloudflare DNS

Panduan ini berisi langkah-langkah praktis dan terperinci untuk melakukan deployment aplikasi **GrowthCoder Monorepo** (Next.js Web, Next.js CMS, AdonisJS v6 API, PostgreSQL, dan Redis) menggunakan **Coolify v4** di VPS Ubuntu, terintegrasi dengan **Cloudflare DNS & SSL**.

---

## 📑 Daftar Isi

1. [Arsitektur & Skema Domain](#1-arsitektur--skema-domain)
2. [Persiapan VPS & Instalasi Coolify](#2-persiapan-vps--instalasi-coolify)
3. [Konfigurasi Cloudflare DNS & SSL](#3-konfigurasi-cloudflare-dns--ssl)
4. [Membuat Database PostgreSQL & Redis di Coolify](#4-membuat-database-postgresql--redis-di-coolify)
5. [Menghubungkan GitHub App ke Coolify](#5-menghubungkan-github-app-ke-coolify)
6. [Deploy Backend API (`apps/api`)](#6-deploy-backend-api-appsapi)
7. [Deploy Frontend Web (`apps/web`)](#7-deploy-frontend-web-appsweb)
8. [Deploy Admin CMS (`apps/cms`)](#8-deploy-admin-cms-appscms)
9. [Verifikasi CI/CD & Auto Deploy](#9-verifikasi-cicd--auto-deploy)
10. [Panduan Migrasi Masa Depan ke Cloudflare R2](#10-panduan-migrasi-masa-depan-ke-cloudflare-r2)

---

## 1. Arsitektur & Skema Domain

Seluruh service berjalan terisolasi di dalam container Docker yang dikelola secara otomatis oleh Coolify:

```mermaid
graph TD
    Browser[Pengunjung / Klien Web] -->|growthcoder.id| CF[Cloudflare CDN & DNS]
    Admin[Admin Browser] -->|admin.growthcoder.id| CF
    MediaReq[Permintaan Gambar / Media] -->|image.growthcoder.id| CF

    CF -->|SSL Full / Strict| CoolifyTraefik[Coolify Traefik Reverse Proxy]

    CoolifyTraefik -->|Port 3000| WebCont[Container: Web Next.js 16]
    CoolifyTraefik -->|Port 3001| CMSCont[Container: CMS Next.js 16]
    CoolifyTraefik -->|Port 3333| APICont[Container: AdonisJS v6 API]

    APICont -->|Auto Migration + Server + BullMQ Worker| APICont
    APICont -->|Port 5432| PostgresCont[(Container: PostgreSQL 16/18)]
    APICont -->|Port 6379| RedisCont[(Container: Redis 7)]
    APICont -->|Volume Mount| DiskVolume[Persistent Disk: /app/storage/uploads]
```

| Service           | Subdomain / URL                                         | Port Container | Keterangan                          |
| :---------------- | :------------------------------------------------------ | :------------- | :---------------------------------- |
| **Web Portfolio** | `https://growthcoder.id` & `https://www.growthcoder.id` | `3000`         | Next.js 16 (App Router + SSR/ISR)   |
| **Admin CMS**     | `https://admin.growthcoder.id`                          | `3001`         | Next.js 16 (Passkeys WebAuthn)      |
| **REST API**      | `https://api.growthcoder.id`                            | `3333`         | AdonisJS v6 + SSE Transmit          |
| **Media / Asset** | `https://image.growthcoder.id`                          | `3333`         | Routed ke folder static uploads API |
| **PostgreSQL**    | `postgres:5432` _(Internal Network)_                    | `5432`         | Database Utama                      |
| **Redis**         | `redis:6379` _(Internal Network)_                       | `6379`         | Cache & BullMQ Queue Worker         |

---

## 2. Persiapan VPS & Instalasi Coolify

### Spesifikasi Minimum VPS yang Disarankan:

- **OS:** Ubuntu 22.04 LTS / 24.04 LTS (Fresh install).
- **CPU:** 2 vCPU Core.
- **RAM:** 4 GB RAM (Sangat disarankan 4GB agar proses build Next.js dan AdonisJS monorepo berjalan lancar tanpa error _Out of Memory_).
- **Storage:** 30 GB+ SSD / NVMe.

### Langkah Instalasi Coolify:

1. Login ke server VPS Anda via SSH terminal:
   ```bash
   ssh root@<IP_VPS_ANDA>
   ```
2. Pastikan paket OS telah diperbarui:
   ```bash
   apt update && apt upgrade -y && apt install curl -y
   ```
3. Jalankan script instalasi resmi Coolify:
   ```bash
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   ```
4. Setelah instalasi selesai (sekitar 2–3 menit), buka browser dan akses dashboard Coolify Anda di:
   **`http://<IP_VPS_ANDA>:8000`**
5. Buat akun Administrator pertama Anda di layar registrasi awal.

---

## 3. Konfigurasi Cloudflare DNS & SSL

Buka dashboard **Cloudflare** untuk domain `growthcoder.id`:

### A. Tambahkan DNS Records (A Record)

Tambahkan record berikut mengarah ke IP publik VPS Anda (Pastikan status Proxy **Aktif / Orange Cloud**):

| Type | Name                        | IPv4 Address    | Proxy Status     |
| :--- | :-------------------------- | :-------------- | :--------------- |
| `A`  | `@` (atau `growthcoder.id`) | `<IP_VPS_ANDA>` | Proxied (Orange) |
| `A`  | `www`                       | `<IP_VPS_ANDA>` | Proxied (Orange) |
| `A`  | `admin`                     | `<IP_VPS_ANDA>` | Proxied (Orange) |
| `A`  | `api`                       | `<IP_VPS_ANDA>` | Proxied (Orange) |
| `A`  | `image`                     | `<IP_VPS_ANDA>` | Proxied (Orange) |

### B. Konfigurasi SSL/TLS & WebSockets di Cloudflare

1. Buka menu **SSL/TLS** -> **Overview**:
   - Pilih mode enkripsi: **Full** atau **Full (Strict)**.
2. Buka menu **Network**:
   - Pastikan **WebSockets** dalam status **ON** (Diperlukan untuk AdonisJS Transmit SSE & real-time updates).
3. _(Disarankan)_ Buka menu **SSL/TLS** -> **Edge Certificates**:
   - Aktifkan **Always Use HTTPS**: `ON`.
   - Aktifkan **Automatic HTTPS Rewrites**: `ON`.

---

## 4. Membuat Database PostgreSQL & Redis di Coolify

> [!IMPORTANT]
> **Database & Redis WAJIB dibuat dan di-start terlebih dahulu** sebelum men-deploy aplikasi. Backend API memerlukan koneksi database aktif saat startup untuk auto-migration.

### A. Membuat PostgreSQL

1. Di Dashboard Coolify, masuk ke menu **Projects** (di sidebar kiri) -> Pilih Environment **production** -> Klik **+ New Resource**.
2. Pilih kartu **PostgreSQL** (Bisa pilih **PostgreSQL 16** atau **PostgreSQL 18 Default**).
3. Pada halaman konfigurasi PostgreSQL:
   - **Name:** Ganti nama acak menjadi: `growthcoder-postgres`.
   - **Username:** `postgres` (atau `growthcoder_user`).
   - **Password:** Klik ikon mata 👁️ untuk melihat & menyalin password otomatis. **Catat di Notepad.**
   - **Initial database:** Ganti menjadi `growthcoder_db`.
   - **Postgres URL (internal):** Klik ikon mata 👁️ lalu salin seluruh URL internal (contoh: `postgres://postgres:password@postgresql-xxx:5432/growthcoder_db`). **Catat di Notepad.**
   - **Public access:** Pastikan tetap **Private**.
4. Klik **Save**, lalu klik **Start**. Tunggu hingga statusnya **Running (Hijau)**.

---

### B. Membuat Redis

1. Di dalam Project yang sama, klik **+ New Resource** -> Pilih **Redis**.
2. Pada halaman konfigurasi Redis:
   - **Name:** `growthcoder-redis`.
   - **Username:** `default`.
   - **Password:** Salin teks password yang digenerate Coolify. **Catat di Notepad.**
   - **Redis URL (internal):** Klik ikon mata 👁️ lalu salin URL internalnya. **Catat di Notepad.**
   - **Public access:** Pastikan tetap **Private**.
3. Klik **Save**, lalu klik **Start**. Tunggu hingga statusnya **Running (Hijau)**.

---

## 5. Menghubungkan GitHub App ke Coolify

*(Proses ini hanya dilakukan 1 kali untuk menghubungkan akun GitHub ke Coolify)*

1. Di dalam Project, klik **+ New Resource** -> Pilih kartu **Git Repository (with GitHub App)**.
2. Klik tombol **`Deploy →`** pada kartu tersebut.
3. Di modal **New GitHub App**:
   - **Name:** Masukkan nama yang **unik secara global** (misal: `coolify-growthcoder-<nama-anda>`).
   - Biarkan field lainnya default, lalu klik **Continue**.
4. Di halaman **Automated installation** (sebelah kiri):
   - Klik tombol ungu **`Register with GitHub`**.
5. Anda akan diarahkan ke GitHub:
   - Jika muncul error nama sudah terpakai, tambahkan angka/nama unik di kolom nama GitHub App.
   - Klik tombol hijau **`Create GitHub App for [Akun Anda]`**.
6. Kembali ke Coolify, klik tombol ungu **`Install repositories`**:
   - Pilih akun Anda di GitHub.
   - Pilih opsi **"Only select repositories"** -> centang repository `growthcoder-portfolio-v2` (atau *All repositories*).
   - Klik **Install & Authorize**.
7. GitHub App sekarang sudah terhubung penuh ke Coolify!

---

## 6. Deploy Backend API (`apps/api`)

Backend API akan memproses migrasi database otomatis, menjalankan background queue worker (BullMQ), serta melayani endpoint REST API dan file media.

### Langkah 1: Pilih Repository
1. Masuk ke **Projects** -> **production** -> Klik **+ New Resource**.
2. Pilih kartu **Git Repository (with GitHub App)**.
3. Di kolom **Repository**, pilih: `M-IhsanMaulana/growthcoder-portfolio-v2` -> Klik **Load repository**.

### Langkah 2: Build Configuration Awal
Pada tampilan popup konfigurasi awal:
- **Branch:** `main`
- **Build pack:** Ubah dari *Railpack* menjadi **`Dockerfile`**.
- **Port:** Ubah dari `3000` menjadi **`3333`**.
- **Base directory:** Biarkan tetap **`/`** *(Penting: Jangan diubah agar pnpm workspace terbaca)*.
- Klik **Continue**.

### Langkah 3: Pengaturan Detail Aplikasi
Setelah masuk ke dashboard aplikasi:

1. **Tab General:**
   - **Name:** Ubah menjadi `growthcoder-api`.
   - **Build pipeline -> Dockerfile location:** Ubah menjadi **`apps/api/Dockerfile`**.
   - **Internal access -> Exposed ports:** Pastikan port bernilai **`3333`** (klik *Edit networking* jika ingin mengubah).
   - Klik **Save**.

2. **Tab Domains (di sidebar kiri):**
   - Masukkan kedua domain berikut (pisahkan dengan koma):
     ```text
     https://api.growthcoder.id, https://image.growthcoder.id
     ```
   - Klik **Save**.

3. **Tab Persistent Storage (di sidebar kiri):**
   - Klik **+ Add Persistent Storage**:
     - **Name:** `api-uploads`
     - **Destination Path:** `/app/storage/uploads`
   - Klik **Save**.

4. **Tab Environment Variables (di sidebar kiri):**
   - Tambahkan variabel-variabel berikut (sesuaikan password Postgres & Redis):

```env
NODE_ENV=production
PORT=3333
HOST=0.0.0.0
LOG_LEVEL=info
# App Secrets & Session
APP_KEY=isi_string_acak_rahasia_minimal_32_karakter
SESSION_DRIVER=cookie

# URL Publik & Storage
APP_URL=https://api.growthcoder.id
IMAGE_BASE_URL=https://image.growthcoder.id
STORAGE_DRIVER=local
DRIVE_DISK=local

# CORS & Allowed Origins
CORS_ENABLED=true
ALLOWED_ORIGINS=https://growthcoder.id,https://www.growthcoder.id,https://admin.growthcoder.id

# PostgreSQL Connection (Gunakan detail dari Langkah 4A)
DB_CONNECTION=pg
DB_HOST=growthcoder-postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<PASSWORD_POSTGRES_DARI_LANGKAH_4A>
DB_DATABASE=growthcoder_db

# Redis Connection (Gunakan detail dari Langkah 4B)
REDIS_HOST=growthcoder-redis
REDIS_PORT=6379
REDIS_PASSWORD=<PASSWORD_REDIS_DARI_LANGKAH_4B>

# Passkeys WebAuthn Admin CMS
RP_NAME=GrowthCoder Admin
RP_ID=growthcoder.id
ORIGIN=https://admin.growthcoder.id
```

5. **Deploy:**
   - Klik tombol **Deploy** di kanan atas.
   - Tunggu hingga proses build selesai dan container berstatus **Running (Hijau)**.

---

## 7. Deploy Frontend Web (`apps/web`)

1. Di Dashboard Coolify, masuk ke **Projects** -> **production** -> Klik **+ New Resource**.
2. Pilih **Git Repository (with GitHub App)** -> Pilih repository `growthcoder-portfolio-v2` -> Klik **Load repository**.
3. **Build configuration awal:**
   - **Branch:** `main`
   - **Build pack:** `Dockerfile`
   - **Port:** `3000`
   - **Base directory:** `/`
   - Klik **Continue**.
4. **Pengaturan detail:**
   - **Name:** `growthcoder-web`
   - **Dockerfile location:** `apps/web/Dockerfile`
   - **Domains tab:** `https://growthcoder.id, https://www.growthcoder.id`
   - **Exposed port:** `3000`
5. **Environment Variables tab:**
   ```env
   NODE_ENV=production
   PORT=3000
   NEXT_PUBLIC_SITE_URL=https://growthcoder.id
   NEXT_PUBLIC_API_URL=https://api.growthcoder.id
   NEXT_PUBLIC_MEDIA_URL=https://image.growthcoder.id
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
6. Klik **Save** -> Klik **Deploy**.

---

## 8. Deploy Admin CMS (`apps/cms`)

1. Di Dashboard Coolify, masuk ke **Projects** -> **production** -> Klik **+ New Resource**.
2. Pilih **Git Repository (with GitHub App)** -> Pilih repository `growthcoder-portfolio-v2` -> Klik **Load repository**.
3. **Build configuration awal:**
   - **Branch:** `main`
   - **Build pack:** `Dockerfile`
   - **Port:** `3001`
   - **Base directory:** `/`
   - Klik **Continue**.
4. **Pengaturan detail:**
   - **Name:** `growthcoder-cms`
   - **Dockerfile location:** `apps/cms/Dockerfile`
   - **Domains tab:** `https://admin.growthcoder.id`
   - **Exposed port:** `3001`
5. **Environment Variables tab:**
   ```env
   NODE_ENV=production
   PORT=3001
   NEXT_PUBLIC_API_URL=https://api.growthcoder.id
   NEXT_PUBLIC_MEDIA_URL=https://image.growthcoder.id
   ```
6. Klik **Save** -> Klik **Deploy**.

---

## 9. Verifikasi CI/CD & Auto Deploy

### A. Verifikasi Status Aplikasi

1. Buka `https://growthcoder.id` di browser -> Pastikan halaman utama terbuka sempurna dan animasi berjalan mulus.
2. Buka `https://admin.growthcoder.id` -> Lakukan login admin pertama dan coba upload file/gambar di menu artikel atau proyek.
3. Klik kanan pada gambar yang baru di-upload dan pilih _"Copy Image Address"_ -> Pastikan domain gambar berawalan:
   $$\textbf{\texttt{https://image.growthcoder.id/uploads/...}}$$

### B. Menguji Alur Auto Deploy (CI/CD)

1. Di Coolify, pada setiap aplikasi (Web, CMS, API), pastikan opsi **Auto Deploy on Git Push** aktif.
2. Lakukan perubahan kecil pada kode di komputer lokal Anda, misalnya update teks di `apps/web`.
3. Commit dan push ke GitHub:
   ```bash
   git add .
   git commit -m "feat: test auto deploy ci/cd via coolify"
   git push origin main
   ```
4. Buka dashboard Coolify -> Anda akan melihat proses build otomatis berjalan di background dan melakukan update versi secara _zero-downtime_.

---

## 10. Panduan Migrasi Masa Depan ke Cloudflare R2

Jika di kemudian hari ukuran media/gambar bertambah besar dan Anda ingin memindahkannya ke Cloudflare R2 (Object Storage):

### Langkah 1: Buat Bucket di Cloudflare R2

1. Masuk ke Cloudflare Dashboard -> **R2 Object Storage** -> **Create Bucket** (misal: `growthcoder-media`).
2. Masuk ke **Settings** bucket -> **Public Access** -> **Custom Domains** -> Hubungkan domain `image.growthcoder.id`.

### Langkah 2: Buat API Token R2

1. Di Cloudflare R2, buka **Manage R2 API Tokens** -> **Create API Token** (dengan hak akses _Object Read & Write_).
2. Dapatkan kredensial:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_ENDPOINT` (`https://<ACCOUNT_ID>.r2.cloudflarestorage.com`)
   - `AWS_BUCKET` (`growthcoder-media`)

### Langkah 3: Update Environment Variables di API Coolify

Ubah env di aplikasi `apps/api`:

```env
STORAGE_DRIVER=s3
AWS_ACCESS_KEY_ID=token_access_key_anda
AWS_SECRET_ACCESS_KEY=token_secret_key_anda
AWS_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
AWS_BUCKET=growthcoder-media
AWS_REGION=auto
```

Klik **Save & Redeploy**.

> [!NOTE]
> Karena frontend Web dan CMS sudah menggunakan helper `resolveMediaUrl()` dengan `NEXT_PUBLIC_MEDIA_URL=https://image.growthcoder.id`, **tidak ada kode frontend yang perlu diubah!** Semua gambar akan otomatis tersimpan dan terlayani langsung via Cloudflare R2 CDN.
