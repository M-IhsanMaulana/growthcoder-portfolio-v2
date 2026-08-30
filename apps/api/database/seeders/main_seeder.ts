import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class MainSeeder extends BaseSeeder {
  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run()
  }

  async run() {
    await this.runSeeder(await import('#database/seeders/01_user_seeder'))
    await this.runSeeder(await import('#database/seeders/02_tech_stack_seeder'))
    await this.runSeeder(await import('#database/seeders/03_taxonomy_seeder'))
    await this.runSeeder(await import('#database/seeders/04_setting_seeder'))
    await this.runSeeder(await import('#database/seeders/05_career_and_philosophy_seeder'))
  }
}
