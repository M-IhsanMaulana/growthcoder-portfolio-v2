import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

export default class UserSeeder extends BaseSeeder {
  async run() {
    const existing = await User.findBy('email', 'admin@growthcoder.id')
    const hashedPassword = await hash.make('password123')

    if (!existing) {
      await User.create({
        name: 'Muhammad Ihsan Maulana',
        email: 'admin@growthcoder.id',
        password: hashedPassword,
        role: 'superadmin',
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      })
    } else {
      await db.rawQuery('UPDATE users SET password = ? WHERE email = ?', [
        hashedPassword,
        'admin@growthcoder.id',
      ])
    }
  }
}
