/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'
import { middleware } from '#start/kernel'

// Register Real-time Server-Sent Events (SSE) Transmit Routes
transmit.registerRoutes()

const AuthController = () => import('#controllers/auth/auth_controller')
const PasskeyController = () => import('#controllers/auth/passkey_controller')

const AdminDashboardController = () => import('#controllers/admin/dashboard_controller')
const AdminProjectsController = () => import('#controllers/admin/projects_controller')
const AdminProjectCategoriesController = () =>
  import('#controllers/admin/project_categories_controller')
const AdminArticlesController = () => import('#controllers/admin/articles_controller')
const AdminCategoriesController = () => import('#controllers/admin/categories_controller')
const AdminTagsController = () => import('#controllers/admin/tags_controller')
const AdminTechStacksController = () => import('#controllers/admin/tech_stacks_controller')
const AdminExperiencesController = () => import('#controllers/admin/experiences_controller')
const AdminEducationsController = () => import('#controllers/admin/educations_controller')
const AdminCertificationsController = () => import('#controllers/admin/certifications_controller')
const AdminServicesController = () => import('#controllers/admin/services_controller')
const AdminPhilosophiesController = () => import('#controllers/admin/philosophies_controller')
const AdminWorkflowsController = () => import('#controllers/admin/workflows_controller')
const AdminExpertisesController = () => import('#controllers/admin/expertises_controller')
const AdminInboxesController = () => import('#controllers/admin/inboxes_controller')
const AdminMediaController = () => import('#controllers/admin/media_controller')
const AdminSettingsController = () => import('#controllers/admin/settings_controller')
const AdminActivityLogsController = () => import('#controllers/admin/activity_logs_controller')
const AdminSecurityController = () => import('#controllers/admin/security_controller')

const PublicProjectsController = () => import('#controllers/public/projects_controller')
const PublicArticlesController = () => import('#controllers/public/articles_controller')
const PublicTechStacksController = () => import('#controllers/public/tech_stacks_controller')
const PublicExperiencesController = () => import('#controllers/public/experiences_controller')
const PublicServicesController = () => import('#controllers/public/services_controller')
const PublicPhilosophiesController = () => import('#controllers/public/philosophies_controller')
const PublicWorkflowsController = () => import('#controllers/public/workflows_controller')
const PublicExpertisesController = () => import('#controllers/public/expertises_controller')
const PublicSettingsController = () => import('#controllers/public/settings_controller')
const PublicInboxesController = () => import('#controllers/public/inboxes_controller')

// Health Check Endpoints
router.get('/', () => {
  return {
    name: 'growthcoder-api',
    status: 'online',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  }
})

router.get('/health', () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  }
})

// ==========================================
// 1. AUTH & SECURITY ROUTES (/api/auth)
// ==========================================
router
  .group(() => {
    router.post('login', [AuthController, 'login']).use(middleware.throttle('login'))
    router
      .post('passkey/generate-authentication-options', [
        PasskeyController,
        'generateAuthenticationOptions',
      ])
      .use(middleware.throttle('passkey'))
    router
      .post('passkey/verify-authentication', [PasskeyController, 'verifyAuthentication'])
      .use(middleware.throttle('passkey'))

    // Protected Auth Endpoints
    router
      .group(() => {
        router.get('me', [AuthController, 'me'])
        router.post('logout', [AuthController, 'logout'])
        router.post('passkey/generate-registration-options', [
          PasskeyController,
          'generateRegistrationOptions',
        ])
        router.post('passkey/verify-registration', [PasskeyController, 'verifyRegistration'])
      })
      .use(middleware.auth({ guards: ['api'] }))
  })
  .prefix('/api/auth')

