# Growthcoder Portfolio v2 (`growthcoder.id`)

<div align="center">

![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue.svg?style=flat-square&logo=typescript)
![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo%20%2B%20pnpm-purple.svg?style=flat-square&logo=turborepo)
![Next.js](https://img.shields.io/badge/Next.js-16.3%20%28React%2019%29-black.svg?style=flat-square&logo=next.js)
![AdonisJS](https://img.shields.io/badge/Backend-AdonisJS%20v6-5A45FF.svg?style=flat-square&logo=adonisjs)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791.svg?style=flat-square&logo=postgresql)

**Next-Generation Personal Portfolio, Headless CMS Dashboard, and Enterprise-Ready API Monorepo.**

[Fitur Utama](#-fitur-utama) • [Arsitektur](#-arsitektur-monorepo) • [Tech Stack](#-tech-stack) • [Panduan Instalasi](#-panduan-instalasi--development) • [Lisensi](#-lisensi)

</div>

---

## 📌 Ringkasan Proyek

**growthcoder-portfolio-v2** adalah platform portofolio profesional dan Content Management System (CMS) modern yang dibangun di atas arsitektur **Full-Stack TypeScript Monorepo**. Platform ini mengintegrasikan website publik berkinerja tinggi, dashboard admin headless yang intuitif, serta backend RESTful API yang tangguh dengan keamanan kelas enterprise.

---

## 🏗️ Arsitektur Monorepo

Proyek ini dikelola menggunakan **pnpm Workspaces** dan **Turborepo** untuk manajemen dependensi terisolasi, caching build yang cepat, dan pipeline kompilasi modular:

```text
growthcoder-portfolio-v2/
├── apps/
│   ├── api/                 # 🚀 AdonisJS v6 REST API & WebSocket (Lucid ORM, PostgreSQL)
│   ├── cms/                 # ⚙️ Next.js 16 Admin CMS Dashboard (React 19, TanStack Query)
│   └── web/                 # 🌐 Next.js 16 Public Portfolio Website (App Router, Tailwind v4)
├── packages/
│   ├── config/              # 🛠️ Shared Tooling (ESLint, Prettier, TSConfig)
│   ├── tailwind-config/     # 🌈 Shared Design Tokens & Theme Configuration
│   ├── types/               # 📐 Shared TypeScript DTOs, Enums & Interfaces
│   └── ui/                  # 🎨 Shared UI Component Library (Radix UI / Shadcn primitives)
├── docs/                    # 📚 Dokumentasi Arsitektur, PRD, & Deployment Guide
├── package.json             # 📦 Root Monorepo Configuration
├── turbo.json               # ⚡ Turborepo Task Pipeline
├── pnpm-workspace.yaml      # 🔗 Workspace Definitions
└── LICENSE                  # 🔒 Proprietary Software License
```

---

## ⚡ Tech Stack

### 🌐 Frontend Publik (`apps/web`)
- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router) + [React](https://react.dev/) 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Animasi & Interaksi**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://greensock.com/gsap/), dan [Lenis](https://github.com/darkroomengineering/lenis) (Smooth Scroll)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Optimasi**: Dynamic OpenGraph generator, JSON-LD Schema (Structured Data), RSS feed (`feed.xml`), dan SEO Semantic Tags

### ⚙️ Admin CMS Dashboard (`apps/cms`)
- **Framework**: Next.js 16 (App Router) + React 19
- **State Management & Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest) v5
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [cmdk](https://cmdk.paco.me/), [Sonner](https://sonner.emilkowal.ski/)
- **Rich Text Editor**: [CKEditor 5](https://ckeditor.com/ckeditor-5/) React
- **Autentikasi Modern**: WebAuthn / Passkeys via `@simplewebauthn/browser` & Session Cookies
- **Visualisasi & Metrik**: [Recharts](https://recharts.org/)

### 🚀 Backend REST API (`apps/api`)
- **Framework**: [AdonisJS](https://adonisjs.com/) v6 (TypeScript-native)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) + [Lucid ORM](https://lucid.adonisjs.com/)
- **Validasi Data**: [VineJS](https://vinejs.dev/)
- **Real-time Engine**: [AdonisJS Transmit](https://github.com/adonisjs/transmit) (Server-Sent Events)
- **Background Jobs & Caching**: [BullMQ](https://bullmq.io/) + [Redis](https://redis.io/) (via `ioredis`)
- **Keamanan**: AdonisJS Shield (CSRF, CSP, XSS), Rate Limiting, HTTP-only Secure Cookies, `@simplewebauthn/server`
- **Media Processing**: [Sharp](https://sharp.pixelplumbing.com/) & [AdonisJS Drive](https://drive.adonisjs.com/)

### 📦 Shared Packages
- **`@growthcoder/types`**: Kontrak tipe data terpadu (DTOs, Response schemas, Model interfaces) dari backend hingga frontend.
- **`@growthcoder/ui`**: Komponen antarmuka yang dapat digunakan ulang (buttons, dialogs, dropdowns, cards).
- **`@growthcoder/tailwind-config`**: Token desain, palet warna kustom, dan utilitas styling.
- **`@growthcoder/config`**: Konfigurasi konsisten untuk TypeScript, ESLint, dan Prettier.

---

## ✨ Fitur Utama

- **Bento Grid Portfolio Showcase**: Presentasi proyek unggulan dengan kartu interaktif, badge teknologi, dan galeri modal.
- **Interactive Career Snapshot**: Visualisasi perjalanan karier dan milestone profesional yang dinamis.
- **End-to-End Type Safety**: Integritas data terjamin 100% dari database query hingga UI rendering.
- **Comprehensive Headless CMS**:
  - Manajemen Artikel Blog, Kategori, dan Tag lengkap dengan SEO metadata preview.
  - Manajemen Proyek Portofolio, Layanan, Testimoni, dan FAQ.
  - Media Library terpusat dengan optimasi gambar otomatis.
  - Inbox pesan masuk dari form kontak publik.
- **Modern & Passwordless Authentication**: Mendukung WebAuthn Passkeys (Biometrik/FIDO2) dan Superadmin credentials.
- **Real-Time Analytics & Live Updates**: Monitoring traffic dan broadcast event langsung ke dashboard.
- **Dark / Light Mode**: Integrasi tema otomatis dengan transisi mulus.
- **High Performance & SEO Optimized**: Core Web Vitals berkinerja tinggi, responsif, dan ramah mesin pencari.

---

## 🚀 Panduan Instalasi & Development

### 1. Prasyarat Sistem
Pastikan telah menginstal utilitas berikut di mesin lokal Anda (sesuai spesifikasi container Docker):
- **Node.js**: `v26.4.0` (atau `v26.x` / base image `node:26-alpine`)
- **pnpm**: `v11.24.0` (`npm install -g pnpm@11.24.0` atau `corepack prepare pnpm@11.24.0 --activate`)
- **PostgreSQL**: `v15` atau lebih baru
- **Redis** (Opsional untuk Queue/Cache): `v7.x`

### 2. Kloning & Instalasi Dependensi
```bash
git clone https://github.com/your-username/growthcoder-portfolio-v2.git
cd growthcoder-portfolio-v2

# Install seluruh workspace dependencies
pnpm install
```

### 3. Konfigurasi Environment Variables
Salin contoh file `.env.example` pada masing-masing aplikasi:

#### Backend API (`apps/api/.env`):
```bash
cp apps/api/.env.example apps/api/.env
```
Sesuaikan konfigurasi koneksi database PostgreSQL, app key, dan port:
```env
PORT=3333
HOST=localhost
NODE_ENV=development
APP_KEY=your_adonis_app_key_generate_here
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=growthcoder_db
```

#### Frontend Web (`apps/web/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### CMS Admin (`apps/cms/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

### 4. Migrasi Database & Seeding Data
Jalankan migrasi tabel dan seeder awal pada aplikasi backend:
```bash
# Generate App Key (jika belum)
pnpm --filter @growthcoder/api exec node ace generate:key

# Jalankan migrasi schema
pnpm --filter @growthcoder/api exec node ace migration:run

# Jalankan seeder (membuat user superadmin default & initial data)
pnpm --filter @growthcoder/api exec node ace db:seed
```

### 5. Menjalankan Server Development
Untuk menjalankan seluruh aplikasi secara paralel:
```bash
pnpm dev
```

Atau jalankan aplikasi secara spesifik:
```bash
# Menjalankan Frontend Web (Port 3000)
pnpm dev:web

# Menjalankan CMS Admin (Port 3001)
pnpm dev:cms

# Menjalankan Backend API (Port 3333)
pnpm dev:api
```

### 6. Pemetaan Port Lokal
| Aplikasi | URL Lokal | Deskripsi |
| :--- | :--- | :--- |
| **Public Web** | `http://localhost:3000` | Website Portofolio Publik |
| **Admin CMS** | `http://localhost:3001` | Dashboard Pengelolaan Konten |
| **Backend API** | `http://localhost:3333` | REST API & WebSocket Server |

---

## 🛠️ Perintah Skrip yang Tersedia

Dijalankan dari direktori *root*:

| Perintah | Deskripsi |
| :--- | :--- |
| `pnpm dev` | Menjalankan seluruh aplikasi dalam mode development |
| `pnpm build` | Mengompilasi seluruh aplikasi dan package untuk tahap produksi |
| `pnpm lint` | Menjalankan pemeriksaan linter (ESLint) di seluruh workspace |
| `pnpm typecheck` | Memvalidasi tipe TypeScript di seluruh aplikasi dan package |
| `pnpm format` | Memformat kode menggunakan Prettier |
| `pnpm clean` | Membersihkan cache Turborepo dan folder `node_modules` |

---

## 🚢 Deployment

Aplikasi ini siap di-deploy secara mandiri maupun terorkestrasi menggunakan Docker:
- Masing-masing aplikasi (`apps/api`, `apps/cms`, `apps/web`) telah dilengkapi dengan `Dockerfile` multi-stage yang teroptimasi.
- Panduan lengkap deployment menggunakan **Coolify / VPS Docker Compose** dapat dilihat pada dokumen:  
  👉 [`docs/COOLIFY_DEPLOYMENT_GUIDE.md`](./docs/COOLIFY_DEPLOYMENT_GUIDE.md)

---

## 📄 Lisensi

Hak Cipta © 2024-2026 **Muhammad Ihsan Maulana** (`growthcoder.id`).

Proyek ini dilindungi di bawah **PROPRIETARY SOFTWARE LICENSE — ALL RIGHTS RESERVED**.  
Dilarang keras menyalin, memodifikasi, mendistribusikan, menerbitkan kembali, atau menggunakan kode sumber ini untuk kepentingan komersial maupun publik tanpa izin tertulis dari pemilik hak cipta.

Detail ketentuan lisensi selengkapnya dapat dilihat pada berkas [LICENSE](./LICENSE).
