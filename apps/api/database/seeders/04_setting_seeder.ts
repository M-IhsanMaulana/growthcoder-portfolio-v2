import { BaseSeeder } from '@adonisjs/lucid/seeders'
import SiteSetting from '#models/site_setting'

export default class SettingSeeder extends BaseSeeder {
  async run() {
    const defaultSettings: Array<{ key: string; value: unknown }> = [
      {
        key: 'profile',
        value: {
          siteName: 'GrowthCoder',
          ownerName: 'Muhammad Ihsan Maulana',
          tagline: 'Full-Stack Web Developer',
          bio: 'Passionate fullstack web developer building high-performance web applications and modern digital products.',
          avatarUrl:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          cvFileUrl: '/uploads/cv-muhammad-ihsan-maulana.pdf',
          email: 'admin@growthcoder.id',
          phone: '+628123456789',
          location: 'Indonesia',
          roles: ['Full-Stack Web Developer'],
          socials: {
            github: 'https://github.com/growthcoder',
            linkedin: 'https://linkedin.com/in/growthcoder',
            twitter: 'https://twitter.com/growthcoder',
            telegram: 'https://t.me/growthcoder',
          },
        },
      },
      {
        key: 'maintenance',
        value: {
          isActive: false,
          headline: 'Sistem Sedang Dalam Pemeliharaan Terjadwal',
          message:
            'Kami sedang melakukan peningkatan performa infrastruktur dan database. Kami akan segera kembali.',
          estimatedEndTime: null,
        },
      },
      {
        key: 'telegram',
        value: {
          botToken: '',
          adminChatId: '',
          notifyOnInbox: true,
          notifyOnPostPublish: true,
        },
      },
      {
        key: 'appearance',
        value: {
          navbarStyle: 'floating',
        },
      },
      {
        key: 'seo',
        value: {
          metaTitle: 'GrowthCoder — Full-Stack Engineer & System Architect',
          metaDescription:
            'Personal portfolio, technical case studies, and engineering journal by Muhammad Ihsan Maulana.',
          metaKeywords: [
            'Full-Stack Developer',
            'Next.js',
            'AdonisJS',
            'PostgreSQL',
            'TypeScript',
            'Software Engineer Indonesia',
          ],
          ogImageUrl: 'https://growthcoder.id/og-image.png',
        },
      },
      {
        key: 'stats',
        value: [
          { id: 'stat-1', label: 'Tahun Pengalaman', value: 5, suffix: '+', prefix: '', order: 1 },
          {
            id: 'stat-2',
            label: 'Proyek & Sistem Produksi',
            value: 25,
            suffix: '+',
            prefix: '',
            order: 2,
          },
          {
            id: 'stat-3',
            label: 'Target PageSpeed & Core Web Vitals',
            value: 98,
            suffix: '+',
            prefix: '',
            order: 3,
          },
          {
            id: 'stat-4',
            label: 'Type Safety Contract',
            value: 100,
            suffix: '%',
            prefix: '',
            order: 4,
          },
        ],
      },
    ]

    for (const setting of defaultSettings) {
      await SiteSetting.firstOrCreate({ key: setting.key }, setting)
    }
  }
}
