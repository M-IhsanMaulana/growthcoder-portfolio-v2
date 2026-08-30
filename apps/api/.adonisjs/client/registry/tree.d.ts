/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  drive: {
    local: {
      serve: typeof routes['drive.local.serve']
    }
  }
  eventStream: typeof routes['event_stream']
  subscribe: typeof routes['subscribe']
  unsubscribe: typeof routes['unsubscribe']
  auth: {
    login: typeof routes['auth.login']
    me: typeof routes['auth.me']
    logout: typeof routes['auth.logout']
  }
  passkey: {
    generateAuthenticationOptions: typeof routes['passkey.generate_authentication_options']
    verifyAuthentication: typeof routes['passkey.verify_authentication']
    generateRegistrationOptions: typeof routes['passkey.generate_registration_options']
    verifyRegistration: typeof routes['passkey.verify_registration']
  }
  adminDashboard: {
    index: typeof routes['admin_dashboard.index']
  }
  adminProjects: {
    index: typeof routes['admin_projects.index']
    store: typeof routes['admin_projects.store']
    reorder: typeof routes['admin_projects.reorder']
    show: typeof routes['admin_projects.show']
    analytics: typeof routes['admin_projects.analytics']
    update: typeof routes['admin_projects.update']
    destroy: typeof routes['admin_projects.destroy']
  }
  adminProjectCategories: {
    index: typeof routes['admin_project_categories.index']
    store: typeof routes['admin_project_categories.store']
    show: typeof routes['admin_project_categories.show']
    update: typeof routes['admin_project_categories.update']
    destroy: typeof routes['admin_project_categories.destroy']
  }
  adminArticles: {
    index: typeof routes['admin_articles.index']
    store: typeof routes['admin_articles.store']
    publishScheduled: typeof routes['admin_articles.publish_scheduled']
    show: typeof routes['admin_articles.show']
    analytics: typeof routes['admin_articles.analytics']
    update: typeof routes['admin_articles.update']
    destroy: typeof routes['admin_articles.destroy']
    toggleStatus: typeof routes['admin_articles.toggle_status']
  }
  adminCategories: {
    index: typeof routes['admin_categories.index']
    store: typeof routes['admin_categories.store']
    show: typeof routes['admin_categories.show']
    update: typeof routes['admin_categories.update']
    destroy: typeof routes['admin_categories.destroy']
  }
  adminTags: {
    index: typeof routes['admin_tags.index']
    store: typeof routes['admin_tags.store']
    show: typeof routes['admin_tags.show']
    update: typeof routes['admin_tags.update']
    destroy: typeof routes['admin_tags.destroy']
  }
  adminTechStacks: {
    index: typeof routes['admin_tech_stacks.index']
    store: typeof routes['admin_tech_stacks.store']
    show: typeof routes['admin_tech_stacks.show']
    update: typeof routes['admin_tech_stacks.update']
    destroy: typeof routes['admin_tech_stacks.destroy']
  }
  adminExperiences: {
    index: typeof routes['admin_experiences.index']
    store: typeof routes['admin_experiences.store']
    reorder: typeof routes['admin_experiences.reorder']
    show: typeof routes['admin_experiences.show']
    update: typeof routes['admin_experiences.update']
    destroy: typeof routes['admin_experiences.destroy']
  }
  adminEducations: {
    index: typeof routes['admin_educations.index']
    store: typeof routes['admin_educations.store']
    reorder: typeof routes['admin_educations.reorder']
    show: typeof routes['admin_educations.show']
    update: typeof routes['admin_educations.update']
    destroy: typeof routes['admin_educations.destroy']
  }
  adminCertifications: {
    index: typeof routes['admin_certifications.index']
    store: typeof routes['admin_certifications.store']
    reorder: typeof routes['admin_certifications.reorder']
    show: typeof routes['admin_certifications.show']
    update: typeof routes['admin_certifications.update']
    destroy: typeof routes['admin_certifications.destroy']
  }
  adminServices: {
    index: typeof routes['admin_services.index']
    store: typeof routes['admin_services.store']
    show: typeof routes['admin_services.show']
    update: typeof routes['admin_services.update']
    destroy: typeof routes['admin_services.destroy']
  }
  adminPhilosophies: {
    index: typeof routes['admin_philosophies.index']
    store: typeof routes['admin_philosophies.store']
    show: typeof routes['admin_philosophies.show']
    update: typeof routes['admin_philosophies.update']
    destroy: typeof routes['admin_philosophies.destroy']
  }
  adminWorkflows: {
    index: typeof routes['admin_workflows.index']
    store: typeof routes['admin_workflows.store']
    reorder: typeof routes['admin_workflows.reorder']
    show: typeof routes['admin_workflows.show']
    update: typeof routes['admin_workflows.update']
    destroy: typeof routes['admin_workflows.destroy']
  }
  adminExpertises: {
    index: typeof routes['admin_expertises.index']
    store: typeof routes['admin_expertises.store']
    reorder: typeof routes['admin_expertises.reorder']
    show: typeof routes['admin_expertises.show']
    update: typeof routes['admin_expertises.update']
    destroy: typeof routes['admin_expertises.destroy']
  }
  adminInboxes: {
    index: typeof routes['admin_inboxes.index']
    show: typeof routes['admin_inboxes.show']
    updateStatus: typeof routes['admin_inboxes.update_status']
    destroy: typeof routes['admin_inboxes.destroy']
  }
  adminMedia: {
    stats: typeof routes['admin_media.stats']
    bulkDestroy: typeof routes['admin_media.bulk_destroy']
    index: typeof routes['admin_media.index']
    upload: typeof routes['admin_media.upload']
    show: typeof routes['admin_media.show']
    update: typeof routes['admin_media.update']
    destroy: typeof routes['admin_media.destroy']
  }
  adminSettings: {
    index: typeof routes['admin_settings.index']
    updateSingle: typeof routes['admin_settings.update_single']
    updateBulk: typeof routes['admin_settings.update_bulk']
    testTelegram: typeof routes['admin_settings.test_telegram']
  }
  adminActivityLogs: {
    stats: typeof routes['admin_activity_logs.stats']
    exportLogs: typeof routes['admin_activity_logs.export_logs']
    index: typeof routes['admin_activity_logs.index']
  }
  adminSecurity: {
    getPasskeys: typeof routes['admin_security.get_passkeys']
    deletePasskey: typeof routes['admin_security.delete_passkey']
    getSessions: typeof routes['admin_security.get_sessions']
    revokeSession: typeof routes['admin_security.revoke_session']
    revokeOtherSessions: typeof routes['admin_security.revoke_other_sessions']
    updatePassword: typeof routes['admin_security.update_password']
  }
  publicProjects: {
    index: typeof routes['public_projects.index']
    show: typeof routes['public_projects.show']
    trackEvent: typeof routes['public_projects.track_event']
  }
  public: {
    projectCategories: {
      index: typeof routes['public.project_categories.index']
    }
    posts: {
      index: typeof routes['public.posts.index']
      show: typeof routes['public.posts.show']
    }
    articles: {
      index: typeof routes['public.articles.index']
      show: typeof routes['public.articles.show']
    }
    categories: {
      index: typeof routes['public.categories.index']
    }
    tags: {
      index: typeof routes['public.tags.index']
    }
  }
  publicTechStacks: {
    index: typeof routes['public_tech_stacks.index']
  }
  publicExperiences: {
    index: typeof routes['public_experiences.index']
  }
  publicServices: {
    index: typeof routes['public_services.index']
    show: typeof routes['public_services.show']
  }
  publicPhilosophies: {
    index: typeof routes['public_philosophies.index']
  }
  publicWorkflows: {
    index: typeof routes['public_workflows.index']
  }
  publicExpertises: {
    index: typeof routes['public_expertises.index']
  }
  publicSettings: {
    index: typeof routes['public_settings.index']
  }
  publicInboxes: {
    store: typeof routes['public_inboxes.store']
  }
}