// ==========================================
// 2. ADMIN REST API ROUTES (/api/admin)
// ==========================================
router
  .group(() => {
    // 01. Dashboard & Stats
    router.get('dashboard', [AdminDashboardController, 'index'])

    // 02. Projects & Portfolio
    router.get('projects', [AdminProjectsController, 'index'])
    router.post('projects', [AdminProjectsController, 'store'])
    router.post('projects/reorder', [AdminProjectsController, 'reorder'])
    router.get('projects/:id', [AdminProjectsController, 'show'])
    router.get('projects/:id/analytics', [AdminProjectsController, 'analytics'])
    router.put('projects/:id', [AdminProjectsController, 'update'])
    router.delete('projects/:id', [AdminProjectsController, 'destroy'])

    // Project Categories
    router.get('project-categories', [AdminProjectCategoriesController, 'index'])
    router.post('project-categories', [AdminProjectCategoriesController, 'store'])
    router.get('project-categories/:id', [AdminProjectCategoriesController, 'show'])
    router.put('project-categories/:id', [AdminProjectCategoriesController, 'update'])
    router.delete('project-categories/:id', [AdminProjectCategoriesController, 'destroy'])

    // 03. Articles & Blog
    router.get('articles', [AdminArticlesController, 'index'])
    router.post('articles', [AdminArticlesController, 'store'])
    router.post('articles/publish-scheduled', [AdminArticlesController, 'publishScheduled'])
    router.get('articles/:id', [AdminArticlesController, 'show'])
    router.get('articles/:id/preview-url', [AdminArticlesController, 'previewUrl'])
    router.get('articles/:id/analytics', [AdminArticlesController, 'analytics'])
    router.put('articles/:id', [AdminArticlesController, 'update'])
    router.delete('articles/:id', [AdminArticlesController, 'destroy'])
    router.patch('articles/:id/status', [AdminArticlesController, 'toggleStatus'])

    // Taxonomies (Categories & Tags)
    router.get('categories', [AdminCategoriesController, 'index'])
    router.post('categories', [AdminCategoriesController, 'store'])
    router.get('categories/:id', [AdminCategoriesController, 'show'])
    router.put('categories/:id', [AdminCategoriesController, 'update'])
    router.delete('categories/:id', [AdminCategoriesController, 'destroy'])

    router.get('tags', [AdminTagsController, 'index'])
    router.post('tags', [AdminTagsController, 'store'])
    router.get('tags/:id', [AdminTagsController, 'show'])
    router.put('tags/:id', [AdminTagsController, 'update'])
    router.delete('tags/:id', [AdminTagsController, 'destroy'])

    // 04. Tech Stacks & Skills
    router.get('tech-stacks', [AdminTechStacksController, 'index'])
    router.post('tech-stacks', [AdminTechStacksController, 'store'])
    router.get('tech-stacks/:id', [AdminTechStacksController, 'show'])
    router.put('tech-stacks/:id', [AdminTechStacksController, 'update'])
    router.delete('tech-stacks/:id', [AdminTechStacksController, 'destroy'])

    // 05. Experiences, Educations & Certifications
    router.get('experiences', [AdminExperiencesController, 'index'])
    router.post('experiences', [AdminExperiencesController, 'store'])
    router.post('experiences/reorder', [AdminExperiencesController, 'reorder'])
    router.get('experiences/:id', [AdminExperiencesController, 'show'])
    router.put('experiences/:id', [AdminExperiencesController, 'update'])
    router.delete('experiences/:id', [AdminExperiencesController, 'destroy'])

    router.get('educations', [AdminEducationsController, 'index'])
    router.post('educations', [AdminEducationsController, 'store'])
    router.post('educations/reorder', [AdminEducationsController, 'reorder'])
    router.get('educations/:id', [AdminEducationsController, 'show'])
    router.put('educations/:id', [AdminEducationsController, 'update'])
    router.delete('educations/:id', [AdminEducationsController, 'destroy'])

    router.get('certifications', [AdminCertificationsController, 'index'])
    router.post('certifications', [AdminCertificationsController, 'store'])
    router.post('certifications/reorder', [AdminCertificationsController, 'reorder'])
    router.get('certifications/:id', [AdminCertificationsController, 'show'])
    router.put('certifications/:id', [AdminCertificationsController, 'update'])
    router.delete('certifications/:id', [AdminCertificationsController, 'destroy'])

    // 06. Services & Philosophies
    router.get('services', [AdminServicesController, 'index'])
    router.post('services', [AdminServicesController, 'store'])
    router.get('services/:id', [AdminServicesController, 'show'])
    router.put('services/:id', [AdminServicesController, 'update'])
    router.delete('services/:id', [AdminServicesController, 'destroy'])

    router.get('philosophies', [AdminPhilosophiesController, 'index'])
    router.post('philosophies', [AdminPhilosophiesController, 'store'])
    router.get('philosophies/:id', [AdminPhilosophiesController, 'show'])
    router.put('philosophies/:id', [AdminPhilosophiesController, 'update'])
    router.delete('philosophies/:id', [AdminPhilosophiesController, 'destroy'])

    // 06b. Workflow Steps
    router.get('workflows', [AdminWorkflowsController, 'index'])
    router.post('workflows', [AdminWorkflowsController, 'store'])
    router.post('workflows/reorder', [AdminWorkflowsController, 'reorder'])
    router.get('workflows/:id', [AdminWorkflowsController, 'show'])
    router.put('workflows/:id', [AdminWorkflowsController, 'update'])
    router.delete('workflows/:id', [AdminWorkflowsController, 'destroy'])

    // 07. Areas of Expertise
    router.get('expertises', [AdminExpertisesController, 'index'])
    router.post('expertises', [AdminExpertisesController, 'store'])
    router.post('expertises/reorder', [AdminExpertisesController, 'reorder'])
    router.get('expertises/:id', [AdminExpertisesController, 'show'])
    router.put('expertises/:id', [AdminExpertisesController, 'update'])
    router.delete('expertises/:id', [AdminExpertisesController, 'destroy'])

    // 08. Contact Inboxes
    router.get('inboxes', [AdminInboxesController, 'index'])
    router.get('inboxes/:id', [AdminInboxesController, 'show'])
    router.patch('inboxes/:id/status', [AdminInboxesController, 'updateStatus'])
    router.delete('inboxes/:id', [AdminInboxesController, 'destroy'])

    // 08. Media Library
    router.get('media/stats', [AdminMediaController, 'stats'])
    router.post('media/bulk-delete', [AdminMediaController, 'bulkDestroy'])
    router.get('media', [AdminMediaController, 'index'])
    router.post('media/upload', [AdminMediaController, 'upload'])
    router.get('media/:id', [AdminMediaController, 'show'])
    router.patch('media/:id', [AdminMediaController, 'update'])
    router.delete('media/:id', [AdminMediaController, 'destroy'])

    // 09. Site Settings
    router.get('settings', [AdminSettingsController, 'index'])
    router.put('settings/single', [AdminSettingsController, 'updateSingle'])
    router.put('settings/bulk', [AdminSettingsController, 'updateBulk'])
    router.post('settings/telegram/test', [AdminSettingsController, 'testTelegram'])

    // 10. Activity Logs
    router.get('activity-logs/stats', [AdminActivityLogsController, 'stats'])
    router.get('activity-logs/export', [AdminActivityLogsController, 'exportLogs'])
    router.get('activity-logs', [AdminActivityLogsController, 'index'])

    // 11. Security & Sessions
    router.get('security/passkeys', [AdminSecurityController, 'getPasskeys'])
    router.delete('security/passkeys/:id', [AdminSecurityController, 'deletePasskey'])
    router.get('security/sessions', [AdminSecurityController, 'getSessions'])
    router.delete('security/sessions/:id', [AdminSecurityController, 'revokeSession'])
    router.post('security/sessions/revoke-others', [AdminSecurityController, 'revokeOtherSessions'])
    router.put('security/password', [AdminSecurityController, 'updatePassword'])

    // 12. Manual Web Cache Revalidation
    router.post('revalidate', async ({ request, response }) => {
      const { RevalidateService } = await import('#services/revalidate_service')
      const tag = request.input('tag')
      const result = await RevalidateService.revalidate(tag)
      return response.ok({
        success: result.success,
        message: result.success
          ? `Cache revalidation '${tag || 'all'}' berhasil dikirim ke frontend Next.js`
          : `Gagal revalidasi cache: ${result.message}`,
      })
    })
  })
  .prefix('/api/admin')
  .use(middleware.auth({ guards: ['api'] }))


