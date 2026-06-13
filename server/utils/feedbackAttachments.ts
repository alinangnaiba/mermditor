export interface FeedbackAttachment {
  filename: string
  url: string
  contentType: string
  size: number
}

export interface FeedbackAttachmentUploadFailure {
  filename: string
  error: string
}

export const MAX_FEEDBACK_ATTACHMENTS = 10
export const MAX_FEEDBACK_ATTACHMENT_BYTES = 10 * 1024 * 1024

export const ALLOWED_FEEDBACK_ATTACHMENT_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'text/plain',
  'text/markdown',
  'application/json',
  'text/csv',
])

export const sanitizeAttachmentFilename = (filename: string): string => {
  const safeName = filename
    .replace(/[\\/]/g, '-')
    .replace(/[^a-zA-Z0-9._ -]/g, '')
    .trim()
    .slice(0, 120)

  return safeName || 'attachment'
}
