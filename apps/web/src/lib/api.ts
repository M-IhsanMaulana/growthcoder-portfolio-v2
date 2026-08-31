import type {
  ApiResponse,
  PaginationMeta,
  SiteSettingsData,
  SiteProfile,
  SiteAboutConfig,
  SiteAppearanceConfig,
  MaintenanceConfig,
  SeoDefaults,
  Project,
  ProjectCategory,
  ProjectFilterParams,
  TechStack,
  Experience,
  Education,
  Certification,
  DevelopmentPhilosophy,
  Article,
  ArticleFilterParams,
  Category,
  Tag,
  Service,
  ServiceFaq,
  WorkflowStep,
  ContactInbox,
  CreateInboxRequest,
  Expertise,
  StatItem,
} from "@growthcoder/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_URL || API_BASE_URL;

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const baseUrl = MEDIA_BASE_URL.replace(/\/$/, "");
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

/**
 * Safe fetch wrapper with 3s timeout to prevent Docker build hangs during SSG pre-rendering
 */
export async function safeFetch(
  url: string | URL | Request,
  init?: RequestInit,
  timeoutMs = 3000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...init,
      signal: init?.signal || controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const DEFAULT_SITE_PROFILE: SiteProfile = {
  siteName: "GrowthCoder",
  ownerName: "Muhammad Ihsan Maulana",
  tagline: "Full-Stack Web Developer",
  bio: "Software engineer berdedikasi yang berfokus pada ekosistem Full-Stack Web Development modern (Next.js, AdonisJS, TypeScript, Tailwind CSS, PostgreSQL) dengan performa tinggi dan skalabel.",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  cvFileUrl: "/uploads/cv-muhammad-ihsan-maulana.pdf",
  email: "admin@growthcoder.id",
  phone: "+628123456789",
  location: "Indonesia",
  roles: ["Full-Stack Web Developer"],
  socials: {
    github: "https://github.com/growthcoder",
    linkedin: "https://linkedin.com/in/growthcoder",
    twitter: "https://twitter.com/growthcoder",
    telegram: "https://t.me/growthcoder",
    instagram: "https://instagram.com/growthcoder",
  },
};

export const DEFAULT_ABOUT_CONFIG: SiteAboutConfig = {
  storyHtml: `
    <p>Halo! Saya <strong>Muhammad Ihsan Maulana</strong>, seorang <strong>Full-Stack Software Engineer &amp; System Architect</strong> dengan dedikasi lebih dari 5 tahun dalam membangun aplikasi web modern, sistem terdistribusi, dan platform enterprise berkinerja tinggi.</p>
    <p>Perjalanan rekayasa perangkat lunak saya dimulai dari ketertarikan mendalam pada bagaimana data mengalir di balik antarmuka pengguna hingga bagaimana arsitektur database dapat dioptimalkan untuk memproses jutaan transaksi per detik dengan latensi minimal.</p>
    <h3>Keahlian Inti &amp; Pendekatan Teknis</h3>
    <p>Spesialisasi saya berakar kuat pada ekosistem <strong>TypeScript Full-Stack</strong> modern: Next.js App Router (RSC &amp; Server Actions), AdonisJS v6, Node.js, PostgreSQL dengan optimasi query mendalam, arsitektur Redis caching, serta pipeline automated CI/CD berbasis Docker.</p>
    <p>Dalam setiap proyek, saya memprioritaskan:</p>
    <ul>
      <li><strong>Type Safety End-to-End</strong>: Menghilangkan bug runtime dari skema database ORM hingga interaksi klien.</li>
      <li><strong>Arsitektur Skalabel &amp; Resilient</strong>: Memastikan sistem siap bertumbuh seiring lonjakan trafik bisnis.</li>
      <li><strong>Estetika &amp; Developer Experience</strong>: UI/UX modern dengan aksesibilitas tinggi dan dokumentasi kode yang rapi.</li>
    </ul>
    <h3>Komitmen pada Kualitas &amp; Best Practices</h3>
    <p>Saya percaya bahwa kode perangkat lunak terbaik bukan hanya yang bekerja saat ini, melainkan yang dapat dipelihara dengan mudah oleh tim di masa depan, teruji secara komprehensif, dan membawa dampak positif nyata bagi pengguna akhir.</p>
  `,
  yearsOfExperience: "5+ Tahun",
  projectsCompleted: "30+ Proyek",
  clientsSatisfied: "20+ Mitra & Klien",
  availabilityStatus: "Tersedia untuk Kontrak & Konsultasi",
  availabilityActive: true,
  quote: "Code is like humor. When you have to explain it, it’s bad.",
  quoteAuthor: "Cory House",
};

export const DEFAULT_APPEARANCE_CONFIG: SiteAppearanceConfig = {
  navbarStyle: "floating",
};

export const DEFAULT_MAINTENANCE_CONFIG: MaintenanceConfig = {
  isActive: false,
  headline: "Sistem Sedang Dalam Pemeliharaan Terjadwal",
  message:
    "Kami sedang melakukan peningkatan performa infrastruktur dan database. Kami akan segera kembali.",
  estimatedEndTime: undefined,
};

export const DEFAULT_SEO_CONFIG: SeoDefaults = {
  metaTitle: "GrowthCoder — Full-Stack Web Developer",
  metaDescription:
    "Portofolio pribadi, studi kasus proyek, serta artikel seputar teknologi, edukasi, karir, dan tips oleh Muhammad Ihsan Maulana.",
  metaKeywords: [
    "Full-Stack Developer",
    "Next.js",
    "AdonisJS",
    "PostgreSQL",
    "TypeScript",
    "Blog Personal",
    "Tips Karir",
  ],
  ogImageUrl: "https://growthcoder.id/og-image.png",
};

export const DEFAULT_STATS: StatItem[] = [
  {
    id: "stat-1",
    label: "Tahun Pengalaman",
    value: 5,
    suffix: "+",
    prefix: "",
    order: 1,
  },
  {
    id: "stat-2",
    label: "Proyek & Sistem Produksi",
    value: 25,
    suffix: "+",
    prefix: "",
    order: 2,
  },
  {
    id: "stat-3",
    label: "Target PageSpeed & Core Web Vitals",
    value: 98,
    suffix: "+",
    prefix: "",
    order: 3,
  },
  {
    id: "stat-4",
    label: "Type Safety Contract",
    value: 100,
    suffix: "%",
    prefix: "",
    order: 4,
  },
];

export const FALLBACK_EXPERTISES: Expertise[] = [
  {
    id: "exp-1",
    title: "Backend Architecture & Distributed Systems",
    slug: "backend-architecture-distributed-systems",
    subtitle: "Spesialisasi Backend & Data",
    description:
      "Perancangan RESTful API modular, optimasi skema PostgreSQL terindeks, Redis caching layer, serta background worker (BullMQ/Redis) untuk sistem berkapasitas tinggi.",
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/><path d="M18 10v4"/><path d="m15 12 3 2 3-2"/></svg>`,
    order: 1,
    isFeatured: true,
    techStacks: [
      {
        id: "ts-3",
        name: "AdonisJS v6",
        slug: "adonisjs",
        category: "backend",
        isFeatured: true,
        order: 3,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-4",
        name: "PostgreSQL",
        slug: "postgresql",
        category: "database",
        isFeatured: true,
        order: 4,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-7",
        name: "Redis",
        slug: "redis",
        category: "database",
        isFeatured: false,
        order: 7,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-2",
        name: "TypeScript",
        slug: "typescript",
        category: "frontend",
        isFeatured: true,
        order: 2,
        createdAt: "",
        updatedAt: "",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "exp-2",
    title: "Modern Frontend Engineering & UI/UX Craft",
    slug: "frontend-engineering-ui-ux-craft",
    subtitle: "Spesialisasi Frontend & Interaksi",
    description:
      "Membangun antarmuka modern yang cepat (Next.js App Router, SSR/ISR), interaktif dengan micro-animations, aksesibel, dan terhubung mulus dengan kontrak API yang type-safe.",
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/><path d="m7 8 2 2-2 2"/><path d="M13 12h4"/></svg>`,
    order: 2,
    isFeatured: true,
    techStacks: [
      {
        id: "ts-1",
        name: "Next.js 16",
        slug: "nextjs",
        category: "frontend",
        isFeatured: true,
        order: 1,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-2",
        name: "TypeScript",
        slug: "typescript",
        category: "frontend",
        isFeatured: true,
        order: 2,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-5",
        name: "Tailwind CSS v4",
        slug: "tailwindcss",
        category: "frontend",
        isFeatured: true,
        order: 5,
        createdAt: "",
        updatedAt: "",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "exp-3",
    title: "Monorepo, Security & Engineering Best Practices",
    slug: "monorepo-security-engineering-best-practices",
    subtitle: "Fondasi Arsitektur & Kualitas Kode",
    description:
      "Penerapan struktur PNPM Turborepo monorepo, autentikasi mutakhir FIDO2 WebAuthn Passkeys, pengujian otomatis, containerization Docker, dan pipeline deployment andal.",
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    order: 3,
    isFeatured: true,
    techStacks: [
      {
        id: "ts-6",
        name: "Docker & K8s",
        slug: "docker",
        category: "devops",
        isFeatured: true,
        order: 6,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-2",
        name: "TypeScript",
        slug: "typescript",
        category: "frontend",
        isFeatured: true,
        order: 2,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-3",
        name: "AdonisJS v6",
        slug: "adonisjs",
        category: "backend",
        isFeatured: true,
        order: 3,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-1",
        name: "Next.js 16",
        slug: "nextjs",
        category: "frontend",
        isFeatured: true,
        order: 1,
        createdAt: "",
        updatedAt: "",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  profile: DEFAULT_SITE_PROFILE,
  about: DEFAULT_ABOUT_CONFIG,
  appearance: DEFAULT_APPEARANCE_CONFIG,
  maintenance: DEFAULT_MAINTENANCE_CONFIG,
  seo: DEFAULT_SEO_CONFIG,
  stats: DEFAULT_STATS,
};

export const FALLBACK_TECH_STACKS: TechStack[] = [
  {
    id: "ts-1",
    name: "Next.js 16",
    slug: "nextjs",
    category: "frontend",
    isFeatured: true,
    level: 95,
    order: 1,
    iconSvg: `<svg viewBox="0 0 180 180" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_next" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180" style="mask-type:alpha"><circle cx="90" cy="90" r="90" fill="black"/></mask><g mask="url(#mask0_next)"><circle cx="90" cy="90" r="90" fill="black"/><path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white"/><path d="M115.855 54H127.969V126H115.855V54Z" fill="white"/></g></svg>`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ts-2",
    name: "TypeScript",
    slug: "typescript",
    category: "frontend",
    isFeatured: true,
    level: 95,
    order: 2,
    iconSvg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#3178C6" d="M0 0h128v128H0z"/><path fill="#FFF" d="M57.6 72.8c-2.3 3.6-5.8 5.7-10.4 5.7-7.2 0-11.8-4.9-11.8-12.8 0-8.1 4.7-13.1 12-13.1 4.3 0 7.7 1.9 9.8 5.1l5.5-4.2c-3.5-4.7-8.9-7.4-15.3-7.4-12.2 0-20.1 8-20.1 20 0 11.8 7.8 19.6 19.9 19.6 6.7 0 12.3-3 15.9-8.1l-5.5-4.8zm30.3-25.7H66.6V54h9.7v32.6h8.2V54h9.7l-.3-6.9z"/></svg>`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ts-3",
    name: "AdonisJS v6",
    slug: "adonisjs",
    category: "backend",
    isFeatured: true,
    level: 92,
    order: 3,
    iconSvg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><polygon points="50,10 90,85 10,85" fill="#5A45FF"/><polygon points="50,35 75,80 25,80" fill="#220052"/></svg>`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ts-4",
    name: "PostgreSQL",
    slug: "postgresql",
    category: "database",
    isFeatured: true,
    level: 90,
    order: 4,
    iconSvg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#336791" d="M63.8 0C28.6 0 0 28.6 0 63.8c0 35.2 28.6 63.8 63.8 63.8 35.2 0 63.8-28.6 63.8-63.8C127.6 28.6 99 0 63.8 0z"/></svg>`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ts-5",
    name: "Tailwind CSS v4",
    slug: "tailwindcss",
    category: "frontend",
    isFeatured: true,
    level: 95,
    order: 5,
    iconSvg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#38BDF8" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm0 121.6C32.2 121.6 6.4 95.8 6.4 64S32.2 6.4 64 6.4s57.6 25.8 57.6 57.6-25.8 57.6-57.6 57.6z"/></svg>`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ts-6",
    name: "Docker & K8s",
    slug: "docker",
    category: "devops",
    isFeatured: true,
    level: 88,
    order: 6,
    iconSvg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#2496ED" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0z"/></svg>`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ts-7",
    name: "Redis",
    slug: "redis",
    category: "database",
    isFeatured: false,
    level: 85,
    order: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ts-8",
    name: "GraphQL",
    slug: "graphql",
    category: "backend",
    isFeatured: false,
    level: 90,
    order: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const FALLBACK_PROJECT_CATEGORIES: ProjectCategory[] = [
  {
    id: "cat-1",
    name: "Web Application",
    slug: "web-app",
    description:
      "Aplikasi web modern berbasis Next.js, React, dan Progressive Web Apps.",
    order: 1,
    projectsCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat-2",
    name: "Enterprise System",
    slug: "enterprise-system",
    description:
      "Sistem otomasi skala perusahaan, ERP, HRMS, dan manajemen payroll.",
    order: 2,
    projectsCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat-3",
    name: "IoT & Telematics",
    slug: "iot-telematics",
    description:
      "Sistem pelacakan armada dan engine IoT real-time berlatensi rendah.",
    order: 3,
    projectsCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat-4",
    name: "Cloud & Microservices",
    slug: "cloud-microservices",
    description:
      "Arsitektur cloud-native, Kubernetes cluster, dan microservices API.",
    order: 4,
    projectsCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const FALLBACK_ALL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "GrowthCoder Enterprise Monorepo V2",
    slug: "growthcoder-portfolio-v2",
    excerpt:
      "Modernisasi arsitektur portofolio terpadu & CMS enterprise menggunakan Next.js 16, AdonisJS v6, dan PostgreSQL dengan PNPM Turborepo.",
    content: `## 📌 Latar Belakang & Masalah Bisnis
Website portofolio sebelumnya memiliki arsitektur monolitik yang sulit di-maintain, ketergantungan paket frontend dan backend saling mengunci, serta performa rendering halaman yang belum optimal saat memuat visual dan galeri interaktif. Dibutuhkan arsitektur monorepo skala enterprise yang memisahkan aplikasi web publik, CMS dashboard berkeamanan tinggi, dan service API AdonisJS v6 yang terpisah namun berbagi tipe data secara konsisten.

## 🛠️ Solusi Teknis & Rekayasa Perangkat Lunak
Kami merancang arsitektur monorepo modern berbasis PNPM Turborepo dengan boundary yang tegas antar package:
- **Web App (\`apps/web\`)**: Next.js 16 App Router dengan React Server Components (RSC), Incremental Static Regeneration (ISR) untuk halaman dinamis, serta integrasi Framer Motion untuk storytelling visual.
- **Admin CMS (\`apps/cms\`)**: Dashboard admin Next.js terproteksi otentikasi ganda (Password + WebAuthn FIDO2 Passkeys) dengan audit logging mutasi data asinkron.
- **REST API (\`apps/api\`)**: AdonisJS v6 dengan Lucid ORM, arsitektur controller berlapis, view counter anti-spam otomatis berbasis visitor hashing, dan rate-limiting terintegrasi.
- **Shared Packages**: \`@growthcoder/types\` dan \`@growthcoder/ui\` untuk standarisasi desain token Tailwind CSS dan validasi schema Zod.

## 🏗️ Diagram & Sorotan Arsitektur
Arsitektur dirancang dengan pemisahan query read-only publik berkecepatan tinggi dan mutasi data admin terotentikasi:
\`\`\`text
[ Client Browser ] ---> [ Next.js 16 Web (ISR / Edge Cache) ] ---> [ AdonisJS v6 API ]
[ Admin Device   ] ---> [ Next.js CMS (Passkeys FIDO2 / RBAC) ] ---> [ PostgreSQL DB ]
\`\`\`

## 📈 Hasil & Metrik Performa
- **Lighthouse Score**: Mencapai 98+ pada Performance, 100 pada SEO, dan 100 pada Accessibility.
- **Response Time**: Rata-rata response time API di bawah 25ms untuk query publik berkat indexing database optimal.
- **Keamanan**: Pengurangan resiko brute-force berkat implementasi WebAuthn Passkeys dan middleware anti-spam session tracking.`,
    clientName: "Internal GrowthCoder R&D",
    projectYear: 2026,
    coverImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://growthcoder.id",
    repositoryUrl: "https://github.com/growthcoder/portfolio-v2",
    isFeatured: true,
    order: 1,
    viewCount: 1420,
    demoClickCount: 384,
    repoClickCount: 290,
    categoryId: "cat-1",
    category: FALLBACK_PROJECT_CATEGORIES[0],
    techStacks: [
      {
        id: "ts-1",
        name: "Next.js 16",
        slug: "nextjs",
        category: "frontend",
        isFeatured: true,
        order: 1,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-2",
        name: "TypeScript",
        slug: "typescript",
        category: "frontend",
        isFeatured: true,
        order: 2,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-3",
        name: "AdonisJS v6",
        slug: "adonisjs",
        category: "backend",
        isFeatured: true,
        order: 3,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-4",
        name: "PostgreSQL",
        slug: "postgresql",
        category: "database",
        isFeatured: true,
        order: 4,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-5",
        name: "Tailwind CSS v4",
        slug: "tailwindcss",
        category: "frontend",
        isFeatured: true,
        order: 5,
        createdAt: "",
        updatedAt: "",
      },
    ],
    galleries: [
      {
        id: "gal-1",
        projectId: "proj-1",
        imageUrl:
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
        caption: "Tampilan Landing Page Interaktif & Bento Grid Showcase",
        sortOrder: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: "gal-2",
        projectId: "proj-1",
        imageUrl:
          "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
        caption: "CMS Dashboard Enterprise dengan Otentikasi WebAuthn Passkeys",
        sortOrder: 2,
        createdAt: new Date().toISOString(),
      },
      {
        id: "gal-3",
        projectId: "proj-1",
        imageUrl:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        caption: "Struktur Monorepo PNPM & Pipeline Build Turborepo",
        sortOrder: 3,
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-2",
    title: "Enterprise HRMS & Payroll Automation",
    slug: "enterprise-hrms-payroll",
    excerpt:
      "Sistem otomasi manajemen SDM dan penggajian multinasional dengan perhitungan PPh 21 TER dinamis dan integrasi absensi biometrik.",
    content: `## 📌 Latar Belakang & Masalah Bisnis
Perusahaan dengan lebih dari 5,000 karyawan menghadapi inefisiensi perhitungan pajak penghasilan bulanan (PPh 21 skema TER) dan sinkronisasi data absensi dari puluhan kantor cabang. Proses manual membutuhkan waktu 5 hari kerja setiap akhir bulan dengan potensi kesalahan rekapitulasi data.

## 🛠️ Solusi Teknis & Rekayasa Perangkat Lunak
Membangun platform HRMS terpusat dengan modul engine kalkulasi otomatis:
- **Kalkulasi Pajak Dinamis**: Algoritma kalkulasi PPh 21 TER (Tarif Efektif Rata-rata) otomatis berdasarkan status PTKP dan penghasilan bruto kumulatif.
- **Biometric Integration**: Sinkronisasi log mesin absensi biometrik via protokol TCP/IP dan REST webhook ke database terpusat.
- **Background Worker**: Pemrosesan slip gaji dan dokumen PDF terenkripsi secara asinkron menggunakan Redis Queue.

## 📈 Hasil & Metrik Performa
- Pemrosesan payroll dari 5 hari berkurang menjadi **kurang dari 15 menit**.
- Akurasi perhitungan pajak dan BPJS Ketenagakerjaan mencapai **100% compliant** sesuai regulasi perpajakan terbaru.`,
    clientName: "PT Global Mitra Korpora",
    projectYear: 2025,
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://demo-hrms.growthcoder.id",
    isFeatured: true,
    order: 2,
    viewCount: 980,
    demoClickCount: 210,
    repoClickCount: 0,
    categoryId: "cat-2",
    category: FALLBACK_PROJECT_CATEGORIES[1],
    techStacks: [
      {
        id: "ts-2",
        name: "TypeScript",
        slug: "typescript",
        category: "frontend",
        isFeatured: true,
        order: 2,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-3",
        name: "AdonisJS v6",
        slug: "adonisjs",
        category: "backend",
        isFeatured: true,
        order: 3,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-4",
        name: "PostgreSQL",
        slug: "postgresql",
        category: "database",
        isFeatured: true,
        order: 4,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-7",
        name: "Redis",
        slug: "redis",
        category: "database",
        isFeatured: false,
        order: 7,
        createdAt: "",
        updatedAt: "",
      },
    ],
    galleries: [
      {
        id: "gal-21",
        projectId: "proj-2",
        imageUrl:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        caption:
          "Dashboard Analitik Distribusi Payroll & Metrik Kehadiran Karyawan",
        sortOrder: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: "gal-22",
        projectId: "proj-2",
        imageUrl:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        caption:
          "Engine Konfigurasi Skema Pajak PPh 21 TER dan Komponen Tunjangan",
        sortOrder: 2,
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-3",
    title: "Smart Logistics & Fleet Telematics Engine",
    slug: "smart-logistics-telematics",
    excerpt:
      "Sistem pelacak armada logistik berbasis IoT dengan pemrosesan geofencing real-time dan optimasi rute otomatis.",
    content: `## 📌 Latar Belakang & Masalah Bisnis
Operasional armada kargo darat sering mengalami ketidakpastian posisi, rute tidak efisien, dan sulitnya mendeteksi deviasi jalur pengiriman yang mengakibatkan pemborosan bahan bakar hingga 22%.

## 🛠️ Solusi Teknis & Rekayasa Perangkat Lunak
- **Event-Driven Telematics**: Menerima data koordinat GPS, kecepatan, dan temperatur kargo setiap 5 detik via MQTT broker.
- **Geofencing & Polygon Collision Detection**: Algoritma komputasi geospasial real-time menggunakan PostGIS untuk mendeteksi saat armada memasuki/keluar dari zona gudang atau rute terlarang.
- **Live Fleet Tracking Map**: Antarmuka berbasis WebGL / MapLibre GL dengan rendering ribuan penanda armada tanpa frame drop.`,
    clientName: "TransLogistik Nusantara",
    projectYear: 2024,
    coverImage:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://logistics.growthcoder.id",
    isFeatured: true,
    order: 3,
    viewCount: 1120,
    demoClickCount: 340,
    repoClickCount: 110,
    categoryId: "cat-3",
    category: FALLBACK_PROJECT_CATEGORIES[2],
    techStacks: [
      {
        id: "ts-1",
        name: "Next.js",
        slug: "nextjs",
        category: "frontend",
        isFeatured: true,
        order: 1,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-4",
        name: "PostgreSQL",
        slug: "postgresql",
        category: "database",
        isFeatured: true,
        order: 4,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-6",
        name: "Docker & K8s",
        slug: "docker",
        category: "devops",
        isFeatured: true,
        order: 6,
        createdAt: "",
        updatedAt: "",
      },
    ],
    galleries: [
      {
        id: "gal-31",
        projectId: "proj-3",
        imageUrl:
          "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
        caption: "Live Telematics Dashboard & Pemantauan Geofencing Armada",
        sortOrder: 1,
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-4",
    title: "Healthcare Clinic Management & E-Prescription",
    slug: "healthcare-clinic-management",
    excerpt:
      "Sistem Informasi Manajemen Fasilitas Kesehatan Terpadu (SIMKES) dengan bridging SatuSehat Kemenkes dan resep elektronik digital.",
    content: `## 📌 Latar Belakang & Masalah Bisnis
Klinik pratama dan utama membutuhkan digitalisasi rekam medis elektronik (RME) yang wajib terintegrasi dengan platform SatuSehat Kementerian Kesehatan Republik Indonesia sesuai regulasi Permenkes No. 24/2022.

## 🛠️ Solusi Teknis & Rekayasa Perangkat Lunak
- **FHIR Protocol Bridging**: Konversi payload RME ke standar HL7 FHIR (Encounter, Condition, Observation, Medication) untuk integrasi REST API SatuSehat.
- **E-Prescription Workflow**: Alur otomatisasi dari dokter ke bagian farmasi dengan validasi stok obat real-time dan barcode scanner.
- **Data Encryption**: Enkripsi data sensitif pasien pada level database (AES-256) untuk menjamin privasi medis.`,
    clientName: "Klinik Sehat Bersama",
    projectYear: 2025,
    coverImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://simkes-demo.growthcoder.id",
    isFeatured: false,
    order: 4,
    viewCount: 650,
    demoClickCount: 140,
    repoClickCount: 0,
    categoryId: "cat-2",
    category: FALLBACK_PROJECT_CATEGORIES[1],
    techStacks: [
      {
        id: "ts-1",
        name: "Next.js 16",
        slug: "nextjs",
        category: "frontend",
        isFeatured: true,
        order: 1,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-2",
        name: "TypeScript",
        slug: "typescript",
        category: "frontend",
        isFeatured: true,
        order: 2,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-4",
        name: "PostgreSQL",
        slug: "postgresql",
        category: "database",
        isFeatured: true,
        order: 4,
        createdAt: "",
        updatedAt: "",
      },
    ],
    galleries: [
      {
        id: "gal-41",
        projectId: "proj-4",
        imageUrl:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
        caption:
          "Antarmuka Rekam Medis Elektronik Terintegrasi Standar FHIR SatuSehat",
        sortOrder: 1,
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-5",
    title: "High-Throughput Fintech Payment Gateway Bridge",
    slug: "fintech-payment-gateway-bridge",
    excerpt:
      "Middleware router transaksi pembayaran multikanal (QRIS, Virtual Account, E-Wallet) dengan failover otomatis dan rekonsiliasi instan.",
    content: `## 📌 Latar Belakang & Masalah Bisnis
Kebutuhan agregasi pembayaran dari berbagai acquiring bank dan merchant aggregator tanpa adanya single point of failure saat salah satu bank mengalami gangguan gateway.

## 🛠️ Solusi Teknis & Rekayasa Perangkat Lunak
- **Smart Gateway Routing**: Routing cerdas otomatis yang mengalihkan jalur transaksi ke payment provider sekunder jika latency provider utama melebihi 1,500ms.
- **Idempotency Engine**: Mencegah double-charge dengan mekanisme Redis distributed locking dan payload signature validation (HMAC SHA-256).
- **Auto Reconciliation**: Rekonsiliasi harian otomatis data mutasi bank dengan data invoice merchant.`,
    clientName: "Fintech Nusantara Asia",
    projectYear: 2024,
    coverImage:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    repositoryUrl: "https://github.com/growthcoder/fintech-payment-bridge",
    isFeatured: false,
    order: 5,
    viewCount: 890,
    demoClickCount: 0,
    repoClickCount: 310,
    categoryId: "cat-4",
    category: FALLBACK_PROJECT_CATEGORIES[3],
    techStacks: [
      {
        id: "ts-3",
        name: "AdonisJS v6",
        slug: "adonisjs",
        category: "backend",
        isFeatured: true,
        order: 3,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-7",
        name: "Redis",
        slug: "redis",
        category: "database",
        isFeatured: false,
        order: 7,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-6",
        name: "Docker & K8s",
        slug: "docker",
        category: "devops",
        isFeatured: true,
        order: 6,
        createdAt: "",
        updatedAt: "",
      },
    ],
    galleries: [
      {
        id: "gal-51",
        projectId: "proj-5",
        imageUrl:
          "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
        caption: "Arsitektur Transaksi Pembayaran Multikanal & Monitor Latency",
        sortOrder: 1,
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const FALLBACK_FEATURED_PROJECTS: Project[] =
  FALLBACK_ALL_PROJECTS.filter((p) => p.isFeatured);

export const FALLBACK_CAREER_EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    company: "GrowthCoder Solutions",
    position: "Lead Full-Stack Architect",
    location: "Jakarta, Indonesia",
    employmentType: "full-time",
    startDate: "2024-01-01",
    isCurrent: true,
    description: `<p>Bertanggung jawab memimpin visi arsitektur rekayasa perangkat lunak monorepo berbasis <strong>Next.js 16</strong> dan <strong>AdonisJS v6</strong>, mengawal standar keamanan <strong>WebAuthn Passkeys</strong>, serta merancang pipeline CI/CD zero-downtime.</p><p>Mengoptimalkan performa web aplikasi hingga meraih skor Lighthouse 99+ dan membimbing tim engineer dalam penerapan Clean Architecture serta Test-Driven Development (TDD).</p>`,
    order: 1,
    techStacks: [
      {
        id: "ts-1",
        name: "Next.js 16",
        slug: "nextjs",
        category: "frontend",
        isFeatured: true,
        order: 1,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-3",
        name: "AdonisJS v6",
        slug: "adonisjs",
        category: "backend",
        isFeatured: true,
        order: 3,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-4",
        name: "PostgreSQL",
        slug: "postgresql",
        category: "database",
        isFeatured: true,
        order: 4,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-2",
        name: "TypeScript",
        slug: "typescript",
        category: "frontend",
        isFeatured: true,
        order: 2,
        createdAt: "",
        updatedAt: "",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "exp-2",
    company: "TechScale Innovations",
    position: "Senior Backend & Cloud Engineer",
    location: "Bandung, Indonesia",
    employmentType: "full-time",
    startDate: "2022-03-01",
    endDate: "2023-12-31",
    isCurrent: false,
    description: `<p>Mengembangkan service REST &amp; WebSocket API berkinerja tinggi yang menangani jutaan transaksi per bulan dengan latensi respons rata-rata di bawah 45ms.</p><p>Merancang orkestrasi container menggunakan <strong>Docker &amp; Kubernetes</strong>, mengelola replikasi database <strong>PostgreSQL</strong>, serta menerapkan multi-tier caching berbasis <strong>Redis</strong>.</p>`,
    order: 2,
    techStacks: [
      {
        id: "ts-3",
        name: "Node.js / AdonisJS",
        slug: "adonisjs",
        category: "backend",
        isFeatured: true,
        order: 3,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-6",
        name: "Docker & Linux",
        slug: "docker",
        category: "devops",
        isFeatured: true,
        order: 6,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-7",
        name: "Redis",
        slug: "redis",
        category: "backend",
        isFeatured: false,
        order: 7,
        createdAt: "",
        updatedAt: "",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "exp-3",
    company: "Digital Nusantara Studio",
    position: "Full-Stack Web Developer",
    location: "Indonesia",
    employmentType: "full-time",
    startDate: "2020-06-01",
    endDate: "2022-02-28",
    isCurrent: false,
    description: `<p>Membangun lebih dari 15+ solusi aplikasi web kustom untuk klien skala enterprise di berbagai sektor industri menggunakan <strong>Laravel, PHP, TypeScript, Next.js, dan Tailwind CSS</strong>.</p><p>Mengembangkan dashboard administrasi, integrasi payment gateway perbankan, dan sistem manajemen inventaris real-time.</p>`,
    order: 3,
    techStacks: [
      {
        id: "ts-2",
        name: "TypeScript",
        slug: "typescript",
        category: "frontend",
        isFeatured: true,
        order: 2,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-4",
        name: "PostgreSQL",
        slug: "postgresql",
        category: "database",
        isFeatured: true,
        order: 4,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "ts-1",
        name: "Next.js",
        slug: "nextjs",
        category: "frontend",
        isFeatured: true,
        order: 1,
        createdAt: "",
        updatedAt: "",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const FALLBACK_EDUCATIONS: Education[] = [
  {
    id: "edu-1",
    institution: "Universitas Bina Nusantara (BINUS University)",
    degree: "Sarjana Komputer (S.Kom)",
    fieldOfStudy: "Teknik Informatika / Computer Science",
    institutionLogoUrl: "",
    startDate: "2016-09-01",
    endDate: "2020-08-31",
    isCurrent: false,
    grade: "IPK 3.85 / 4.00 (Cum Laude)",
    description: `<p>Fokus pada <strong>Rekayasa Perangkat Lunak</strong>, Struktur Data &amp; Algoritma Lanjutan, Sistem Basis Data Terdistribusi, serta Arsitektur Komputasi Cloud.</p><p>Menyelesaikan skripsi bertema arsitektur microservices terdistribusi dengan predikat <em>Cum Laude</em> dan aktif dalam riset laboratorium kecerdasan buatan.</p>`,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "edu-2",
    institution: "SMK Negeri 1 Cimahi",
    degree: "SMK (Vocational High School)",
    fieldOfStudy: "Rekayasa Perangkat Lunak (RPL)",
    institutionLogoUrl: "",
    startDate: "2013-07-01",
    endDate: "2016-06-30",
    isCurrent: false,
    grade: "Nilai Kejuruan 9.2",
    description: `<p>Selama menempuh pendidikan di jurusan <strong>Rekayasa Perangkat Lunak (RPL)</strong>, saya mempelajari dasar-dasar pengembangan perangkat lunak, algoritma pemrograman, serta pembuatan aplikasi berbasis web. Mengenal teknologi seperti <strong>HTML5, CSS, JavaScript, PHP dan Laravel</strong> yang menjadi fondasi awal dalam perjalanan saya sebagai web developer.</p><p>Selain kegiatan akademik, aktif dalam organisasi kesiswaan yang mengembangkan kemampuan kepemimpinan, komunikasi, kerja sama tim, dan manajemen proyek.</p>`,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const FALLBACK_CERTIFICATIONS: Certification[] = [];

export const FALLBACK_PHILOSOPHIES: DevelopmentPhilosophy[] = [
  {
    id: "phil-1",
    title: "Clean Architecture & Simplicity",
    tagline:
      "Kesederhanaan desain kode menghasilkan stabilitas jangka panjang.",
    description:
      "Memisahkan logika bisnis inti (Domain) dari detail infrastruktur dan framework. Kode yang mudah dibaca dan dipahami jauh lebih berharga daripada solusi rumit yang sulit didebug.",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "phil-2",
    title: "End-to-End Type Safety",
    tagline:
      "Deteksi kesalahan di compile-time, bukan saat produksi di hadapan pengguna.",
    description:
      "Memanfaatkan TypeScript dari skema ORM, payload API, hingga komponen UI. Kepercayaan diri tinggi saat melakukan refactoring besar tanpa khawatir merusak fungsionalitas lain.",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "phil-3",
    title: "Performance by Design & Zero Bloat",
    tagline:
      "Kecepatan bukan sekadar fitur, melainkan pilar utama kenyamanan pengguna.",
    description:
      "Mengoptimalkan bundle size, memanfaatkan Server-Side Rendering (SSR/RSC), caching bertingkat, dan indexing database cerdas untuk respons sub-100ms.",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "phil-4",
    title: "Comprehensive Automated Testing",
    tagline:
      "Kode yang tidak teruji adalah kode yang sewaktu-waktu dapat rusak.",
    description:
      "Menerapkan Test-Driven Development (TDD) yang proporsional: Unit tests untuk logika bisnis kritis, integration tests untuk endpoint API, dan end-to-end (E2E) untuk alur transaksi vital.",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const FALLBACK_ARTICLE_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Software Architecture",
    slug: "software-architecture",
    description:
      "Pola arsitektur monorepo, microservices, dan sistem terdistribusi.",
    postsCount: 3,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "cat-2",
    name: "Security & Auth",
    slug: "security-auth",
    description:
      "Standar keamanan modern, WebAuthn passkeys, dan otentikasi zero-trust.",
    postsCount: 2,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "cat-3",
    name: "Database & Backend",
    slug: "database-backend",
    description:
      "Optimasi query PostgreSQL, indexing, ORM performance, dan Redis caching.",
    postsCount: 3,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "cat-4",
    name: "DevOps & Infrastructure",
    slug: "devops-infra",
    description:
      "CI/CD automated pipelines, Docker containerization, dan cloud deployment.",
    postsCount: 2,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "cat-5",
    name: "Frontend Engineering",
    slug: "frontend-engineering",
    description:
      "Next.js App Router, React 19 Server Components, dan micro-animations.",
    postsCount: 2,
    createdAt: "",
    updatedAt: "",
  },
];

export const FALLBACK_ARTICLE_TAGS: Tag[] = [
  {
    id: "tag-1",
    name: "Next.js 16",
    slug: "nextjs-16",
    postsCount: 4,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "tag-2",
    name: "AdonisJS v6",
    slug: "adonisjs-v6",
    postsCount: 3,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "tag-3",
    name: "TypeScript",
    slug: "typescript",
    postsCount: 5,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "tag-4",
    name: "PostgreSQL",
    slug: "postgresql",
    postsCount: 3,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "tag-5",
    name: "WebAuthn",
    slug: "webauthn",
    postsCount: 2,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "tag-6",
    name: "Docker",
    slug: "docker",
    postsCount: 2,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "tag-7",
    name: "Performance",
    slug: "performance",
    postsCount: 4,
    createdAt: "",
    updatedAt: "",
  },
];

export const FALLBACK_ALL_ARTICLES: Article[] = [
  {
    id: "art-1",
    title:
      "Membangun Full-Stack TypeScript Monorepo Modern dengan AdonisJS v6 dan Next.js",
    slug: "membangun-fullstack-typescript-monorepo-modern",
    excerpt:
      "Analisis mendalam mengenai arsitektur All-in-TypeScript, type safety dari database ORM hingga UI, serta efisiensi monorepo Turborepo.",
    content: `## Pendahuluan: Evolusi Ekosistem TypeScript Modern

Dalam lanskap rekayasa web modern tahun 2026, efisiensi tim engineering sangat ditentukan oleh konsistensi bahasa pemrograman (*language parity*) dan jaminan tipe data end-to-end (*end-to-end type safety*). Kombinasi antara **AdonisJS v6** sebagai backend engine dan **Next.js 16 (App Router)** sebagai frontend presentation layer menghadirkan sinergi yang sangat kuat.

Ketika sebuah tim menggunakan TypeScript murni dari level skema database hingga komponen interaktif di sisi klien, hambatan kognitif berkurang drastis. Tidak ada lagi proses konversi model antar bahasa yang rentan menghasilkan bug runtime.

\`\`\`typescript
// shared/types/src/index.ts
export interface ProjectPayload {
  title: string;
  slug: string;
  clientName?: string;
  projectYear: number;
  isFeatured: boolean;
}
\`\`\`

## 1. Type Safety End-to-End Tanpa Overhead

Salah satu keunggulan terbesar dari arsitektur monorepo berbasis pnpm workspace dan Turborepo adalah kemampuan untuk berbagi package \`@growthcoder/types\` secara langsung. 

Lucid ORM pada AdonisJS v6 memanfaatkan TypeScript decorator modern dan inference yang akurat:

\`\`\`typescript
// apps/api/app/models/post.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Category from '#models/category'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare content: string

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>
}
\`\`\`

Dengan pendekatan ini, controller di AdonisJS secara otomatis mewarisi tipe data model, dan response API dapat dikonsumsi oleh Next.js Server Components tanpa resiko *type mismatch*.

## 2. Server Components dan ISR untuk Performa Maksimal

Dengan Next.js 16, kita dapat memanfaatkan kombinasi Server Components (RSC) dan Incremental Static Regeneration (ISR). Halaman portofolio dan artikel blog dirender secara statis saat build time, lalu di-*revalidate* di latar belakang:

- **Waktu Muat Instan (TTFB < 50ms)**: Pengunjung menerima HTML statis berkecepatan CDN.
- **Dynamic SEO Metadata**: Mesin pencari seperti Google dan bot media sosial menerima open graph tags yang selalu akurat tanpa eksekusi JavaScript berat di client.
- **Zero Hydration Overhead**: Hanya komponen interaktif seperti filter bar dan modal pencarian yang mengonsumsi bundle JavaScript di browser.

## 3. Keunggulan Arsitektur Monorepo Turborepo

Berikut adalah beberapa manfaat nyata yang dirasakan saat mengadopsi Turborepo untuk proyek enterprise:

- Pipeline kompilasi paralel (*Parallel task execution*) yang memangkas waktu build hingga 60%.
- Caching pintar di tingkat modul (*Smart remote and local caching*).
- Shared Tailwind CSS v4 design tokens sehingga seluruh UI dashboard CMS dan Web Publik memiliki harmoni visual yang identik.

## Kesimpulan

Duet AdonisJS v6 dan Next.js 16 bukan sekadar pilihan tren, melainkan keputusan arsitektural yang matang untuk proyek yang membutuhkan skalabilitas tinggi, kemudahan pemeliharaan jangka panjang, dan pengalaman developer (DX) yang luar biasa.`,
    coverImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    publishedAt: "2026-08-20T10:00:00Z",
    viewCount: 1420,
    readingTimeMinutes: 6,
    categoryId: "cat-1",
    category: {
      id: "cat-1",
      name: "Software Architecture",
      slug: "software-architecture",
      createdAt: "",
      updatedAt: "",
    },
    tags: [
      {
        id: "tag-1",
        name: "Next.js 16",
        slug: "nextjs-16",
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "tag-2",
        name: "AdonisJS v6",
        slug: "adonisjs-v6",
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "tag-3",
        name: "TypeScript",
        slug: "typescript",
        createdAt: "",
        updatedAt: "",
      },
    ],
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "art-2",
    title:
      "Panduan Implementasi WebAuthn Passkeys Tanpa Kata Sandi pada Aplikasi Web Modern",
    slug: "panduan-implementasi-passkeys-webauthn",
    excerpt:
      "Meningkatkan keamanan akun pengguna dengan standar FIDO2 / WebAuthn Passkeys menggunakan fingerprint dan Windows Hello.",
    content: `## Mengapa Kata Sandi Tradisional Mulai Ditinggalkan?

Kata sandi berbasis teks memiliki berbagai kerentanan fundamental: mudah ditebak, rentan terhadap serangan phishing, *credential stuffing*, dan kebocoran basis data. Standar **FIDO2 / WebAuthn** hadir untuk mengatasi masalah ini secara permanen melalui kriptografi kunci publik asimetris.

Dengan Passkeys, autentikasi dilakukan langsung menggunakan biometrik perangkat pengguna (Touch ID, Face ID, Windows Hello, atau hardware security key seperti YubiKey) tanpa pernah mengirimkan rahasia privat ke server.

## 1. Alur Registrasi Passkey (Registration Flow)

Proses pendaftaran Passkey terdiri dari dua langkah utama:

1. **Server Challenge Generation**: Server backend membuat payload *creation options* yang berisi tantangan kriptografis acak (*challenge*), relying party ID, dan profil pengguna.
2. **Client Attestation Verification**: Browser memanggil API \`navigator.credentials.create()\` untuk meminta verifikasi biometrik pengguna, lalu mengirimkan *public key credential* ke backend untuk disimpan.

\`\`\`typescript
// Menginisialisasi pembuatan credential di browser
const credential = await navigator.credentials.create({
  publicKey: {
    challenge: Buffer.from(challengeString, 'base64'),
    rp: { name: 'GrowthCoder Secure', id: window.location.hostname },
    user: {
      id: Buffer.from(userId),
      name: userEmail,
      displayName: userName,
    },
    pubKeyCredParams: [{ alg: -7, type: 'public-key' }], // ES256
    authenticatorSelection: {
      userVerification: 'preferred',
      residentKey: 'required',
    },
    timeout: 60000,
  },
});
\`\`\`

## 2. Alur Autentikasi Passkey (Authentication Flow)

Saat login, pengguna tidak perlu lagi mengingat atau mengetikkan password:

- Server menyediakan opsi autentikasi (*assertion options*) beserta *challenge*.
- Browser memanggil \`navigator.credentials.get()\` yang memicu prompt biometrik instan.
- Backend memverifikasi tanda tangan digital (*signature*) menggunakan public key yang telah terdaftar di database PostgreSQL.

## 3. Keamanan Tambahan & Best Practices

- **Resisten Phishing**: Kredensial WebAuthn terikat langsung ke domain (Relying Party ID), sehingga serangan phishing domain palsu otomatis gagal.
- **Counter Replay Attack**: Setiap verifikasi memeriksa *sign counter* untuk mendeteksi kloning kredensial.
- **Fallback Multi-Factor**: Tetap sediakan alternatif autentikasi cadangan bagi pengguna yang berganti perangkat.

## Kesimpulan

Mengintegrasikan WebAuthn Passkeys memberikan lompatan besar dalam aspek keamanan dan kenyamanan pengguna. Pengguna dapat masuk ke sistem dalam waktu kurang dari 2 detik tanpa risiko pencurian kredensial.`,
    coverImage:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    publishedAt: "2026-08-15T08:30:00Z",
    viewCount: 980,
    readingTimeMinutes: 8,
    categoryId: "cat-2",
    category: {
      id: "cat-2",
      name: "Security & Auth",
      slug: "security-auth",
      createdAt: "",
      updatedAt: "",
    },
    tags: [
      {
        id: "tag-5",
        name: "WebAuthn",
        slug: "webauthn",
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "tag-3",
        name: "TypeScript",
        slug: "typescript",
        createdAt: "",
        updatedAt: "",
      },
    ],
    createdAt: "2026-08-15T08:30:00Z",
    updatedAt: "2026-08-15T08:30:00Z",
  },
  {
    id: "art-3",
    title:
      "Teknik Optimasi Database PostgreSQL & JSONB Indexing untuk Skalabilitas Tinggi",
    slug: "teknik-optimasi-database-postgresql-jsonb-indexing",
    excerpt:
      "Strategi indexing GIN pada kolom JSONB, partitioning tabel activity logs, dan tuning connection pool Lucid ORM.",
    content: `## Tantangan Skalabilitas Data Dinamis

Dalam aplikasi web berskala enterprise, kebutuhan untuk menyimpan data dinamis—seperti metadata payload audit log, konfigurasi sistem, atau dynamic schema—sering kali berbenturan dengan performa query relational. PostgreSQL menyediakan tipe data **JSONB** (Binary JSON) yang memungkinkan fleksibilitas NoSQL dengan integritas ACID penuh.

Namun, tanpa strategi indexing yang tepat, query pencarian di dalam payload JSONB dapat memicu *Sequential Scan* yang membebani CPU server.

## 1. Memanfaatkan Generalized Inverted Index (GIN)

Indeks GIN dirancang khusus untuk mempercepat operasi pencarian operator JSONB seperti \`@>\` (containment) dan \`?\` (key existence):

\`\`\`sql
-- Membuat indeks GIN pada kolom payload tabel activity_logs
CREATE INDEX idx_activity_logs_payload_gin 
ON activity_logs USING GIN (payload jsonb_path_ops);

-- Query pencarian yang memanfaatkan GIN index secara instan:
EXPLAIN ANALYZE
SELECT * FROM activity_logs 
WHERE payload @> '{"action": "update_project", "status": "success"}';
\`\`\`

Dengan \`jsonb_path_ops\`, ukuran indeks jauh lebih hemat dan kecepatan eksekusi query meningkat hingga 40x dibandingkan indeks standar.

## 2. Strategi Partitioning Tabel Berdasarkan Rentang Waktu

Untuk tabel yang tumbuh pesat seperti riwayat aktivitas (*audit trail*), kita dapat menerapkan *Declarative Table Partitioning* PostgreSQL:

- Partisi bulanan (\`activity_logs_2026_08\`, \`activity_logs_2026_09\`).
- Pembersihan data usang (*data retention policy*) cukup dengan \`DROP TABLE\` partisi lama tanpa perlu mengeksekusi \`DELETE\` massal yang memicu bloat.

## 3. Tuning Connection Pooling Lucid ORM

Di sisi AdonisJS backend, konfigurasi pool koneksi database harus dioptimalkan sesuai dengan kapasitas vCPU server:

\`\`\`typescript
// config/database.ts
export const dbConfig = {
  connection: 'pg',
  connections: {
    pg: {
      client: 'pg',
      connection: process.env.DATABASE_URL,
      pool: {
        min: 2,
        max: 20,
        idleTimeoutMillis: 30000,
        acquireTimeoutMillis: 60000,
      },
    },
  },
}
\`\`\`

## Kesimpulan

Kombinasi indeks GIN pada kolom JSONB, partisi tabel cerdas, dan tuning pool koneksi memastikan PostgreSQL mampu melayani jutaan transaksi dengan latensi sub-milidetik.`,
    coverImage:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    publishedAt: "2026-08-10T14:15:00Z",
    viewCount: 1850,
    readingTimeMinutes: 10,
    categoryId: "cat-3",
    category: {
      id: "cat-3",
      name: "Database & Backend",
      slug: "database-backend",
      createdAt: "",
      updatedAt: "",
    },
    tags: [
      {
        id: "tag-4",
        name: "PostgreSQL",
        slug: "postgresql",
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "tag-7",
        name: "Performance",
        slug: "performance",
        createdAt: "",
        updatedAt: "",
      },
    ],
    createdAt: "2026-08-10T14:15:00Z",
    updatedAt: "2026-08-10T14:15:00Z",
  },
  {
    id: "art-4",
    title:
      "Membangun Pipeline CI/CD Otomatis dengan Docker Multi-Stage Build dan GitHub Actions",
    slug: "membangun-pipeline-cicd-docker-github-actions",
    excerpt:
      "Panduan praktis merancang pipeline integrasi berkelanjutan yang hemat resource, zero-downtime deployment, dan image Docker ramping.",
    content: `## Mengapa Multi-Stage Build Sangat Krusial?

Ketika membangun image Docker untuk aplikasi Node.js atau TypeScript monorepo, menyertakan seluruh \`devDependencies\` dan build tools ke dalam image produksi akan menghasilkan ukuran image yang membengkak (bisa mencapai 1.5GB+). Hal ini memperlambat proses deployment dan memperbesar celah keamanan (*attack surface*).

Melalui teknik **Docker Multi-Stage Build**, kita dapat memisahkan tahap kompilasi dari tahap runtime produksi sehingga ukuran image akhir dapat dipangkas menjadi di bawah 150MB.

## 1. Struktur Dockerfile Multi-Stage Teroptimasi

\`\`\`dockerfile
# Stage 1: Base & Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter @growthcoder/api build

# Stage 3: Production Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/build ./build
COPY --from=builder /app/apps/api/node_modules ./node_modules

EXPOSE 3333
CMD ["node", "build/bin/server.js"]
\`\`\`

## 2. Otomasi Pengujian & Deployment via GitHub Actions

Dengan GitHub Actions workflow, setiap push ke branch \`main\` secara otomatis melalui tahapan:

1. **Lint & Type Check**: Memastikan tidak ada error TypeScript.
2. **Automated Unit Testing**: Menjalankan test suite dengan Japa / Vitest.
3. **Build & Push Image**: Mendorong image ke container registry privat dengan tag semantic versioning.
4. **Deploy Webhook**: Memicu zero-downtime rolling restart pada server staging/produksi.

## Kesimpulan

Pipeline CI/CD yang terstruktur rapi memberikan rasa percaya diri tinggi bagi tim engineering untuk merilis fitur baru secara aman, cepat, dan terukur.`,
    coverImage:
      "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    publishedAt: "2026-08-05T09:00:00Z",
    viewCount: 1120,
    readingTimeMinutes: 7,
    categoryId: "cat-4",
    category: {
      id: "cat-4",
      name: "DevOps & Infrastructure",
      slug: "devops-infra",
      createdAt: "",
      updatedAt: "",
    },
    tags: [
      {
        id: "tag-6",
        name: "Docker",
        slug: "docker",
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "tag-7",
        name: "Performance",
        slug: "performance",
        createdAt: "",
        updatedAt: "",
      },
    ],
    createdAt: "2026-08-05T09:00:00Z",
    updatedAt: "2026-08-05T09:00:00Z",
  },
  {
    id: "art-5",
    title:
      "Menguasai React 19 Server Actions dan Form Transitions untuk UX Super Cepat",
    slug: "menguasai-react-19-server-actions-form-transitions",
    excerpt:
      "Eksplorasi mendalam useActionState, useOptimistic, dan form handling tanpa boilerplate reducer di Next.js 16.",
    content: `## Paradigma Baru Form Handling di React 19

Sebelum kehadiran Server Actions, penanganan form di React membutuhkan banyak boilerplate: state management lokal (\`useState\`), callback submission manual (\`onSubmit\`), penanganan error status, dan loading spinner state terpisah.

React 19 bersama Next.js 16 merombak alur ini melalui konsep **Server Actions** dan hook bawaan seperti \`useActionState\` dan \`useOptimistic\`.

## 1. Implementasi useActionState untuk Form Asinkron

Hook \`useActionState\` memungkinkan kita menghubungkan form langsung ke fungsi backend dengan status loading terkelola otomatis:

\`\`\`tsx
'use client'

import { useActionState } from 'react'
import { submitContactLead } from '@/actions/contact'

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactLead, null)

  return (
    <form action={formAction} className="space-y-4">
      <input name="email" type="email" placeholder="Email Anda" required />
      <textarea name="message" placeholder="Pesan..." required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Mengirim...' : 'Kirim Pesan'}
      </button>
      {state?.error && <p className="text-red-500">{state.error}</p>}
      {state?.success && <p className="text-green-500">Pesan berhasil dikirim!</p>}
    </form>
  )
}
\`\`\`

## 2. Optimistic UI Updates dengan useOptimistic

Untuk interaksi seperti tombol suka (*like*), bookmark, atau status switch, \`useOptimistic\` memberikan feedback instan kepada pengguna tanpa menunggu respons round-trip server:

- Tampilan UI diperbarui seketika (0 milidetik).
- Jika request server gagal, state otomatis di-*rollback* ke nilai semula secara mulus.

## Kesimpulan

Kombinasi Server Actions dan React 19 Form Hooks secara signifikan memangkas ukuran bundle JavaScript klien dan menghadirkan pengalaman pengguna yang terasa instan dan responsif.`,
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    publishedAt: "2026-07-28T11:20:00Z",
    viewCount: 1650,
    readingTimeMinutes: 5,
    categoryId: "cat-5",
    category: {
      id: "cat-5",
      name: "Frontend Engineering",
      slug: "frontend-engineering",
      createdAt: "",
      updatedAt: "",
    },
    tags: [
      {
        id: "tag-1",
        name: "Next.js 16",
        slug: "nextjs-16",
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "tag-3",
        name: "TypeScript",
        slug: "typescript",
        createdAt: "",
        updatedAt: "",
      },
    ],
    createdAt: "2026-07-28T11:20:00Z",
    updatedAt: "2026-07-28T11:20:00Z",
  },
];

export const FALLBACK_LATEST_ARTICLES: Article[] = FALLBACK_ALL_ARTICLES.slice(
  0,
  3,
);

/**
 * Generic API Fetcher for Public Web Endpoints
 */
export async function fetchApi<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  try {
    const res = await safeFetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...init?.headers,
      },
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const json = (await res.json()) as ApiResponse<T>;
    return json;
  } catch (error) {
    console.error(`[API Fetch Error: ${endpoint}]:`, error);
    throw error;
  }
}

/**
 * Fetch Public Site Settings with fallback
 */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const res = await safeFetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/v1/settings`,
      {
        next: { revalidate: 3600, tags: ["settings", "site"] },
      },
    );

    if (!res.ok) {
      return DEFAULT_SITE_SETTINGS;
    }

    const json = await res.json();
    const data = json.data || {};

    return {
      profile: {
        ...DEFAULT_SITE_PROFILE,
        ...(data.profile || {}),
        roles:
          Array.isArray(data.profile?.roles) && data.profile.roles.length > 0
            ? data.profile.roles
            : typeof data.profile?.roles === "string" &&
                data.profile.roles.trim().length > 0
              ? data.profile.roles
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter(Boolean)
              : [
                  data.profile?.tagline ||
                    DEFAULT_SITE_PROFILE.tagline ||
                    "Full-Stack Web Developer",
                ],
        socials: {
          ...DEFAULT_SITE_PROFILE.socials,
          ...(data.profile?.socials || {}),
        },
      },
      about: {
        ...DEFAULT_ABOUT_CONFIG,
        ...(data.about || {}),
      },
      appearance: {
        ...DEFAULT_APPEARANCE_CONFIG,
        ...(data.appearance || {}),
        navbarStyle: data.appearance?.navbarStyle || "floating",
      },
      maintenance: {
        ...DEFAULT_MAINTENANCE_CONFIG,
        ...(data.maintenance || {}),
        isActive:
          data.maintenance?.isActive ?? data.maintenance?.enabled ?? false,
      },
      seo: {
        ...DEFAULT_SEO_CONFIG,
        ...(data.seo || {}),
      },
      stats:
        Array.isArray(data.stats) && data.stats.length > 0
          ? data.stats
          : DEFAULT_STATS,
    };
  } catch (_error) {
    console.warn(
      "[SiteSettings] Using default fallback settings due to fetch failure.",
    );
    return DEFAULT_SITE_SETTINGS;
  }
}

/**
 * Fetch Public Areas of Expertise for Homepage Summary Section
 */
export async function getExpertises(): Promise<Expertise[]> {
  try {
    const res = await safeFetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/v1/expertises`,
      {
        next: { revalidate: 3600, tags: ["expertises", "site"] },
      },
    );

    if (!res.ok) {
      return FALLBACK_EXPERTISES;
    }

    const json = await res.json();
    const data = json.data;

    if (Array.isArray(data) && data.length > 0) {
      return data;
    }

    return FALLBACK_EXPERTISES;
  } catch (_error) {
    console.warn("[Expertises] Using default fallback expertises list.");
    return FALLBACK_EXPERTISES;
  }
}

/**
 * Fetch Featured Projects for Homepage
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const res = await safeFetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/v1/projects?featured=true`,
      {
        next: { revalidate: 3600, tags: ["projects", "site"] },
      },
    );

    if (!res.ok) {
      return FALLBACK_FEATURED_PROJECTS;
    }

    const json = await res.json();
    const data = json.data;

    if (Array.isArray(data) && data.length > 0) {
      return data;
    }

    return FALLBACK_FEATURED_PROJECTS;
  } catch (_error) {
    console.warn("[Projects] Using default fallback projects.");
    return FALLBACK_FEATURED_PROJECTS;
  }
}

/**
 * Fetch Tech Stacks for Homepage Filterable Grid
 */
export async function getTechStacks(): Promise<TechStack[]> {
  try {
    const res = await safeFetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/v1/tech-stacks`,
      {
        next: { revalidate: 3600, tags: ["tech-stacks", "site"] },
      },
    );

    if (!res.ok) {
      return FALLBACK_TECH_STACKS;
    }

    const json = await res.json();
    const data = json.data;

    if (Array.isArray(data) && data.length > 0) {
      return data;
    }

    return FALLBACK_TECH_STACKS;
  } catch (_error) {
    console.warn("[TechStacks] Using default fallback tech stacks.");
    return FALLBACK_TECH_STACKS;
  }
}

/**
 * Fetch Career Timeline Experiences
 */
export async function getCareerTimeline(): Promise<Experience[]> {
  try {
    const res = await safeFetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/v1/experiences`,
      {
        next: { revalidate: 3600, tags: ["career", "site"] },
      },
    );

    if (!res.ok) {
      return FALLBACK_CAREER_EXPERIENCES;
    }

    const json = await res.json();
    const data = json.data;

    if (data && typeof data === "object" && !Array.isArray(data)) {
      if (Array.isArray(data.experiences) && data.experiences.length > 0) {
        return data.experiences;
      }
    }

    if (Array.isArray(data) && data.length > 0) {
      return data;
    }

    return FALLBACK_CAREER_EXPERIENCES;
  } catch (_error) {
    console.warn("[CareerTimeline] Using default fallback career experiences.");
    return FALLBACK_CAREER_EXPERIENCES;
  }
}

/**
 * Fetch Career, Education, and Certifications for About / Career Page
 */
export async function getCareerAndEducation(): Promise<{
  experiences: Experience[];
  educations: Education[];
  certifications: Certification[];
}> {
  try {
    const res = await safeFetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/v1/experiences`,
      {
        next: { revalidate: 3600, tags: ["career", "site"] },
      },
    );

    if (!res.ok) {
      return {
        experiences: FALLBACK_CAREER_EXPERIENCES,
        educations: FALLBACK_EDUCATIONS,
        certifications: [],
      };
    }

    const json = await res.json();
    const data = json.data;

    if (data && typeof data === "object" && !Array.isArray(data)) {
      return {
        experiences:
          Array.isArray(data.experiences) && data.experiences.length > 0
            ? data.experiences
            : Array.isArray(data.experiences)
              ? []
              : FALLBACK_CAREER_EXPERIENCES,
        educations:
          Array.isArray(data.educations) && data.educations.length > 0
            ? data.educations
            : Array.isArray(data.educations)
              ? []
              : FALLBACK_EDUCATIONS,
        certifications: Array.isArray(data.certifications)
          ? data.certifications
          : [],
      };
    }

    if (Array.isArray(data) && data.length > 0) {
      return {
        experiences: data,
        educations: FALLBACK_EDUCATIONS,
        certifications: [],
      };
    }

    return {
      experiences: FALLBACK_CAREER_EXPERIENCES,
      educations: FALLBACK_EDUCATIONS,
      certifications: [],
    };
  } catch (_error) {
    console.warn(
      "[CareerAndEducation] Using default fallback experiences and educations.",
    );
    return {
      experiences: FALLBACK_CAREER_EXPERIENCES,
      educations: FALLBACK_EDUCATIONS,
      certifications: [],
    };
  }
}

/**
 * Fetch Development Philosophies
 */
export async function getPhilosophies(): Promise<DevelopmentPhilosophy[]> {
  try {
    const res = await safeFetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/v1/philosophies`,
      {
        next: { revalidate: 3600, tags: ["career", "site"] },
      },
    );

    if (!res.ok) {
      return FALLBACK_PHILOSOPHIES;
    }

    const json = await res.json();
    const data = json.data;

    if (Array.isArray(data) && data.length > 0) {
      return data;
    }

    return FALLBACK_PHILOSOPHIES;
  } catch (_error) {
    console.warn("[Philosophies] Using default fallback philosophies.");
    return FALLBACK_PHILOSOPHIES;
  }
}

/**
 * Fetch Latest Published Articles
 */
export async function getLatestArticles(limit: number = 3): Promise<Article[]> {
  try {
    const res = await safeFetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/v1/articles?limit=${limit}`,
      {
        next: { revalidate: 3600, tags: ["articles", "site"] },
      },
    );

    if (!res.ok) {
      return FALLBACK_LATEST_ARTICLES;
    }

    const json = await res.json();
    const data = json.data;

    if (Array.isArray(data) && data.length > 0) {
      return data.slice(0, limit);
    }

    return FALLBACK_LATEST_ARTICLES;
  } catch (_error) {
    console.warn("[Articles] Using default fallback articles.");
    return FALLBACK_LATEST_ARTICLES;
  }
}

/**
 * Fetch All Projects with optional filters (for /projects catalog)
 */
export async function getAllProjects(
  params?: ProjectFilterParams,
): Promise<{ data: Project[]; meta: PaginationMeta }> {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.perPage) query.set("perPage", String(params.perPage));
    if (params?.category) query.set("category", params.category);
    if (params?.techStack) query.set("techStack", params.techStack);
    if (params?.isFeatured !== undefined)
      query.set("isFeatured", String(params.isFeatured));
    if (params?.search) query.set("search", params.search);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const res = await safeFetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/v1/projects${queryString}`,
      {
        next: { revalidate: 3600, tags: ["projects", "site"] },
      },
    );

    if (!res.ok) {
      return getFallbackProjectsWithFilter(params);
    }

    const json = await res.json();
    if (json.data && Array.isArray(json.data)) {
      return {
        data: json.data,
        meta: json.meta || {
          total: json.data.length,
          page: params?.page || 1,
          perPage: params?.perPage || 12,
          lastPage: 1,
        },
      };
    }

    return getFallbackProjectsWithFilter(params);
  } catch (_error) {
    console.warn("[Projects] Using default fallback projects list.");
    return getFallbackProjectsWithFilter(params);
  }
}

function getFallbackProjectsWithFilter(params?: ProjectFilterParams): {
  data: Project[];
  meta: PaginationMeta;
} {
  let filtered = [...FALLBACK_ALL_PROJECTS];

  if (params?.isFeatured !== undefined) {
    filtered = filtered.filter((p) => p.isFeatured === params.isFeatured);
  }

  if (params?.category && params.category !== "all") {
    filtered = filtered.filter(
      (p) =>
        p.category?.slug === params.category ||
        p.categoryId === params.category ||
        p.category?.name.toLowerCase() === params.category?.toLowerCase(),
    );
  }

  if (params?.techStack && params.techStack !== "all") {
    filtered = filtered.filter((p) =>
      p.techStacks?.some(
        (t) =>
          t.slug === params.techStack ||
          t.id === params.techStack ||
          t.name.toLowerCase() === params.techStack?.toLowerCase(),
      ),
    );
  }

  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.excerpt.toLowerCase().includes(s) ||
        (p.clientName && p.clientName.toLowerCase().includes(s)),
    );
  }

  const page = params?.page || 1;
  const perPage = params?.perPage || 12;
  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return {
    data: paginated,
    meta: {
      total,
      page,
      perPage,
      lastPage,
    },
  };
}

/**
 * Fetch Single Project by Slug for Case Study Detail
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await safeFetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/v1/projects/${encodeURIComponent(slug)}`,
      {
        next: { revalidate: 3600, tags: ["projects", `project-${slug}`, "site"] },
      },
    );

    if (!res.ok) {
      const match = FALLBACK_ALL_PROJECTS.find(
        (p) => p.slug === slug || p.id === slug,
      );
      return match || null;
    }

    const json = await res.json();
    return json.data || null;
  } catch (_error) {
    console.warn(`[ProjectDetail] Using fallback for slug: ${slug}`);
    return (
      FALLBACK_ALL_PROJECTS.find((p) => p.slug === slug || p.id === slug) ||
      null
    );
  }
}

/**
 * Fetch Project Categories
 */
export async function getProjectCategories(): Promise<ProjectCategory[]> {
  try {
    const res = await safeFetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/v1/project-categories`,
      {
        next: { revalidate: 3600, tags: ["projects", "site"] },
      },
    );

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
    return FALLBACK_PROJECT_CATEGORIES;
  } catch {
    return FALLBACK_PROJECT_CATEGORIES;
  }
}

/**
 * Fetch Adjacent Projects (Previous & Next) for Detail Navigation
 */
export async function getAdjacentProjects(
  currentSlug: string,
): Promise<{ prev: Project | null; next: Project | null }> {
  try {
    const { data: all } = await getAllProjects({ perPage: 50 });
    const list = all.length > 0 ? all : FALLBACK_ALL_PROJECTS;
    const currentIndex = list.findIndex(
      (p) => p.slug === currentSlug || p.id === currentSlug,
    );

    if (currentIndex === -1) {
      return { prev: null, next: null };
    }

    const prev = currentIndex > 0 ? list[currentIndex - 1] : null;
    const next = currentIndex < list.length - 1 ? list[currentIndex + 1] : null;

    return { prev, next };
  } catch {
    return { prev: null, next: null };
  }
}

/**
 * Track Project Clicks (Demo & Repo) Optimistically
 */
export async function trackProjectClick(
  slug: string,
  eventType: "demo_click" | "repo_click",
): Promise<void> {
  try {
    const url = `${API_BASE_URL.replace(/\/$/, "")}/api/v1/projects/${encodeURIComponent(slug)}/track`;
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function"
    ) {
      const blob = new Blob([JSON.stringify({ eventType })], {
        type: "application/json",
      });
      navigator.sendBeacon(url, blob);
    } else {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType }),
        keepalive: true,
      });
    }
  } catch (error) {
    console.debug("[Telemetry] Failed to track project event:", error);
  }
}

/**
 * Fetch All Published Articles with optional filters & pagination (for /blog catalog)
 */
export async function getAllArticles(
  params?: ArticleFilterParams,
): Promise<{ data: Article[]; meta: PaginationMeta }> {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.perPage) query.set("perPage", String(params.perPage));
    if (params?.category) query.set("category", params.category);
    if (params?.tag) query.set("tag", params.tag);
    if (params?.search) query.set("search", params.search);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const res = await safeFetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/v1/articles${queryString}`,
      {
        next: { revalidate: 3600, tags: ["articles", "site"] },
      },
    );

    if (!res.ok) {
      return getFallbackArticlesWithFilter(params);
    }

    const json = await res.json();
    if (json.data && Array.isArray(json.data)) {
      return {
        data: json.data,
        meta: json.meta || {
          total: json.data.length,
          page: params?.page || 1,
          perPage: params?.perPage || 9,
          lastPage: Math.ceil(json.data.length / (params?.perPage || 9)),
        },
      };
    }

    return getFallbackArticlesWithFilter(params);
  } catch (_error) {
    console.warn("[Articles] Using default fallback articles list.");
    return getFallbackArticlesWithFilter(params);
  }
}

function getFallbackArticlesWithFilter(params?: ArticleFilterParams): {
  data: Article[];
  meta: PaginationMeta;
} {
  let filtered = [...FALLBACK_ALL_ARTICLES];

  if (params?.category && params.category !== "all") {
    filtered = filtered.filter(
      (a) =>
        a.category?.slug === params.category ||
        a.categoryId === params.category ||
        a.category?.name.toLowerCase() === params.category?.toLowerCase(),
    );
  }

  if (params?.tag && params.tag !== "all") {
    filtered = filtered.filter((a) =>
      a.tags?.some(
        (t) =>
          t.slug === params.tag ||
          t.id === params.tag ||
          t.name.toLowerCase() === params.tag?.toLowerCase(),
      ),
    );
  }

  if (params?.search && params.search.trim() !== "") {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q),
    );
  }

  const page = Number(params?.page) || 1;
  const perPage = Number(params?.perPage) || 9;
  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const offset = (page - 1) * perPage;
  const paginated = filtered.slice(offset, offset + perPage);

  return {
    data: paginated,
    meta: {
      total,
      page,
      perPage,
      lastPage,
    },
  };
}

/**
 * Fetch Single Article Detail by Slug or ID (Supports Preview Mode)
 */
export async function getArticleBySlug(
  slug: string,
  previewOptions?: { preview?: boolean; token?: string },
): Promise<Article | null> {
  const normalizedSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
  const isPreview = Boolean(previewOptions?.preview);

  try {
    const queryParams = new URLSearchParams();
    if (isPreview) {
      queryParams.set("preview", "true");
      if (previewOptions?.token) {
        queryParams.set("token", previewOptions.token);
      }
    }

    const queryString = queryParams.toString();
    const endpoint = `${API_BASE_URL.replace(/\/$/, "")}/api/v1/articles/${encodeURIComponent(slug)}${queryString ? `?${queryString}` : ""}`;

    const res = await safeFetch(endpoint, {
      ...(isPreview
        ? { cache: "no-store" }
        : { next: { revalidate: 3600, tags: ["articles", `article-${slug}`, "site"] } }),
    });

    if (!res.ok) {
      const match = FALLBACK_ALL_ARTICLES.find(
        (a) =>
          a.slug === slug ||
          a.id === slug ||
          a.slug.toLowerCase().replace(/[^a-z0-9]/g, "") === normalizedSlug ||
          normalizedSlug.includes(
            a.slug.toLowerCase().replace(/[^a-z0-9]/g, ""),
          ) ||
          a.slug
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .includes(normalizedSlug),
      );
      return match || null;
    }

    const json = await res.json();
    return json.data || null;
  } catch (_error) {
    console.warn(`[ArticleDetail] Using fallback for slug: ${slug}`);
    return (
      FALLBACK_ALL_ARTICLES.find(
        (a) =>
          a.slug === slug ||
          a.id === slug ||
          a.slug.toLowerCase().replace(/[^a-z0-9]/g, "") === normalizedSlug ||
          normalizedSlug.includes(
            a.slug.toLowerCase().replace(/[^a-z0-9]/g, ""),
          ) ||
          a.slug
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .includes(normalizedSlug),
      ) || null
    );
  }
}

/**
 * Fetch Article Categories
 */
export async function getArticleCategories(): Promise<Category[]> {
  try {
    const res = await safeFetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/v1/categories?status=published`,
      {
        next: { revalidate: 3600, tags: ["articles", "site"] },
      },
    );

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
    return FALLBACK_ARTICLE_CATEGORIES;
  } catch {
    return FALLBACK_ARTICLE_CATEGORIES;
  }
}

/**
 * Fetch Article Tags
 */
export async function getArticleTags(): Promise<Tag[]> {
  try {
    const res = await safeFetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/v1/tags?status=published`,
      {
        next: { revalidate: 3600, tags: ["articles", "site"] },
      },
    );

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
    return FALLBACK_ARTICLE_TAGS;
  } catch {
    return FALLBACK_ARTICLE_TAGS;
  }
}

/**
 * Fetch Adjacent Articles (Previous & Next) for Detail Navigation
 */
export async function getAdjacentArticles(
  currentSlug: string,
): Promise<{ prev: Article | null; next: Article | null }> {
  try {
    const { data: all } = await getAllArticles({ perPage: 50 });
    const list = all.length > 0 ? all : FALLBACK_ALL_ARTICLES;
    const currentIndex = list.findIndex(
      (a) => a.slug === currentSlug || a.id === currentSlug,
    );

    if (currentIndex === -1) {
      return { prev: null, next: null };
    }

    const prev = currentIndex > 0 ? list[currentIndex - 1] : null;
    const next = currentIndex < list.length - 1 ? list[currentIndex + 1] : null;

    return { prev, next };
  } catch {
    return { prev: null, next: null };
  }
}

/**
 * Fetch Related Articles based on Category and Tags
 */
export async function getRelatedArticles(
  currentSlug: string,
  categoryId?: string,
  tagSlugs?: string[],
  limit: number = 3,
): Promise<Article[]> {
  try {
    const list = FALLBACK_ALL_ARTICLES.filter(
      (a) => a.slug !== currentSlug && a.id !== currentSlug,
    );

    // Prioritize same category or matching tags
    const scored = list.map((art) => {
      let score = 0;
      if (
        categoryId &&
        (art.categoryId === categoryId ||
          art.category?.id === categoryId ||
          art.category?.slug === categoryId)
      ) {
        score += 3;
      }
      if (tagSlugs && tagSlugs.length > 0) {
        const matches = art.tags?.filter(
          (t) => tagSlugs.includes(t.slug) || tagSlugs.includes(t.id),
        );
        score += (matches?.length || 0) * 2;
      }
      return { article: art, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.article);
  } catch {
    return FALLBACK_ALL_ARTICLES.filter((a) => a.slug !== currentSlug).slice(
      0,
      limit,
    );
  }
}

// =========================================================================
// SERVICES & CONTACT API
// =========================================================================

export const FALLBACK_SERVICES: Service[] = [
  {
    id: "srv-01",
    title: "Full-Stack Web Application Development",
    slug: "full-stack-web-development",
    shortDescription:
      "Pembangunan aplikasi web end-to-end dengan antarmuka responsif, interaksi halus, dan arsitektur type-safe berbasis Next.js & AdonisJS.",
    valueProposition: "Modern, Type-Safe, dan Terstruktur",
    iconSvg: "Layers",
    deliverables: [
      "Arsitektur Next.js App Router (SSR, SSG, Server Actions)",
      "RESTful API / Backend tangguh dengan AdonisJS & PostgreSQL",
      "Antarmuka Modern Glassmorphism & Dark Mode Responsif",
      "Database Modeling, Caching Redis, dan Index Optimization",
      "Deployment Cloud (Vercel, Docker, VPS Linux) & CI/CD Pipeline",
      "Dokumentasi API & Panduan Pemeliharaan Lengkap",
    ],
    faqs: [
      {
        id: "faq-01",
        serviceId: "srv-01",
        question: "Berapa lama rata-rata durasi pengerjaan aplikasi web?",
        answer:
          "Tergantung pada skala dan kebutuhan fitur, durasi pengerjaan umumnya berkisar antara 2 hingga 6 minggu dengan demo progres berkala.",
        sortOrder: 1,
      },
      {
        id: "faq-02",
        serviceId: "srv-01",
        question:
          "Apakah kode sumber (source code) diserahkan sepenuhnya ke klien?",
        answer:
          "Ya, seluruh kode sumber dan hak akses repositori Git diserahkan sepenuhnya kepada Anda setelah proyek selesai dan serah terima.",
        sortOrder: 2,
      },
      {
        id: "faq-03",
        serviceId: "srv-01",
        question: "Apakah ada garansi dan dukungan pasca-peluncuran?",
        answer:
          "Tentu. Saya menyediakan masa pendampingan teknis dan perbaikan bug setelah peluncuran agar sistem berjalan lancar di lingkungan produksi.",
        sortOrder: 3,
      },
    ],
    order: 1,
    isFeatured: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "srv-02",
    title: "High-Performance Backend & RESTful API Architecture",
    slug: "backend-api-architecture",
    shortDescription:
      "Perancangan backend modular, skalabel, dan aman dengan AdonisJS, PostgreSQL, Redis Caching, dan autentikasi Passkey / JWT.",
    valueProposition: "Skalabel, Terstruktur, & Aman",
    iconSvg: "Server",
    deliverables: [
      "Perancangan arsitektur backend modular berbasis AdonisJS v6 / Node.js",
      "Optimasi skema database PostgreSQL, indexing, dan migrasi terstruktur",
      "Mekanisme caching layer berkecepatan tinggi dengan Redis",
      "Autentikasi aman WebAuthn (Passkeys) & Session/Token Management",
      "Integrasi API pihak ketiga (Payment Gateway, Telegram, Storage S3)",
      "Automated Testing & Unit Test Coverage",
    ],
    faqs: [
      {
        id: "faq-03",
        serviceId: "srv-02",
        question: "Framework dan database apa yang biasa Anda gunakan?",
        answer:
          "Saya utamanya menggunakan AdonisJS v6 (TypeScript) dan PostgreSQL, didukung Redis untuk caching layer.",
        sortOrder: 1,
      },
      {
        id: "faq-04",
        serviceId: "srv-02",
        question: "Apakah sistem backend yang dibangun sudah mendukung Docker?",
        answer:
          "Ya, setiap proyek dilengkapi dengan konfigurasi multi-stage Dockerfile dan Docker Compose untuk kemudahan deployment.",
        sortOrder: 2,
      },
    ],
    order: 2,
    isFeatured: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "srv-03",
    title: "Telegram Bot & Workflow Automation",
    slug: "telegram-bot-automation",
    shortDescription:
      "Otomasi alur kerja dan notifikasi real-time menggunakan Telegram Bot interaktif yang terhubung langsung ke backend atau database Anda.",
    valueProposition: "Otomasi Fleksibel, Notifikasi Cepat, & Terintegrasi",
    iconSvg: "Bot",
    deliverables: [
      "Custom Telegram Bot dengan Telegraf / Grammy / AdonisJS Service",
      "Notifikasi instan leads, order e-commerce, atau alert system crash",
      "Integrasi Webhook multi-platform (Stripe, Midtrans, GitHub, Sheets)",
      "Interactive Inline Keyboards, Menu Dinamis, & Conversational Flow",
      "Cron Job & Monitoring Health Check otomatis berkala",
    ],
    faqs: [
      {
        id: "faq-06",
        serviceId: "srv-03",
        question:
          "Apakah bot dapat terhubung ke database atau CRM yang sudah ada?",
        answer:
          "Ya, bot Telegram dapat dihubungkan langsung ke database internal (PostgreSQL, MySQL) atau API pihak ketiga seperti Notion, Airtable, dan CRM Anda.",
        sortOrder: 1,
      },
      {
        id: "faq-07",
        serviceId: "srv-03",
        question: "Di mana bot Telegram akan di-hosting?",
        answer:
          "Bot dapat di-deploy di VPS (Docker), Cloudflare Workers, atau server private Anda dengan proteksi webhook TLS.",
        sortOrder: 2,
      },
    ],
    order: 3,
    isFeatured: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "srv-04",
    title: "Performance Tuning, Refactoring & Code Audit",
    slug: "performance-tuning-audit",
    shortDescription:
      "Audit mendalam dan optimasi performa aplikasi web, pembersihan technical debt, serta modernisasi struktur kode.",
    valueProposition:
      "Optimasi Kecepatan, Clean Codebase, & Arsitektur Terstruktur",
    iconSvg: "Zap",
    deliverables: [
      "Audit Core Web Vitals & Kecepatan Rendering Web",
      "Bundle Size Analysis & Code Splitting Optimization",
      "Database Index Tuning & Slow Query Optimization",
      "Refactoring ke TypeScript Strict & Modular Pattern",
      "Laporan audit teknis beserta rekomendasi perbaikan",
    ],
    faqs: [
      {
        id: "faq-08",
        serviceId: "srv-04",
        question: "Berapa lama proses audit dan optimasi performa?",
        answer:
          "Audit awal umumnya memakan waktu 2-3 hari kerja, sedangkan implementasi optimasi disesuaikan dengan skala aplikasi dan area perbaikan.",
        sortOrder: 1,
      },
    ],
    order: 4,
    isFeatured: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
];

export const FALLBACK_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "wf-01",
    stepNumber: "01",
    title: "Discovery & Konsultasi Kebutuhan",
    shortTitle: "Analisis Kebutuhan",
    description:
      "Memahami tujuan, alur kebutuhan, dan spesifikasi teknis proyek Anda secara terperinci untuk menentukan arsitektur sistem yang paling tepat.",
    activities: [
      "Wawancara spesifikasi & requirement gathering",
      "Pemetaan fungsionalitas fitur (Product Roadmap)",
      "Estimasi jadwal milestone dan alokasi tahapan",
      "Pemilihan tech stack optimal dan berbiaya efisien",
    ],
    iconSvg: "Search",
    order: 1,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "wf-02",
    stepNumber: "02",
    title: "Desain Arsitektur & Antarmuka UI/UX",
    shortTitle: "Perancangan Solusi",
    description:
      "Merancang wireframe, flow interaksi antarmuka yang intuitif, serta arsitektur database dan schema kontrak API yang solid.",
    activities: [
      "Wireframing & prototipe antarmuka interaktif",
      "Database modeling & ERD schema design",
      "Perancangan OpenAPI contract & types",
      "Penetapan security guidelines & role authorization",
    ],
    iconSvg: "Layout",
    order: 2,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "wf-03",
    stepNumber: "03",
    title: "Implementasi & Integrasi Sistem",
    shortTitle: "Pengembangan Inti",
    description:
      "Pengembangan fitur secara iteratif dengan clean code, type-safe end-to-end, dan integrasi mulus antara Next.js dan backend.",
    activities: [
      "Frontend rendering & interaksi animasi halus",
      "Backend business logic & endpoint creation",
      "Integrasi caching layer Redis & third-party services",
      "Internal testing, QA linting & typechecking berkala",
    ],
    iconSvg: "Code2",
    order: 3,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "wf-04",
    stepNumber: "04",
    title: "Testing, Optimasi & Deployment",
    shortTitle: "Uji Kualitas & Rilis",
    description:
      "Uji coba menyeluruh pada berbagai ukuran layar, optimasi performa Core Web Vitals, dan deployment ke server produksi.",
    activities: [
      "Cross-browser testing & mobile responsiveness",
      "Audit Lighthouse & PageSpeed optimization",
      "Docker containerization & CI/CD deployment",
      "Serah terima source code, kredensial & dokumentasi",
    ],
    iconSvg: "Rocket",
    order: 4,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
];

/**
 * Fetch all public workflow steps
 */
export async function getWorkflowSteps(): Promise<WorkflowStep[]> {
  try {
    const res = await safeFetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/v1/workflows`,
      {
        next: { revalidate: 3600, tags: ["services", "site"] },
      },
    );

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
    return FALLBACK_WORKFLOW_STEPS;
  } catch {
    return FALLBACK_WORKFLOW_STEPS;
  }
}

/**
 * Fetch all public services
 */
export async function getServices(): Promise<Service[]> {
  try {
    const res = await safeFetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/v1/services`,
      {
        next: { revalidate: 3600, tags: ["services", "site"] },
      },
    );

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
    return FALLBACK_SERVICES;
  } catch {
    return FALLBACK_SERVICES;
  }
}

/**
 * Fetch single service by slug
 */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const res = await safeFetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/v1/services/${slug}`,
      {
        next: { revalidate: 3600, tags: ["services", `service-${slug}`, "site"] },
      },
    );

    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        return json.data;
      }
    }
    const found = FALLBACK_SERVICES.find(
      (s) => s.slug === slug || s.id === slug,
    );
    return found || null;
  } catch {
    const found = FALLBACK_SERVICES.find(
      (s) => s.slug === slug || s.id === slug,
    );
    return found || null;
  }
}

/**
 * Submit Contact Inbox Lead Form
 */
export async function submitContactInbox(
  payload: CreateInboxRequest,
): Promise<ApiResponse<{ id: string; createdAt: string }>> {
  const url = `${API_BASE_URL.replace(/\/$/, "")}/api/v1/inbox`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({
    success: false,
    message: "Gagal memproses pengiriman pesan.",
  }));

  if (!res.ok) {
    throw new Error(data.message || `Pengiriman gagal (${res.status})`);
  }

  return data;
}
