import env from '#start/env'

export class RevalidateService {
  /**
   * Send a webhook request to Next.js web application to purge ISR cache immediately.
   */
  static async revalidate(tagOrPath?: string): Promise<{ success: boolean; message?: string }> {
    const webUrl =
      process.env.WEB_URL ||
      env.get('WEB_URL') ||
      'http://localhost:3000'

    const secret =
      process.env.REVALIDATE_SECRET ||
      env.get('REVALIDATE_SECRET') ||
      'growthcoder-revalidate-secret'

    try {
      const url = new URL('/api/revalidate', webUrl)
      if (tagOrPath) {
        if (tagOrPath.startsWith('/')) {
          url.searchParams.set('path', tagOrPath)
        } else {
          url.searchParams.set('tag', tagOrPath)
        }
      }
      url.searchParams.set('secret', secret)

      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-revalidate-secret': secret,
        },
        signal: AbortSignal.timeout(4000),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.warn(`[RevalidateService] Failed with status ${res.status}:`, errorText)
        return { success: false, message: `Status ${res.status}: ${errorText}` }
      }

      console.info(`[RevalidateService] Successfully revalidated: ${tagOrPath || 'all'}`)
      return { success: true }
    } catch (error: any) {
      console.warn(
        `[RevalidateService] Failed to call revalidation webhook (${webUrl}):`,
        error?.message || error
      )
      return { success: false, message: error?.message || String(error) }
    }
  }
}
