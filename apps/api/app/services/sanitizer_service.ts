import sanitizeHtml from 'sanitize-html'

/**
 * Whitelisted HTML tags and attributes for Rich-Text content (Tiptap / Markdown).
 */
const DEFAULT_ALLOWED_TAGS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'p',
  'a',
  'ul',
  'ol',
  'nl',
  'li',
  'b',
  'i',
  'strong',
  'em',
  'strike',
  'code',
  'hr',
  'br',
  'div',
  'table',
  'thead',
  'caption',
  'tbody',
  'tr',
  'th',
  'td',
  'pre',
  'iframe',
  'img',
  'span',
  'figure',
  'figcaption',
  'mark',
  'kbd',
  'sub',
  'sup',
]

export class SanitizerService {
  /**
   * Sanitizes rich text HTML by removing dangerous tags (<script>, <style>, <embed>, <object>)
   * and malicious attributes (e.g. onerror, onclick, javascript: pseudo-protocols).
   */
  public static cleanHtml(dirty: string | null | undefined): string {
    if (!dirty || typeof dirty !== 'string') return ''

    return sanitizeHtml(dirty, {
      allowedTags: DEFAULT_ALLOWED_TAGS,
      allowedAttributes: {
        'a': ['href', 'name', 'target', 'rel', 'class', 'title'],
        'img': ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'class'],
        'iframe': [
          'src',
          'width',
          'height',
          'frameborder',
          'allowfullscreen',
          'allow',
          'class',
          'title',
        ],
        '*': ['class', 'id', 'data-*'],
      },
      allowedIframeHostnames: [
        'www.youtube.com',
        'youtube.com',
        'player.vimeo.com',
        'gist.github.com',
        'codepen.io',
      ],
      allowedSchemes: ['http', 'https', 'mailto', 'tel'],
      transformTags: {
        a: (tagName, attribs) => {
          if (attribs.href && attribs.href.startsWith('http')) {
            return {
              tagName,
              attribs: {
                ...attribs,
                rel: attribs.rel || 'noopener noreferrer',
              },
            }
          }
          return { tagName, attribs }
        },
      },
    })
  }

  /**
   * Strips all HTML tags entirely, returning safe plain-text.
   * Ideal for user-submitted form data (Contact Inboxes, user inputs).
   */
  public static stripTags(dirty: string | null | undefined): string {
    if (!dirty || typeof dirty !== 'string') return ''

    return sanitizeHtml(dirty, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim()
  }

  /**
   * Cleans text and shortens to an excerpt of specified max length.
   */
  public static cleanExcerpt(dirty: string | null | undefined, maxLength = 250): string {
    const plain = this.stripTags(dirty)
    if (plain.length <= maxLength) return plain
    return plain.slice(0, maxLength).trim() + '...'
  }
}

export default SanitizerService