// ==========================================
// 3. PUBLIC READ-ONLY REST API ROUTES (/api/v1)
// ==========================================
router
  .group(() => {
    // Projects & Project Categories
    router.get('projects', [PublicProjectsController, 'index'])
    router.get('projects/:slug', [PublicProjectsController, 'show'])
    router.post('projects/:slug/track', [PublicProjectsController, 'trackEvent'])
    router
      .get('project-categories', [AdminProjectCategoriesController, 'index'])
      .as('public.project_categories.index')

    // Articles / Blog (Supports both /posts and /articles aliases) & Taxonomies
    router.get('posts', [PublicArticlesController, 'index']).as('public.posts.index')
    router.get('posts/:slug', [PublicArticlesController, 'show']).as('public.posts.show')
    router.get('articles', [PublicArticlesController, 'index']).as('public.articles.index')
    router.get('articles/:slug', [PublicArticlesController, 'show']).as('public.articles.show')
    router.get('categories', [AdminCategoriesController, 'index']).as('public.categories.index')
    router.get('tags', [AdminTagsController, 'index']).as('public.tags.index')

    // Tech Stacks
    router.get('tech-stacks', [PublicTechStacksController, 'index'])

    // Career Timeline
    router.get('experiences', [PublicExperiencesController, 'index'])

    // Services & Offerings
    router.get('services', [PublicServicesController, 'index'])
    router.get('services/:slug', [PublicServicesController, 'show'])

    // Philosophies
    router.get('philosophies', [PublicPhilosophiesController, 'index'])

    // Workflows
    router.get('workflows', [PublicWorkflowsController, 'index'])

    // Expertises
    router.get('expertises', [PublicExpertisesController, 'index'])

    // Settings (Site Profile, Socials, Maintenance)
    router.get('settings', [PublicSettingsController, 'index'])

    // Contact Inbox Submit (Stricter throttle for anti-spam)
    router.post('inbox', [PublicInboxesController, 'store']).use(middleware.throttle('inbox'))
  })
  .prefix('/api/v1')
  .use(middleware.throttle('public_api'))
