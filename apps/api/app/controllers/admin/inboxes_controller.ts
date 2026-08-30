import type { HttpContext } from '@adonisjs/core/http'
import ContactInbox from '#models/contact_inbox'
import { updateInboxStatusValidator } from '#validators/inbox_validator'
import { ActivityLogService } from '#services/activity_log_service'
import { DateTime } from 'luxon'

export default class InboxesController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 15)
    const status = request.input('status')
    const search = request.input('search')

    const query = ContactInbox.query().orderBy('created_at', 'desc')

    if (status && status !== 'all') {
      query.where('status', status)
    }

    if (search) {
      query.where((q) => {
        q.whereILike('name', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
          .orWhereILike('subject', `%${search}%`)
          .orWhereILike('message', `%${search}%`)
      })
    }

    const inboxes = await query.paginate(page, perPage)

    return response.ok({
      success: true,
      data: inboxes.all(),
      meta: {
        total: inboxes.total,
        page: inboxes.currentPage,
        perPage: inboxes.perPage,
        lastPage: inboxes.lastPage,
      },
    })
  }

  async show({ params, response }: HttpContext) {
    const inbox = await ContactInbox.findOrFail(params.id)

    // Mark as read if currently unread
    if (inbox.status === 'unread') {
      inbox.status = 'read'
      await inbox.save()
    }

    return response.ok({
      success: true,
      data: inbox,
    })
  }

  async updateStatus(ctx: HttpContext) {
    const { params, request, response } = ctx
    const inbox = await ContactInbox.findOrFail(params.id)
    const payload = await request.validateUsing(updateInboxStatusValidator)

    inbox.status = payload.status
    if (payload.replyNotes !== undefined) {
      inbox.replyNotes = payload.replyNotes
    }

    if (payload.status === 'replied' && !inbox.repliedAt) {
      inbox.repliedAt = DateTime.now()
    }

    await inbox.save()

    ActivityLogService.log(ctx, 'update', 'inbox_status', inbox.id, {
      status: inbox.status,
      email: inbox.email,
    })

    return response.ok({
      success: true,
      message: `Inbox status updated to ${inbox.status}`,
      data: inbox,
    })
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx
    const inbox = await ContactInbox.findOrFail(params.id)
    const id = inbox.id
    const email = inbox.email

    await inbox.delete()

    ActivityLogService.log(ctx, 'delete', 'inbox', id, { email })

    return response.ok({
      success: true,
      message: 'Inbox message deleted successfully',
    })
  }
}
