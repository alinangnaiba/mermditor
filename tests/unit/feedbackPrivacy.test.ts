import { describe, it, expect, beforeEach, vi } from 'vitest'
import { formatPublicIssueBody } from '../../server/utils/github'

const { sendMock } = vi.hoisted(() => ({
  sendMock: vi.fn(),
}))

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendMock }
  },
}))

describe('formatPublicIssueBody', () => {
  it('never includes the user email, even when one was provided', () => {
    const email = 'private.user@example.com'
    const body = formatPublicIssueBody('Bug Report', 'Something broke', true, 'fb-123')

    expect(body).not.toContain(email)
    expect(body).not.toContain('@example.com')
    expect(body).toContain('Provided privately')
    expect(body).toContain('<!-- feedbackId: fb-123 -->')
  })

  it('omits the contact line entirely when no email was provided', () => {
    const body = formatPublicIssueBody('Feature Request', 'Add dark mode', false, 'fb-456')

    expect(body).not.toContain('Provided privately')
    expect(body).toContain('Add dark mode')
  })

  it('includes uploaded attachment URLs and upload failures', () => {
    const body = formatPublicIssueBody('Bug Report', 'Screenshot attached', false, 'fb-457', [
      {
        filename: 'screenshot.png',
        url: 'https://public.blob.vercel-storage.com/feedback/fb-457/screenshot.png',
        contentType: 'image/png',
        size: 1234,
      },
    ], [
      {
        filename: 'notes.txt',
        error: 'Upload failed before feedback submission',
      },
    ])

    expect(body).toContain('## Attachments')
    expect(body).toContain('[screenshot.png](https://public.blob.vercel-storage.com/feedback/fb-457/screenshot.png)')
    expect(body).toContain('## Attachment Upload Failures')
    expect(body).toContain('notes.txt')
    expect(body).toContain('Upload failed before feedback submission')
  })
})

describe('sendFeedbackNotification', () => {
  beforeEach(() => {
    sendMock.mockReset()
    sendMock.mockResolvedValue({ data: { id: 'email-1' }, error: null })
    process.env.RESEND_API_KEY = 're_test'
    process.env.FEEDBACK_EMAIL_TO = 'maintainer@example.com'
    process.env.FEEDBACK_EMAIL_FROM = 'feedback@example.com'
  })

  it('includes the user email and issue URL in the private notification', async () => {
    const { sendFeedbackNotification } = await import('../../server/utils/email')

    await sendFeedbackNotification({
      type: 'Bug Report',
      title: 'Crash on save',
      description: 'It crashes',
      email: 'reporter@example.com',
      issueUrl: 'https://github.com/o/r/issues/42',
      issueNumber: 42,
      feedbackId: 'fb-789',
      submittedAt: new Date().toISOString(),
    })

    expect(sendMock).toHaveBeenCalledTimes(1)
    const payload = sendMock.mock.calls[0][0]
    expect(payload.replyTo).toBe('reporter@example.com')
    expect(payload.html).toContain('reporter@example.com')
    expect(payload.html).toContain('https://github.com/o/r/issues/42')
    expect(payload.to).toBe('maintainer@example.com')
  })

  it('includes attachment URLs and failed upload attempts in the private notification', async () => {
    const { sendFeedbackNotification } = await import('../../server/utils/email')

    await sendFeedbackNotification({
      type: 'Bug Report',
      title: 'Render glitch',
      description: 'The preview is wrong',
      issueUrl: 'https://github.com/o/r/issues/43',
      issueNumber: 43,
      feedbackId: 'fb-790',
      submittedAt: new Date().toISOString(),
      attachments: [
        {
          filename: 'preview.png',
          url: 'https://public.blob.vercel-storage.com/feedback/fb-790/preview.png',
          contentType: 'image/png',
          size: 2048,
        },
      ],
      attachmentUploadFailures: [
        {
          filename: 'console.log',
          error: 'Network error',
        },
      ],
    })

    expect(sendMock).toHaveBeenCalledTimes(1)
    const payload = sendMock.mock.calls[0][0]
    expect(payload.html).toContain('preview.png')
    expect(payload.html).toContain('https://public.blob.vercel-storage.com/feedback/fb-790/preview.png')
    expect(payload.html).toContain('console.log')
    expect(payload.html).toContain('Network error')
  })
})
