import { describe, expect, it } from 'vitest'
import { appendFeedbackAttachmentDetails } from '../../server/utils/feedbackAttachments'

describe('appendFeedbackAttachmentDetails', () => {
  it('adds uploaded attachment URLs and upload failures to the feedback description', () => {
    const description = appendFeedbackAttachmentDetails(
      'The preview is missing an image',
      [
        {
          filename: 'screenshot.png',
          url: 'https://example.public.blob.vercel-storage.com/feedback/fb/screenshot.png',
          contentType: 'image/png',
          size: 1024,
        },
      ],
      [
        {
          filename: 'notes.txt',
          error: 'Upload failed',
        },
      ]
    )

    expect(description).toContain('The preview is missing an image')
    expect(description).toContain('## Attachments')
    expect(description).toContain('screenshot.png: https://example.public.blob.vercel-storage.com/feedback/fb/screenshot.png')
    expect(description).toContain('## Attachment Upload Failures')
    expect(description).toContain('notes.txt: Upload failed')
  })
})
