import type { HttpContext } from '@adonisjs/core/http'
import transmit from '@adonisjs/transmit/services/main'
import ContactInbox from '#models/contact_inbox'
import { publicInboxValidator } from '#validators/inbox_validator'
import { QueueService } from '#services/queue_service'
import SanitizerService from '#services/sanitizer_service'

export default class InboxesController {
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(publicInboxValidator)

    // Honeypot anti-spam check: if bot fills honeypot field, silently ignore
    if (payload.honeypot) {
      return response.ok({
        success: true,
        message: 'Your message has been sent successfully.',
      })
    }

    const cleanName = SanitizerService.stripTags(payload.name)
    const cleanSubject = payload.subject ? SanitizerService.stripTags(payload.subject) : null
    const cleanMessage = SanitizerService.stripTags(payload.message)
    const cleanBudget = payload.budgetRange ? SanitizerService.stripTags(payload.budgetRange) : null
    const cleanCategory = payload.projectCategory
      ? SanitizerService.stripTags(payload.projectCategory)
      : null

    const inbox = await ContactInbox.create({
      name: cleanName,
      email: payload.email,
      subject: cleanSubject,
      message: cleanMessage,
      budgetRange: cleanBudget,
      projectCategory: cleanCategory,
      ipAddress: request.ip(),
      userAgent: request.header('user-agent') || null,
      status: 'unread',
    })

    // Broadcast realtime notification to CMS
    try {
      transmit.broadcast('inbox/new', {
        id: inbox.id,
        name: inbox.name,
        email: inbox.email,
        subject: inbox.subject,
        message: inbox.message,
        budgetRange: inbox.budgetRange,
        projectCategory: inbox.projectCategory,
        status: inbox.status,
        createdAt: inbox.createdAt.toISO(),
      })
    } catch {
      // Non-blocking if broadcaster fails
    }

    // Dispatch Telegram Bot Notification to BullMQ Background Queue
    try {
      QueueService.dispatchTelegramNotification({
        id: inbox.id,
        name: inbox.name,
        email: inbox.email,
        subject: inbox.subject,
        message: inbox.message,
        budgetRange: inbox.budgetRange,
        projectCategory: inbox.projectCategory,
        ipAddress: inbox.ipAddress,
        userAgent: inbox.userAgent,
        createdAt: inbox.createdAt.toISO()!,
      })
    } catch (queueErr) {
      console.warn('[InboxesController] Queue dispatch non-blocking warning:', queueErr)
    }

    return response.created({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you shortly!',
      data: {
        id: inbox.id,
        createdAt: inbox.createdAt.toISO(),
      },
    })
  }
}
