import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Experience from '#models/experience'
import Education from '#models/education'
import Certification from '#models/certification'
import Service from '#models/service'
import ServiceFaq from '#models/service_faq'
import Philosophy from '#models/philosophy'
import WorkflowStep from '#models/workflow_step'
import Expertise from '#models/expertise'
import TechStack from '#models/tech_stack'
import { DateTime } from 'luxon'

export default class CareerAndPhilosophySeeder extends BaseSeeder {
  async run() {
    // 1. Experiences (Hanya seed jika kosong)
    const expCount = await Experience.query().count('* as total')
    if (Number(expCount[0]?.$extras?.total || 0) === 0) {
      const experiences = [
        {
          company: 'GrowthCoder Tech',
          position: 'Lead Full-Stack Software Engineer',
          location: 'Remote, Indonesia',
          employmentType: 'full-time' as const,
          startDate: DateTime.fromISO('2023-01-01'),
          isCurrent: true,
          description:
            'Architecting scalable web applications, REST APIs, and microservices using TypeScript, AdonisJS, Next.js, and PostgreSQL.',
          order: 1,
        },
        {
          company: 'Software Enterprise Solutions',
          position: 'Backend Software Engineer',
          location: 'Jakarta, Indonesia',
          employmentType: 'full-time' as const,
          startDate: DateTime.fromISO('2021-06-01'),
          endDate: DateTime.fromISO('2022-12-31'),
          isCurrent: false,
          description:
            'Developed high-throughput API endpoints, database optimizations, and automated ETL pipelines with Node.js and PostgreSQL.',
          order: 2,
        },
      ]

      for (const exp of experiences) {
        await Experience.create(exp)
      }
    }

    // 2. Educations (Hanya seed jika kosong)
    const eduCount = await Education.query().count('* as total')
    if (Number(eduCount[0]?.$extras?.total || 0) === 0) {
      const educations = [
        {
          institution: 'Universitas Terkemuka Indonesia',
          degree: 'Bachelor of Computer Science (S.Kom)',
          fieldOfStudy: 'Informatics & Software Engineering',
          startDate: DateTime.fromISO('2018-08-01'),
          endDate: DateTime.fromISO('2022-07-31'),
          isCurrent: false,
          grade: '3.85 / 4.00 (Cum Laude)',
          description:
            'Focused on distributed systems, algorithm design, software architecture, and relational database modeling.',
          order: 1,
        },
      ]

      for (const edu of educations) {
        await Education.create(edu)
      }
    }

    // 3. Certifications (Hanya seed jika kosong)
    const certCount = await Certification.query().count('* as total')
    if (Number(certCount[0]?.$extras?.total || 0) === 0) {
      const certifications = [
        {
          name: 'AWS Certified Solutions Architect – Associate',
          issuer: 'Amazon Web Services',
          issueDate: DateTime.fromISO('2023-05-15'),
          credentialId: 'AWS-SAA-2023',
          credentialUrl: 'https://aws.amazon.com/verification',
          order: 1,
        },
      ]

      for (const cert of certifications) {
        await Certification.create(cert)
      }
    }

    // 4. Services (Hanya seed jika kosong)
    const srvCount = await Service.query().count('* as total')
    if (Number(srvCount[0]?.$extras?.total || 0) === 0) {
      const services = [
        {
          title: 'Full-Stack Web Application Development',
          slug: 'fullstack-web-development',
          iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/><path d="m7 8 2 2-2 2"/><path d="M13 12h4"/></svg>`,
          shortDescription:
            'Modern, high-performance web applications built with Next.js, TypeScript, and AdonisJS.',
          valueProposition:
            'Delivering end-to-end type safety, ultra-fast rendering with SSR/ISR, and responsive modern UI.',
          deliverables: [
            'Custom Next.js App Router Frontend',
            'AdonisJS / Node.js Scalable REST API',
            'PostgreSQL Database Architecture',
            'Dockerized Deployment Config',
            'SEO & OpenGraph Optimizations',
          ],
          order: 1,
          isFeatured: true,
          faqs: [
            {
              question: 'Berapa lama rata-rata estimasi pengerjaan aplikasi web full-stack?',
              answer:
                'Tergantung kompleksitas fitur, MVP biasanya memakan waktu 2–4 minggu, sedangkan sistem enterprise skala besar memerlukan 6–12 minggu.',
              sortOrder: 1,
            },
            {
              question: 'Apakah source code dan repository Git diserahkan secara penuh?',
              answer:
                'Ya, 100% intellectual property, repositori Git, dan akses environment didelegasikan kepada klien.',
              sortOrder: 2,
            },
          ],
        },
        {
          title: 'Scalable REST API & Microservices Engineering',
          slug: 'scalable-rest-api-microservices',
          iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`,
          shortDescription:
            'High-throughput backend architecture with AdonisJS v6, Lucid ORM, and PostgreSQL.',
          valueProposition:
            'Engineered for low latency, bulletproof input validation with VineJS, and modular service patterns.',
          deliverables: [
            'REST API Architecture & OpenAPI / Swagger Specs',
            'BullMQ Background Job Queues & Redis Caching',
            'FIDO2 / WebAuthn Passkeys & JWT Authentication',
            'Automated Unit & Functional Tests',
          ],
          order: 2,
          isFeatured: true,
          faqs: [
            {
              question: 'Apakah backend dapat menangani ribuan request concurrent per detik?',
              answer:
                'Tentu, dengan PostgreSQL connection pooling, Redis caching, dan BullMQ asynchronous worker, sistem dirancang untuk performa optimal.',
              sortOrder: 1,
            },
          ],
        },
        {
          title: 'Telegram Bots & Workflow Automation',
          slug: 'telegram-bots-workflow-automation',
          iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-sky-500"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
          shortDescription:
            'Automated business notifications, alert monitors, and conversational Telegram bots.',
          valueProposition:
            'Connect your web applications with instant real-time Telegram alerts and admin control.',
          deliverables: [
            'Interactive Custom Telegram Bot',
            'Instant Lead Notification Dispatcher',
            'Scheduled Reporting Cron Jobs',
            'Webhook Gateway with HMAC Signature Verification',
          ],
          order: 3,
          isFeatured: false,
          faqs: [
            {
              question: 'Apakah bot dapat diintegrasikan dengan sistem internal perusahaan?',
              answer:
                'Sangat bisa, bot dapat berkomunikasi via REST API, Webhook, atau membaca database internal secara aman.',
              sortOrder: 1,
            },
          ],
        },
        {
          title: 'Database Architecture & Performance Tuning',
          slug: 'database-tuning-optimization',
          iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>`,
          shortDescription:
            'Relational database schema modeling, slow query optimization, and connection management.',
          valueProposition:
            'Eliminate N+1 queries, tune indexes, and design resilient schemas for million-row scale.',
          deliverables: [
            'Query Execution Plan (EXPLAIN ANALYZE) Audit',
            'Composite & Partial Index Tuning',
            'Database Normalization & Sharding Strategy',
            'Automated Migration & Backup Pipeline',
          ],
          order: 4,
          isFeatured: true,
          faqs: [
            {
              question: 'Database apa saja yang didukung?',
              answer:
                'Spesialisasi utama kami adalah PostgreSQL dan MySQL/MariaDB, serta Redis untuk distributed caching & message broker.',
              sortOrder: 1,
            },
          ],
        },
      ]

      for (const srvData of services) {
        const { faqs, ...serviceFields } = srvData
        const srv = await Service.firstOrCreate({ slug: serviceFields.slug }, serviceFields)

        if (faqs && faqs.length > 0) {
          await ServiceFaq.query().where('service_id', srv.id).delete()
          await ServiceFaq.createMany(
            faqs.map((f) => ({
              serviceId: srv.id,
              question: f.question,
              answer: f.answer,
              sortOrder: f.sortOrder,
            }))
          )
        }
      }
    }

    // 5. Development Philosophies (Hanya seed jika kosong)
    const philCount = await Philosophy.query().count('* as total')
    if (Number(philCount[0]?.$extras?.total || 0) === 0) {
      const philosophies = [
        {
          title: 'Clean Architecture & Maintainable Code',
          tagline: 'Code is read much more often than it is written.',
          iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" x2="10" y1="4" y2="20"/></svg>`,
          description:
            'Structuring software with high cohesion, clear domain boundaries, and simple abstractions that remain adaptable and maintainable years down the line.',
          order: 1,
        },
        {
          title: 'Pragmatic & Solution-Oriented',
          tagline: 'Balance technical elegance with real-world business value.',
          iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-500"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
          description:
            'Choosing boring, proven technologies when appropriate and innovative stacks when they provide a genuine competitive edge, avoiding premature over-engineering.',
          order: 2,
        },
        {
          title: 'End-to-End Type Safety',
          tagline: 'Catch errors at compile-time, not at 3 AM in production.',
          iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/></svg>`,
          description:
            'Enforcing strict TypeScript contracts across database ORM migrations, validation schemas, REST API responses, and frontend React UI states.',
          order: 3,
        },
        {
          title: 'Performance & Fast Latency by Design',
          tagline: 'Speed is not an afterthought; it is a core feature.',
          iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
          description:
            'Obsessing over sub-second latency, optimal SQL indexing, server-side caching, efficient bundle sizes, and fluid 60fps micro-interactions.',
          order: 4,
        },
        {
          title: 'Automation & CI/CD First',
          tagline: 'If you have to do it twice, automate it.',
          iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
          description:
            'Automating linting, unit testing, Docker builds, and deployment pipelines so development cycles remain rapid, consistent, and stress-free.',
          order: 5,
        },
      ]

      for (const phil of philosophies) {
        await Philosophy.create(phil)
      }
    }

    // 6. Areas of Expertise (Hanya seed jika kosong)
    const expExpertiseCount = await Expertise.query().count('* as total')
    if (Number(expExpertiseCount[0]?.$extras?.total || 0) === 0) {
      const expertises = [
        {
          title: 'Backend Architecture & Distributed Systems',
          slug: 'backend-architecture-distributed-systems',
          subtitle: 'Spesialisasi Backend & Data',
          description:
            'Perancangan RESTful API modular, optimasi skema PostgreSQL terindeks, Redis caching layer, serta background worker (BullMQ/Redis) untuk sistem berkapasitas tinggi.',
          iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/><path d="M18 10v4"/><path d="m15 12 3 2 3-2"/></svg>`,
          order: 1,
          isFeatured: true,
          techSlugs: ['adonisjs', 'postgresql', 'redis', 'typescript'],
        },
        {
          title: 'Modern Frontend Engineering & UI/UX Craft',
          slug: 'frontend-engineering-ui-ux-craft',
          subtitle: 'Spesialisasi Frontend & Interaksi',
          description:
            'Membangun antarmuka modern yang cepat (Next.js App Router, SSR/ISR), interaktif dengan micro-animations, aksesibel, dan terhubung mulus dengan kontrak API yang type-safe.',
          iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/><path d="m7 8 2 2-2 2"/><path d="M13 12h4"/></svg>`,
          order: 2,
          isFeatured: true,
          techSlugs: ['nextjs', 'typescript', 'tailwindcss'],
        },
        {
          title: 'Monorepo, Security & Engineering Best Practices',
          slug: 'monorepo-security-engineering-best-practices',
          subtitle: 'Fondasi Arsitektur & Kualitas Kode',
          description:
            'Penerapan struktur PNPM Turborepo monorepo, autentikasi mutakhir FIDO2 WebAuthn Passkeys, pengujian otomatis, containerization Docker, dan pipeline deployment andal.',
          iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
          order: 3,
          isFeatured: true,
          techSlugs: ['docker', 'typescript', 'adonisjs', 'nextjs'],
        },
      ]

      for (const expData of expertises) {
        const { techSlugs, ...fields } = expData
        const item = await Expertise.create(fields)

        if (techSlugs && techSlugs.length > 0) {
          const stacks = await TechStack.query().whereIn('slug', techSlugs)
          if (stacks.length > 0) {
            await item.related('techStacks').attach(stacks.map((s) => s.id))
          }
        }
      }
    }

    // 7. Workflow Steps (Hanya seed jika kosong)
    const wfCount = await WorkflowStep.query().count('* as total')
    if (Number(wfCount[0]?.$extras?.total || 0) === 0) {
      const workflowSteps = [
        {
          stepNumber: '01',
          title: 'Discovery & Konsultasi Kebutuhan',
          shortTitle: 'Analisis Kebutuhan',
          description:
            'Memahami tujuan, alur kebutuhan, dan spesifikasi teknis proyek Anda secara terperinci untuk menentukan arsitektur sistem yang paling tepat.',
          activities: [
            'Wawancara spesifikasi & requirement gathering',
            'Pemetaan fungsionalitas fitur (Product Roadmap)',
            'Estimasi jadwal milestone dan alokasi tahapan',
            'Pemilihan tech stack optimal dan berbiaya efisien',
          ],
          iconSvg: 'Search',
          order: 1,
          isActive: true,
        },
        {
          stepNumber: '02',
          title: 'Desain Arsitektur & Antarmuka UI/UX',
          shortTitle: 'Perancangan Solusi',
          description:
            'Menyusun blueprint arsitektur backend, skema database relasional (ERD), kontrak API (OpenAPI), dan desain antarmuka modern yang ramah pengguna.',
          activities: [
            'Perancangan ERD database & skema relasi ACID',
            'Spesifikasi API endpoints & data transformers',
            'Wireframe & komponen UI/UX responsif (Figma/Tailwind)',
            'Penetapan standar keamanan data & otentikasi',
          ],
          iconSvg: 'PenTool',
          order: 2,
          isActive: true,
        },
        {
          stepNumber: '03',
          title: 'Agile Development & QA Testing',
          shortTitle: 'Pengembangan Kode',
          description:
            'Penulisan kode yang rapi dengan prinsip Clean Code, type safety, pengujian berkala, dan demo progres bertahap di setiap milestone.',
          activities: [
            'Iterasi teratur dengan live demo progress staging',
            'Implementasi Next.js SSR + AdonisJS v6 REST API',
            'Penulisan Unit & Functional Testing',
            'Code review mandiri & standar kualitas ketat',
          ],
          iconSvg: 'Code2',
          order: 3,
          isActive: true,
        },
        {
          stepNumber: '04',
          title: 'CI/CD Deployment & Serah Terima',
          shortTitle: 'Rilis & Pendampingan',
          description:
            'Peluncuran sistem ke server produksi (VPS / Cloud), konfigurasi deployment otomatis, serah terima repositori Git 100%, serta pendampingan pasca-rilis.',
          activities: [
            'Setup automated CI/CD pipeline via GitHub Actions',
            'Konfigurasi domain, SSL, dan proteksi Cloudflare',
            'Penyerahan 100% hak akses Git repository & dokumentasi',
            'Pendampingan teknis dan perbaikan bug pasca-rilis',
          ],
          iconSvg: 'Rocket',
          order: 4,
          isActive: true,
        },
      ]

      for (const step of workflowSteps) {
        await WorkflowStep.create(step)
      }
    }
  }
}
