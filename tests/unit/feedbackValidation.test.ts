import { describe, expect, it } from 'vitest'
import { validateFeedback } from '../../server/utils/validator'

const validFeedback = {
  type: 'Bug Report',
  title: 'Preview broke',
  description: 'The preview stopped updating',
}

describe('validateFeedback attachment metadata', () => {
  it('accepts uploaded attachment URLs and failed upload records', () => {
    const { valid, errors } = validateFeedback({
      ...validFeedback,
      attachments: [
        {
          filename: 'screenshot.png',
          url: 'https://public.blob.vercel-storage.com/feedback/fb-1/screenshot.png',
          contentType: 'image/png',
          size: 10 * 1024 * 1024,
        },
      ],
      attachmentUploadFailures: [
        {
          filename: 'notes.txt',
          error: 'Upload failed before feedback submission',
        },
      ],
    })

    expect(valid).toBe(true)
    expect(errors).toEqual([])
  })

  it('rejects more than 10 attachment URL records', () => {
    const { valid, errors } = validateFeedback({
      ...validFeedback,
      attachments: Array.from({ length: 11 }, (_, index) => ({
        filename: `screenshot-${index}.png`,
        url: `https://public.blob.vercel-storage.com/feedback/fb-1/screenshot-${index}.png`,
        contentType: 'image/png',
        size: 100,
      })),
    })

    expect(valid).toBe(false)
    expect(errors).toContain('Attachments must include 10 files or fewer')
  })

  it('rejects attachment metadata above 10 MB per file', () => {
    const { valid, errors } = validateFeedback({
      ...validFeedback,
      attachments: [
        {
          filename: 'large.png',
          url: 'https://public.blob.vercel-storage.com/feedback/fb-1/large.png',
          contentType: 'image/png',
          size: 10 * 1024 * 1024 + 1,
        },
      ],
    })

    expect(valid).toBe(false)
    expect(errors).toContain('Each attachment must be 10 MB or less')
  })
})
