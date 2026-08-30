import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.local.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'event_stream': { paramsTuple?: []; params?: {} }
    'subscribe': { paramsTuple?: []; params?: {} }
    'unsubscribe': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'passkey.generate_authentication_options': { paramsTuple?: []; params?: {} }
    'passkey.verify_authentication': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'passkey.generate_registration_options': { paramsTuple?: []; params?: {} }
    'passkey.verify_registration': { paramsTuple?: []; params?: {} }
    'admin_dashboard.index': { paramsTuple?: []; params?: {} }
    'admin_projects.index': { paramsTuple?: []; params?: {} }
    'admin_projects.store': { paramsTuple?: []; params?: {} }
    'admin_projects.reorder': { paramsTuple?: []; params?: {} }
    'admin_projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_projects.analytics': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_project_categories.index': { paramsTuple?: []; params?: {} }
    'admin_project_categories.store': { paramsTuple?: []; params?: {} }
    'admin_project_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_project_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_project_categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_articles.index': { paramsTuple?: []; params?: {} }
    'admin_articles.store': { paramsTuple?: []; params?: {} }
    'admin_articles.publish_scheduled': { paramsTuple?: []; params?: {} }
    'admin_articles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_articles.analytics': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_articles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_articles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_articles.toggle_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_categories.index': { paramsTuple?: []; params?: {} }
    'admin_categories.store': { paramsTuple?: []; params?: {} }
    'admin_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_tags.index': { paramsTuple?: []; params?: {} }
    'admin_tags.store': { paramsTuple?: []; params?: {} }
    'admin_tags.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_tags.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_tags.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_tech_stacks.index': { paramsTuple?: []; params?: {} }
    'admin_tech_stacks.store': { paramsTuple?: []; params?: {} }
    'admin_tech_stacks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_tech_stacks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_tech_stacks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_experiences.index': { paramsTuple?: []; params?: {} }
    'admin_experiences.store': { paramsTuple?: []; params?: {} }
    'admin_experiences.reorder': { paramsTuple?: []; params?: {} }
    'admin_experiences.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_experiences.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_experiences.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_educations.index': { paramsTuple?: []; params?: {} }
    'admin_educations.store': { paramsTuple?: []; params?: {} }
    'admin_educations.reorder': { paramsTuple?: []; params?: {} }
    'admin_educations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_educations.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_educations.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_certifications.index': { paramsTuple?: []; params?: {} }
    'admin_certifications.store': { paramsTuple?: []; params?: {} }
    'admin_certifications.reorder': { paramsTuple?: []; params?: {} }
    'admin_certifications.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_certifications.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_certifications.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_services.index': { paramsTuple?: []; params?: {} }
    'admin_services.store': { paramsTuple?: []; params?: {} }
    'admin_services.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_services.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_services.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_philosophies.index': { paramsTuple?: []; params?: {} }
    'admin_philosophies.store': { paramsTuple?: []; params?: {} }
    'admin_philosophies.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_philosophies.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_philosophies.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_workflows.index': { paramsTuple?: []; params?: {} }
    'admin_workflows.store': { paramsTuple?: []; params?: {} }
    'admin_workflows.reorder': { paramsTuple?: []; params?: {} }
    'admin_workflows.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_workflows.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_workflows.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_expertises.index': { paramsTuple?: []; params?: {} }
    'admin_expertises.store': { paramsTuple?: []; params?: {} }
    'admin_expertises.reorder': { paramsTuple?: []; params?: {} }
    'admin_expertises.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_expertises.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_expertises.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_inboxes.index': { paramsTuple?: []; params?: {} }
    'admin_inboxes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_inboxes.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_inboxes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_media.stats': { paramsTuple?: []; params?: {} }
    'admin_media.bulk_destroy': { paramsTuple?: []; params?: {} }
    'admin_media.index': { paramsTuple?: []; params?: {} }
    'admin_media.upload': { paramsTuple?: []; params?: {} }
    'admin_media.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_media.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_media.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_settings.index': { paramsTuple?: []; params?: {} }
    'admin_settings.update_single': { paramsTuple?: []; params?: {} }
    'admin_settings.update_bulk': { paramsTuple?: []; params?: {} }
    'admin_settings.test_telegram': { paramsTuple?: []; params?: {} }
    'admin_activity_logs.stats': { paramsTuple?: []; params?: {} }
    'admin_activity_logs.export_logs': { paramsTuple?: []; params?: {} }
    'admin_activity_logs.index': { paramsTuple?: []; params?: {} }
    'admin_security.get_passkeys': { paramsTuple?: []; params?: {} }
    'admin_security.delete_passkey': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_security.get_sessions': { paramsTuple?: []; params?: {} }
    'admin_security.revoke_session': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_security.revoke_other_sessions': { paramsTuple?: []; params?: {} }
    'admin_security.update_password': { paramsTuple?: []; params?: {} }
    'public_projects.index': { paramsTuple?: []; params?: {} }
    'public_projects.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public_projects.track_event': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public.project_categories.index': { paramsTuple?: []; params?: {} }
    'public.posts.index': { paramsTuple?: []; params?: {} }
    'public.posts.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public.articles.index': { paramsTuple?: []; params?: {} }
    'public.articles.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public.categories.index': { paramsTuple?: []; params?: {} }
    'public.tags.index': { paramsTuple?: []; params?: {} }
    'public_tech_stacks.index': { paramsTuple?: []; params?: {} }
    'public_experiences.index': { paramsTuple?: []; params?: {} }
    'public_services.index': { paramsTuple?: []; params?: {} }
    'public_services.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public_philosophies.index': { paramsTuple?: []; params?: {} }
    'public_workflows.index': { paramsTuple?: []; params?: {} }
    'public_expertises.index': { paramsTuple?: []; params?: {} }
    'public_settings.index': { paramsTuple?: []; params?: {} }
    'public_inboxes.store': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'drive.local.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'event_stream': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'admin_dashboard.index': { paramsTuple?: []; params?: {} }
    'admin_projects.index': { paramsTuple?: []; params?: {} }
    'admin_projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_projects.analytics': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_project_categories.index': { paramsTuple?: []; params?: {} }
    'admin_project_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_articles.index': { paramsTuple?: []; params?: {} }
    'admin_articles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_articles.analytics': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_categories.index': { paramsTuple?: []; params?: {} }
    'admin_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_tags.index': { paramsTuple?: []; params?: {} }
    'admin_tags.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_tech_stacks.index': { paramsTuple?: []; params?: {} }
    'admin_tech_stacks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_experiences.index': { paramsTuple?: []; params?: {} }
    'admin_experiences.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_educations.index': { paramsTuple?: []; params?: {} }
    'admin_educations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_certifications.index': { paramsTuple?: []; params?: {} }
    'admin_certifications.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_services.index': { paramsTuple?: []; params?: {} }
    'admin_services.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_philosophies.index': { paramsTuple?: []; params?: {} }
    'admin_philosophies.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_workflows.index': { paramsTuple?: []; params?: {} }
    'admin_workflows.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_expertises.index': { paramsTuple?: []; params?: {} }
    'admin_expertises.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_inboxes.index': { paramsTuple?: []; params?: {} }
    'admin_inboxes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_media.stats': { paramsTuple?: []; params?: {} }
    'admin_media.index': { paramsTuple?: []; params?: {} }
    'admin_media.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_settings.index': { paramsTuple?: []; params?: {} }
    'admin_activity_logs.stats': { paramsTuple?: []; params?: {} }
    'admin_activity_logs.export_logs': { paramsTuple?: []; params?: {} }
    'admin_activity_logs.index': { paramsTuple?: []; params?: {} }
    'admin_security.get_passkeys': { paramsTuple?: []; params?: {} }
    'admin_security.get_sessions': { paramsTuple?: []; params?: {} }
    'public_projects.index': { paramsTuple?: []; params?: {} }
    'public_projects.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public.project_categories.index': { paramsTuple?: []; params?: {} }
    'public.posts.index': { paramsTuple?: []; params?: {} }
    'public.posts.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public.articles.index': { paramsTuple?: []; params?: {} }
    'public.articles.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public.categories.index': { paramsTuple?: []; params?: {} }
    'public.tags.index': { paramsTuple?: []; params?: {} }
    'public_tech_stacks.index': { paramsTuple?: []; params?: {} }
    'public_experiences.index': { paramsTuple?: []; params?: {} }
    'public_services.index': { paramsTuple?: []; params?: {} }
    'public_services.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public_philosophies.index': { paramsTuple?: []; params?: {} }
    'public_workflows.index': { paramsTuple?: []; params?: {} }
    'public_expertises.index': { paramsTuple?: []; params?: {} }
    'public_settings.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'drive.local.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'event_stream': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'admin_dashboard.index': { paramsTuple?: []; params?: {} }
    'admin_projects.index': { paramsTuple?: []; params?: {} }
    'admin_projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_projects.analytics': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_project_categories.index': { paramsTuple?: []; params?: {} }
    'admin_project_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_articles.index': { paramsTuple?: []; params?: {} }
    'admin_articles.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_articles.analytics': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_categories.index': { paramsTuple?: []; params?: {} }
    'admin_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_tags.index': { paramsTuple?: []; params?: {} }
    'admin_tags.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_tech_stacks.index': { paramsTuple?: []; params?: {} }
    'admin_tech_stacks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_experiences.index': { paramsTuple?: []; params?: {} }
    'admin_experiences.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_educations.index': { paramsTuple?: []; params?: {} }
    'admin_educations.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_certifications.index': { paramsTuple?: []; params?: {} }
    'admin_certifications.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_services.index': { paramsTuple?: []; params?: {} }
    'admin_services.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_philosophies.index': { paramsTuple?: []; params?: {} }
    'admin_philosophies.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_workflows.index': { paramsTuple?: []; params?: {} }
    'admin_workflows.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_expertises.index': { paramsTuple?: []; params?: {} }
    'admin_expertises.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_inboxes.index': { paramsTuple?: []; params?: {} }
    'admin_inboxes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_media.stats': { paramsTuple?: []; params?: {} }
    'admin_media.index': { paramsTuple?: []; params?: {} }
    'admin_media.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_settings.index': { paramsTuple?: []; params?: {} }
    'admin_activity_logs.stats': { paramsTuple?: []; params?: {} }
    'admin_activity_logs.export_logs': { paramsTuple?: []; params?: {} }
    'admin_activity_logs.index': { paramsTuple?: []; params?: {} }
    'admin_security.get_passkeys': { paramsTuple?: []; params?: {} }
    'admin_security.get_sessions': { paramsTuple?: []; params?: {} }
    'public_projects.index': { paramsTuple?: []; params?: {} }
    'public_projects.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public.project_categories.index': { paramsTuple?: []; params?: {} }
    'public.posts.index': { paramsTuple?: []; params?: {} }
    'public.posts.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public.articles.index': { paramsTuple?: []; params?: {} }
    'public.articles.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public.categories.index': { paramsTuple?: []; params?: {} }
    'public.tags.index': { paramsTuple?: []; params?: {} }
    'public_tech_stacks.index': { paramsTuple?: []; params?: {} }
    'public_experiences.index': { paramsTuple?: []; params?: {} }
    'public_services.index': { paramsTuple?: []; params?: {} }
    'public_services.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public_philosophies.index': { paramsTuple?: []; params?: {} }
    'public_workflows.index': { paramsTuple?: []; params?: {} }
    'public_expertises.index': { paramsTuple?: []; params?: {} }
    'public_settings.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'subscribe': { paramsTuple?: []; params?: {} }
    'unsubscribe': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'passkey.generate_authentication_options': { paramsTuple?: []; params?: {} }
    'passkey.verify_authentication': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'passkey.generate_registration_options': { paramsTuple?: []; params?: {} }
    'passkey.verify_registration': { paramsTuple?: []; params?: {} }
    'admin_projects.store': { paramsTuple?: []; params?: {} }
    'admin_projects.reorder': { paramsTuple?: []; params?: {} }
    'admin_project_categories.store': { paramsTuple?: []; params?: {} }
    'admin_articles.store': { paramsTuple?: []; params?: {} }
    'admin_articles.publish_scheduled': { paramsTuple?: []; params?: {} }
    'admin_categories.store': { paramsTuple?: []; params?: {} }
    'admin_tags.store': { paramsTuple?: []; params?: {} }
    'admin_tech_stacks.store': { paramsTuple?: []; params?: {} }
    'admin_experiences.store': { paramsTuple?: []; params?: {} }
    'admin_experiences.reorder': { paramsTuple?: []; params?: {} }
    'admin_educations.store': { paramsTuple?: []; params?: {} }
    'admin_educations.reorder': { paramsTuple?: []; params?: {} }
    'admin_certifications.store': { paramsTuple?: []; params?: {} }
    'admin_certifications.reorder': { paramsTuple?: []; params?: {} }
    'admin_services.store': { paramsTuple?: []; params?: {} }
    'admin_philosophies.store': { paramsTuple?: []; params?: {} }
    'admin_workflows.store': { paramsTuple?: []; params?: {} }
    'admin_workflows.reorder': { paramsTuple?: []; params?: {} }
    'admin_expertises.store': { paramsTuple?: []; params?: {} }
    'admin_expertises.reorder': { paramsTuple?: []; params?: {} }
    'admin_media.bulk_destroy': { paramsTuple?: []; params?: {} }
    'admin_media.upload': { paramsTuple?: []; params?: {} }
    'admin_settings.test_telegram': { paramsTuple?: []; params?: {} }
    'admin_security.revoke_other_sessions': { paramsTuple?: []; params?: {} }
    'public_projects.track_event': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'public_inboxes.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'admin_projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_project_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_articles.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_tags.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_tech_stacks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_experiences.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_educations.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_certifications.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_services.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_philosophies.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_workflows.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_expertises.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_settings.update_single': { paramsTuple?: []; params?: {} }
    'admin_settings.update_bulk': { paramsTuple?: []; params?: {} }
    'admin_security.update_password': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'admin_projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_project_categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_articles.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_tags.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_tech_stacks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_experiences.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_educations.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_certifications.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_services.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_philosophies.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_workflows.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_expertises.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_inboxes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_media.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_security.delete_passkey': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_security.revoke_session': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'admin_articles.toggle_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_inboxes.update_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_media.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}