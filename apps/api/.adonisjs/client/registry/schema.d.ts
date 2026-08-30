/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'drive.local.serve': {
    methods: ["GET","HEAD"]
    pattern: '/uploads/*'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { '*': ParamValue[] }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'event_stream': {
    methods: ["GET","HEAD"]
    pattern: '/__transmit/events'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'subscribe': {
    methods: ["POST"]
    pattern: '/__transmit/subscribe'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'unsubscribe': {
    methods: ["POST"]
    pattern: '/__transmit/unsubscribe'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'auth.login': {
    methods: ["POST"]
    pattern: '/api/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth_validator').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth_validator').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/auth_controller').default['login']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/auth_controller').default['login']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'passkey.generate_authentication_options': {
    methods: ["POST"]
    pattern: '/api/auth/passkey/generate-authentication-options'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth_validator').passkeyChallengeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth_validator').passkeyChallengeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/passkey_controller').default['generateAuthenticationOptions']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/passkey_controller').default['generateAuthenticationOptions']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'passkey.verify_authentication': {
    methods: ["POST"]
    pattern: '/api/auth/passkey/verify-authentication'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth_validator').verifyPasskeyAuthenticationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth_validator').verifyPasskeyAuthenticationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/passkey_controller').default['verifyAuthentication']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/passkey_controller').default['verifyAuthentication']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.me': {
    methods: ["GET","HEAD"]
    pattern: '/api/auth/me'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/auth_controller').default['me']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/auth_controller').default['me']>>>
    }
  }
  'auth.logout': {
    methods: ["POST"]
    pattern: '/api/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/auth_controller').default['logout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/auth_controller').default['logout']>>>
    }
  }
  'passkey.generate_registration_options': {
    methods: ["POST"]
    pattern: '/api/auth/passkey/generate-registration-options'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/passkey_controller').default['generateRegistrationOptions']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/passkey_controller').default['generateRegistrationOptions']>>>
    }
  }
  'passkey.verify_registration': {
    methods: ["POST"]
    pattern: '/api/auth/passkey/verify-registration'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth_validator').verifyPasskeyRegistrationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth_validator').verifyPasskeyRegistrationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/passkey_controller').default['verifyRegistration']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/passkey_controller').default['verifyRegistration']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_dashboard.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/dashboard_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/dashboard_controller').default['index']>>>
    }
  }
  'admin_projects.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/projects'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['index']>>>
    }
  }
  'admin_projects.store': {
    methods: ["POST"]
    pattern: '/api/admin/projects'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project_validator').createProjectValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/project_validator').createProjectValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_projects.reorder': {
    methods: ["POST"]
    pattern: '/api/admin/projects/reorder'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['reorder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['reorder']>>>
    }
  }
  'admin_projects.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/projects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['show']>>>
    }
  }
  'admin_projects.analytics': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/projects/:id/analytics'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['analytics']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['analytics']>>>
    }
  }
  'admin_projects.update': {
    methods: ["PUT"]
    pattern: '/api/admin/projects/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project_validator').updateProjectValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/project_validator').updateProjectValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_projects.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/projects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/projects_controller').default['destroy']>>>
    }
  }
  'admin_project_categories.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/project-categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/project_categories_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/project_categories_controller').default['index']>>>
    }
  }
  'admin_project_categories.store': {
    methods: ["POST"]
    pattern: '/api/admin/project-categories'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project_validator').projectCategoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/project_validator').projectCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/project_categories_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/project_categories_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_project_categories.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/project-categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/project_categories_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/project_categories_controller').default['show']>>>
    }
  }
  'admin_project_categories.update': {
    methods: ["PUT"]
    pattern: '/api/admin/project-categories/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/project_validator').projectCategoryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/project_validator').projectCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/project_categories_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/project_categories_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_project_categories.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/project-categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/project_categories_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/project_categories_controller').default['destroy']>>>
    }
  }
  'admin_articles.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/articles'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['index']>>>
    }
  }
  'admin_articles.store': {
    methods: ["POST"]
    pattern: '/api/admin/articles'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/article_validator').createArticleValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/article_validator').createArticleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_articles.publish_scheduled': {
    methods: ["POST"]
    pattern: '/api/admin/articles/publish-scheduled'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['publishScheduled']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['publishScheduled']>>>
    }
  }
  'admin_articles.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/articles/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['show']>>>
    }
  }
  'admin_articles.analytics': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/articles/:id/analytics'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['analytics']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['analytics']>>>
    }
  }
  'admin_articles.update': {
    methods: ["PUT"]
    pattern: '/api/admin/articles/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/article_validator').updateArticleValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/article_validator').updateArticleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_articles.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/articles/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['destroy']>>>
    }
  }
  'admin_articles.toggle_status': {
    methods: ["PATCH"]
    pattern: '/api/admin/articles/:id/status'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['toggleStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/articles_controller').default['toggleStatus']>>>
    }
  }
  'admin_categories.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['index']>>>
    }
  }
  'admin_categories.store': {
    methods: ["POST"]
    pattern: '/api/admin/categories'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/taxonomy_validator').categoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/taxonomy_validator').categoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_categories.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['show']>>>
    }
  }
  'admin_categories.update': {
    methods: ["PUT"]
    pattern: '/api/admin/categories/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/taxonomy_validator').categoryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/taxonomy_validator').categoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_categories.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['destroy']>>>
    }
  }
  'admin_tags.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/tags'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['index']>>>
    }
  }
  'admin_tags.store': {
    methods: ["POST"]
    pattern: '/api/admin/tags'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/taxonomy_validator').tagValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/taxonomy_validator').tagValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_tags.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/tags/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['show']>>>
    }
  }
  'admin_tags.update': {
    methods: ["PUT"]
    pattern: '/api/admin/tags/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/taxonomy_validator').tagValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/taxonomy_validator').tagValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_tags.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/tags/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['destroy']>>>
    }
  }
  'admin_tech_stacks.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/tech-stacks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/tech_stacks_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/tech_stacks_controller').default['index']>>>
    }
  }
  'admin_tech_stacks.store': {
    methods: ["POST"]
    pattern: '/api/admin/tech-stacks'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/tech_stack_validator').createTechStackValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/tech_stack_validator').createTechStackValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/tech_stacks_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/tech_stacks_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_tech_stacks.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/tech-stacks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/tech_stacks_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/tech_stacks_controller').default['show']>>>
    }
  }
  'admin_tech_stacks.update': {
    methods: ["PUT"]
    pattern: '/api/admin/tech-stacks/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/tech_stack_validator').updateTechStackValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/tech_stack_validator').updateTechStackValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/tech_stacks_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/tech_stacks_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_tech_stacks.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/tech-stacks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/tech_stacks_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/tech_stacks_controller').default['destroy']>>>
    }
  }
  'admin_experiences.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/experiences'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/experiences_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/experiences_controller').default['index']>>>
    }
  }
  'admin_experiences.store': {
    methods: ["POST"]
    pattern: '/api/admin/experiences'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/career_validator').experienceValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/career_validator').experienceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/experiences_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/experiences_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_experiences.reorder': {
    methods: ["POST"]
    pattern: '/api/admin/experiences/reorder'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/career_validator').reorderCareerValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/career_validator').reorderCareerValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/experiences_controller').default['reorder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/experiences_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_experiences.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/experiences/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/experiences_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/experiences_controller').default['show']>>>
    }
  }
  'admin_experiences.update': {
    methods: ["PUT"]
    pattern: '/api/admin/experiences/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/career_validator').experienceValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/career_validator').experienceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/experiences_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/experiences_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_experiences.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/experiences/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/experiences_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/experiences_controller').default['destroy']>>>
    }
  }
  'admin_educations.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/educations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/educations_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/educations_controller').default['index']>>>
    }
  }
  'admin_educations.store': {
    methods: ["POST"]
    pattern: '/api/admin/educations'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/career_validator').educationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/career_validator').educationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/educations_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/educations_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_educations.reorder': {
    methods: ["POST"]
    pattern: '/api/admin/educations/reorder'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/career_validator').reorderCareerValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/career_validator').reorderCareerValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/educations_controller').default['reorder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/educations_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_educations.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/educations/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/educations_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/educations_controller').default['show']>>>
    }
  }
  'admin_educations.update': {
    methods: ["PUT"]
    pattern: '/api/admin/educations/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/career_validator').educationValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/career_validator').educationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/educations_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/educations_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_educations.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/educations/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/educations_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/educations_controller').default['destroy']>>>
    }
  }
  'admin_certifications.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/certifications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/certifications_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/certifications_controller').default['index']>>>
    }
  }
  'admin_certifications.store': {
    methods: ["POST"]
    pattern: '/api/admin/certifications'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/career_validator').certificationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/career_validator').certificationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/certifications_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/certifications_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_certifications.reorder': {
    methods: ["POST"]
    pattern: '/api/admin/certifications/reorder'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/career_validator').reorderCareerValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/career_validator').reorderCareerValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/certifications_controller').default['reorder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/certifications_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_certifications.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/certifications/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/certifications_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/certifications_controller').default['show']>>>
    }
  }
  'admin_certifications.update': {
    methods: ["PUT"]
    pattern: '/api/admin/certifications/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/career_validator').certificationValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/career_validator').certificationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/certifications_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/certifications_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_certifications.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/certifications/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/certifications_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/certifications_controller').default['destroy']>>>
    }
  }
  'admin_services.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/services'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/services_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/services_controller').default['index']>>>
    }
  }
  'admin_services.store': {
    methods: ["POST"]
    pattern: '/api/admin/services'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/service_validator').serviceValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/service_validator').serviceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/services_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/services_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_services.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/services/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/services_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/services_controller').default['show']>>>
    }
  }
  'admin_services.update': {
    methods: ["PUT"]
    pattern: '/api/admin/services/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/service_validator').serviceValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/service_validator').serviceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/services_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/services_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_services.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/services/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/services_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/services_controller').default['destroy']>>>
    }
  }
  'admin_philosophies.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/philosophies'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/philosophies_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/philosophies_controller').default['index']>>>
    }
  }
  'admin_philosophies.store': {
    methods: ["POST"]
    pattern: '/api/admin/philosophies'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/service_validator').philosophyValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/service_validator').philosophyValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/philosophies_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/philosophies_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_philosophies.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/philosophies/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/philosophies_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/philosophies_controller').default['show']>>>
    }
  }
  'admin_philosophies.update': {
    methods: ["PUT"]
    pattern: '/api/admin/philosophies/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/service_validator').philosophyValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/service_validator').philosophyValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/philosophies_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/philosophies_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_philosophies.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/philosophies/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/philosophies_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/philosophies_controller').default['destroy']>>>
    }
  }
  'admin_workflows.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/workflows'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/workflows_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/workflows_controller').default['index']>>>
    }
  }
  'admin_workflows.store': {
    methods: ["POST"]
    pattern: '/api/admin/workflows'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/workflow_validator').workflowStepValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/workflow_validator').workflowStepValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/workflows_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/workflows_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_workflows.reorder': {
    methods: ["POST"]
    pattern: '/api/admin/workflows/reorder'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/workflow_validator').workflowReorderValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/workflow_validator').workflowReorderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/workflows_controller').default['reorder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/workflows_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_workflows.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/workflows/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/workflows_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/workflows_controller').default['show']>>>
    }
  }
  'admin_workflows.update': {
    methods: ["PUT"]
    pattern: '/api/admin/workflows/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/workflow_validator').workflowStepValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/workflow_validator').workflowStepValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/workflows_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/workflows_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_workflows.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/workflows/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/workflows_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/workflows_controller').default['destroy']>>>
    }
  }
  'admin_expertises.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/expertises'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/expertises_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/expertises_controller').default['index']>>>
    }
  }
  'admin_expertises.store': {
    methods: ["POST"]
    pattern: '/api/admin/expertises'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/expertise_validator').expertiseValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/expertise_validator').expertiseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/expertises_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/expertises_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_expertises.reorder': {
    methods: ["POST"]
    pattern: '/api/admin/expertises/reorder'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/expertise_validator').reorderExpertiseValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/expertise_validator').reorderExpertiseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/expertises_controller').default['reorder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/expertises_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_expertises.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/expertises/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/expertises_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/expertises_controller').default['show']>>>
    }
  }
  'admin_expertises.update': {
    methods: ["PUT"]
    pattern: '/api/admin/expertises/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/expertise_validator').expertiseValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/expertise_validator').expertiseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/expertises_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/expertises_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_expertises.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/expertises/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/expertises_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/expertises_controller').default['destroy']>>>
    }
  }
  'admin_inboxes.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/inboxes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/inboxes_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/inboxes_controller').default['index']>>>
    }
  }
  'admin_inboxes.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/inboxes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/inboxes_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/inboxes_controller').default['show']>>>
    }
  }
  'admin_inboxes.update_status': {
    methods: ["PATCH"]
    pattern: '/api/admin/inboxes/:id/status'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/inbox_validator').updateInboxStatusValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/inbox_validator').updateInboxStatusValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/inboxes_controller').default['updateStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/inboxes_controller').default['updateStatus']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_inboxes.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/inboxes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/inboxes_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/inboxes_controller').default['destroy']>>>
    }
  }
  'admin_media.stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/media/stats'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['stats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['stats']>>>
    }
  }
  'admin_media.bulk_destroy': {
    methods: ["POST"]
    pattern: '/api/admin/media/bulk-delete'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/media_validator').bulkDeleteMediaValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/media_validator').bulkDeleteMediaValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['bulkDestroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['bulkDestroy']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_media.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/media'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['index']>>>
    }
  }
  'admin_media.upload': {
    methods: ["POST"]
    pattern: '/api/admin/media/upload'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/media_validator').uploadMediaValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/media_validator').uploadMediaValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['upload']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['upload']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_media.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/media/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['show']>>>
    }
  }
  'admin_media.update': {
    methods: ["PATCH"]
    pattern: '/api/admin/media/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/media_validator').updateMediaValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/media_validator').updateMediaValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_media.destroy': {
    methods: ["DELETE"]
    pattern: '/api/admin/media/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/media_controller').default['destroy']>>>
    }
  }
  'admin_settings.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['index']>>>
    }
  }
  'admin_settings.update_single': {
    methods: ["PUT"]
    pattern: '/api/admin/settings/single'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/setting_validator').updateSettingValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/setting_validator').updateSettingValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['updateSingle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['updateSingle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_settings.update_bulk': {
    methods: ["PUT"]
    pattern: '/api/admin/settings/bulk'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/setting_validator').updateBulkSettingsValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/setting_validator').updateBulkSettingsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['updateBulk']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['updateBulk']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin_settings.test_telegram': {
    methods: ["POST"]
    pattern: '/api/admin/settings/telegram/test'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['testTelegram']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['testTelegram']>>>
    }
  }
  'admin_activity_logs.stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/activity-logs/stats'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/activity_logs_controller').default['stats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/activity_logs_controller').default['stats']>>>
    }
  }
  'admin_activity_logs.export_logs': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/activity-logs/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/activity_logs_controller').default['exportLogs']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/activity_logs_controller').default['exportLogs']>>>
    }
  }
  'admin_activity_logs.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/activity-logs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/activity_logs_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/activity_logs_controller').default['index']>>>
    }
  }
  'admin_security.get_passkeys': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/security/passkeys'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['getPasskeys']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['getPasskeys']>>>
    }
  }
  'admin_security.delete_passkey': {
    methods: ["DELETE"]
    pattern: '/api/admin/security/passkeys/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['deletePasskey']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['deletePasskey']>>>
    }
  }
  'admin_security.get_sessions': {
    methods: ["GET","HEAD"]
    pattern: '/api/admin/security/sessions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['getSessions']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['getSessions']>>>
    }
  }
  'admin_security.revoke_session': {
    methods: ["DELETE"]
    pattern: '/api/admin/security/sessions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['revokeSession']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['revokeSession']>>>
    }
  }
  'admin_security.revoke_other_sessions': {
    methods: ["POST"]
    pattern: '/api/admin/security/sessions/revoke-others'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['revokeOtherSessions']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['revokeOtherSessions']>>>
    }
  }
  'admin_security.update_password': {
    methods: ["PUT"]
    pattern: '/api/admin/security/password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/security_validator').changePasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/security_validator').changePasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['updatePassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/security_controller').default['updatePassword']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'public_projects.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/projects'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public/projects_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public/projects_controller').default['index']>>>
    }
  }
  'public_projects.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/projects/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public/projects_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public/projects_controller').default['show']>>>
    }
  }
  'public_projects.track_event': {
    methods: ["POST"]
    pattern: '/api/v1/projects/:slug/track'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public/projects_controller').default['trackEvent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public/projects_controller').default['trackEvent']>>>
    }
  }
  'public.project_categories.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/project-categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/project_categories_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/project_categories_controller').default['index']>>>
    }
  }
  'public.posts.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/posts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public/articles_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public/articles_controller').default['index']>>>
    }
  }
  'public.posts.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/posts/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public/articles_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public/articles_controller').default['show']>>>
    }
  }
  'public.articles.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/articles'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public/articles_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public/articles_controller').default['index']>>>
    }
  }
  'public.articles.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/articles/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public/articles_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public/articles_controller').default['show']>>>
    }
  }
  'public.categories.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/categories_controller').default['index']>>>
    }
  }
  'public.tags.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/tags'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/tags_controller').default['index']>>>
    }
  }
  'public_tech_stacks.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/tech-stacks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public/tech_stacks_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public/tech_stacks_controller').default['index']>>>
    }
  }
  'public_experiences.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/experiences'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public/experiences_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public/experiences_controller').default['index']>>>
    }
  }
  'public_services.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/services'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public/services_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public/services_controller').default['index']>>>
    }
  }
  'public_services.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/services/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public/services_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public/services_controller').default['show']>>>
    }
  }
  'public_philosophies.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/philosophies'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public/philosophies_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public/philosophies_controller').default['index']>>>
    }
  }
  'public_workflows.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/workflows'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public/workflows_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public/workflows_controller').default['index']>>>
    }
  }
  'public_expertises.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/expertises'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public/expertises_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public/expertises_controller').default['index']>>>
    }
  }
  'public_settings.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public/settings_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public/settings_controller').default['index']>>>
    }
  }
  'public_inboxes.store': {
    methods: ["POST"]
    pattern: '/api/v1/inbox'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/inbox_validator').publicInboxValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/inbox_validator').publicInboxValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/public/inboxes_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/public/inboxes_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
