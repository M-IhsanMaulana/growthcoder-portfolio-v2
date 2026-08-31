import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ProjectCategory from '#models/project_category'
import Category from '#models/category'
import Tag from '#models/tag'
import Project from '#models/project'
import Post from '#models/post'
import TechStack from '#models/tech_stack'
import { DateTime } from 'luxon'

export default class TaxonomySeeder extends BaseSeeder {
  async run() {
    // Project Categories
    const projectCats = [
      {
        name: 'Web Applications',
        slug: 'web-applications',
        description: 'Modern full-stack web applications and SaaS platforms',
        order: 1,
      },
      {
        name: 'API & Microservices',
        slug: 'api-microservices',
        description: 'Scalable REST and GraphQL backend services',
        order: 2,
      },
      {
        name: 'Automation & Bots',
        slug: 'automation-bots',
        description: 'Telegram bots, cron jobs, and automated workflows',
        order: 3,
      },
      {
        name: 'System Architecture',
        slug: 'system-architecture',
        description: 'Database optimization and enterprise monorepo structures',
        order: 4,
      },
    ]

    const createdProjectCats: Record<string, ProjectCategory> = {}
    for (const cat of projectCats) {
      const pc = await ProjectCategory.firstOrCreate({ slug: cat.slug }, cat)
      createdProjectCats[cat.slug] = pc
    }

    // Blog Categories
    const blogCats = [
      {
        name: 'Architecture & Design',
        slug: 'architecture-design',
        description: 'Software design patterns, DDD, and monorepo architectures',
      },
      {
        name: 'Backend Engineering',
        slug: 'backend-engineering',
        description: 'Node.js, AdonisJS, PostgreSQL, and scalable API guides',
      },
      {
        name: 'Frontend & UI',
        slug: 'frontend-ui',
        description: 'Next.js App Router, Tailwind CSS, and UX micro-interactions',
      },
      {
        name: 'DevOps & Tooling',
        slug: 'devops-tooling',
        description: 'Docker, CI/CD pipelines, and Linux server management',
      },
    ]

    const createdBlogCats: Record<string, Category> = {}
    for (const cat of blogCats) {
      const bc = await Category.firstOrCreate({ slug: cat.slug }, cat)
      createdBlogCats[cat.slug] = bc
    }

    // Tags
    const tags = [
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'Next.js', slug: 'nextjs' },
      { name: 'AdonisJS', slug: 'adonisjs' },
      { name: 'PostgreSQL', slug: 'postgresql' },
      { name: 'Tailwind CSS', slug: 'tailwind-css' },
      { name: 'Docker', slug: 'docker' },
      { name: 'System Design', slug: 'system-design' },
    ]

    const createdTags: Record<string, Tag> = {}
    for (const tag of tags) {
      const t = await Tag.firstOrCreate({ slug: tag.slug }, tag)
      createdTags[tag.slug] = t
    }

    // Seed Sample Featured Project
    const nextjsStack = await TechStack.findBy('slug', 'nextjs')
    const adonisStack = await TechStack.findBy('slug', 'adonisjs')
    const pgStack = await TechStack.findBy('slug', 'postgresql')
    const tsStack = await TechStack.findBy('slug', 'typescript')

    const sampleProject = await Project.firstOrCreate(
      { slug: 'growthcoder-portfolio-v2' },
      {
        title: 'GrowthCoder Modern Monorepo Ecosystem',
        slug: 'growthcoder-portfolio-v2',
        excerpt:
          'High-performance portfolio & technical journal powered by AdonisJS v6, Next.js App Router, PostgreSQL, and PNPM Workspaces.',
        content: `## Ringkasan Proyek
Proyek ini memigrasikan sistem arsitektur lawas menjadi Full-Stack TypeScript Monorepo yang modern, menyatukan CMS Admin, Web Publik, dan REST API terpusat.

### Tantangan & Masalah
- Kompleksitas pengelolaan multi-repository dengan stack yang terfragmentasi.
- Kebutuhan performa I/O tinggi, type safety end-to-end, dan SEO kelas atas.

### Solusi Teknis
- Membangun REST API Headless dengan AdonisJS v6 dan PostgreSQL.
- Mengadopsi Turborepo & PNPM Workspaces untuk kode bersama (shared packages).
- Memanfaatkan Next.js ISR (Incremental Static Regeneration) untuk artikel dan showcase portofolio.`,
        clientName: 'Personal Brand & Client Showcase',
        projectYear: 2026,
        coverImage:
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        demoUrl: 'https://growthcoder.id',
        repositoryUrl: 'https://github.com/growthcoder/growthcoder-portfolio-v2',
        isFeatured: true,
        order: 1,
        categoryId: createdProjectCats['web-applications']?.id || null,
      }
    )

    const attachStackIds = [nextjsStack?.id, adonisStack?.id, pgStack?.id, tsStack?.id].filter(
      Boolean
    ) as string[]
    if (attachStackIds.length > 0) {
      await sampleProject.related('techStacks').sync(attachStackIds)
    }

    // Seed Sample Blog Post
    const samplePost = await Post.firstOrCreate(
      { slug: 'membangun-fullstack-typescript-monorepo-modern' },
      {
        title: 'Membangun Full-Stack TypeScript Monorepo Modern dengan AdonisJS v6 dan Next.js',
        slug: 'membangun-fullstack-typescript-monorepo-modern',
        excerpt:
          'Panduan komprehensif mengintegrasikan AdonisJS v6 sebagai headless backend dan Next.js App Router dalam arsitektur PNPM Workspaces.',
        content: `<p>Membangun aplikasi web skala modern membutuhkan arsitektur yang tidak hanya cepat dalam performa eksekusi, tetapi juga memberikan <em>developer experience</em> yang superior. Dalam artikel ini, kita akan membahas transisi menuju 100% ekosistem TypeScript monorepo.</p><h3>Mengapa AdonisJS v6?</h3><p>AdonisJS v6 menghadirkan pondasi backend Node.js yang sangat matang dengan struktur MVC yang kokoh, Lucid ORM, dan sistem validasi VineJS yang luar biasa cepat.</p>`,
        coverImage:
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        status: 'published',
        publishedAt: DateTime.now(),
        readingTimeMinutes: 5,
        metaTitle: 'Membangun Full-Stack TypeScript Monorepo Modern',
        metaDescription:
          'Panduan lengkap arsitektur monorepo dengan AdonisJS v6 dan Next.js App Router.',
        categoryId: createdBlogCats['architecture-design']?.id || null,
        viewCount: 142,
      }
    )

    const attachTagIds = [
      createdTags['typescript']?.id,
      createdTags['nextjs']?.id,
      createdTags['adonisjs']?.id,
    ].filter(Boolean) as string[]
    if (attachTagIds.length > 0) {
      await samplePost.related('tags').sync(attachTagIds)
    }
  }
}
