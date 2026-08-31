import { BaseSeeder } from '@adonisjs/lucid/seeders'
import TechStack from '#models/tech_stack'
import type { TechCategory } from '@growthcoder/types'

export default class TechStackSeeder extends BaseSeeder {
  async run() {
    const stacks: Array<{
      name: string
      slug: string
      category: TechCategory
      isFeatured: boolean
      level: number
      order: number
      iconSvg?: string
    }> = [
      // Frontend
      {
        name: 'TypeScript',
        slug: 'typescript',
        category: 'frontend',
        isFeatured: true,
        level: 90,
        order: 1,
      },
      {
        name: 'Next.js',
        slug: 'nextjs',
        category: 'frontend',
        isFeatured: true,
        level: 92,
        order: 2,
      },
      { name: 'React', slug: 'react', category: 'frontend', isFeatured: true, level: 90, order: 3 },
      {
        name: 'Tailwind CSS',
        slug: 'tailwind-css',
        category: 'frontend',
        isFeatured: true,
        level: 95,
        order: 4,
      },
      {
        name: 'Vue.js',
        slug: 'vuejs',
        category: 'frontend',
        isFeatured: false,
        level: 80,
        order: 5,
      },

      // Backend
      {
        name: 'Node.js',
        slug: 'nodejs',
        category: 'backend',
        isFeatured: true,
        level: 88,
        order: 1,
      },
      {
        name: 'AdonisJS',
        slug: 'adonisjs',
        category: 'backend',
        isFeatured: true,
        level: 90,
        order: 2,
      },
      {
        name: 'Laravel',
        slug: 'laravel',
        category: 'backend',
        isFeatured: true,
        level: 92,
        order: 3,
      },
      {
        name: 'NestJS',
        slug: 'nestjs',
        category: 'backend',
        isFeatured: false,
        level: 82,
        order: 4,
      },
      { name: 'Go', slug: 'go', category: 'backend', isFeatured: false, level: 75, order: 5 },

      // Database
      {
        name: 'PostgreSQL',
        slug: 'postgresql',
        category: 'database',
        isFeatured: true,
        level: 90,
        order: 1,
      },
      { name: 'Redis', slug: 'redis', category: 'database', isFeatured: true, level: 85, order: 2 },
      {
        name: 'MySQL',
        slug: 'mysql',
        category: 'database',
        isFeatured: false,
        level: 88,
        order: 3,
      },
      {
        name: 'SQLite',
        slug: 'sqlite',
        category: 'database',
        isFeatured: false,
        level: 85,
        order: 4,
      },

      // DevOps
      { name: 'Docker', slug: 'docker', category: 'devops', isFeatured: true, level: 85, order: 1 },
      { name: 'Linux', slug: 'linux', category: 'devops', isFeatured: true, level: 88, order: 2 },
      { name: 'Nginx', slug: 'nginx', category: 'devops', isFeatured: false, level: 82, order: 3 },
      {
        name: 'CI/CD Pipelines',
        slug: 'ci-cd',
        category: 'devops',
        isFeatured: false,
        level: 80,
        order: 4,
      },

      // Tools
      {
        name: 'Git & GitHub',
        slug: 'git',
        category: 'tools',
        isFeatured: true,
        level: 95,
        order: 1,
      },
      {
        name: 'Postman',
        slug: 'postman',
        category: 'tools',
        isFeatured: false,
        level: 90,
        order: 2,
      },
      { name: 'Figma', slug: 'figma', category: 'tools', isFeatured: false, level: 78, order: 3 },
    ]

    for (const stack of stacks) {
      await TechStack.firstOrCreate({ slug: stack.slug }, stack)
    }
  }
}
