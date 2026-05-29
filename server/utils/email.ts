import { Resend } from 'resend'
import { logError } from '../../utils/logging'

export interface FeedbackEmailInput {
  type: string
  title: string
  description: string
  email?: string
  issueUrl: string
  issueNumber: number
  feedbackId: string
  submittedAt: string
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const buildHtml = (input: FeedbackEmailInput): string => {
  const contact = input.email
    ? `<p><strong>Reply to:</strong> ${escapeHtml(input.email)}</p>`
    : '<p><strong>Reply to:</strong> not provided</p>'

  return `
    <h2>New merMDitor feedback</h2>
    <p><strong>Type:</strong> ${escapeHtml(input.type)}</p>
    <p><strong>Title:</strong> ${escapeHtml(input.title)}</p>
    <p><strong>Description:</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(input.description)}</pre>
    ${contact}
    <p><strong>GitHub issue:</strong> <a href="${escapeHtml(input.issueUrl)}">#${input.issueNumber}</a></p>
    <p style="color:#666;font-size:12px">Feedback ID: ${escapeHtml(input.feedbackId)} · Submitted: ${escapeHtml(input.submittedAt)}</p>
  `
}

/**
 * Send the private feedback notification email (includes the user's email so
 * the maintainer can follow up). This address must never be placed in the
 * public GitHub issue.
 */
export const sendFeedbackNotification = async (input: FeedbackEmailInput): Promise<void> => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const FEEDBACK_EMAIL_TO = process.env.FEEDBACK_EMAIL_TO
  const FEEDBACK_EMAIL_FROM = process.env.FEEDBACK_EMAIL_FROM

  if (!RESEND_API_KEY || !FEEDBACK_EMAIL_TO || !FEEDBACK_EMAIL_FROM) {
    logError('email.missingConfig', new Error('Missing Resend email configuration'), {
      feedbackId: input.feedbackId,
    })
    throw createError({
      statusCode: 500,
      statusMessage: 'Email service not configured',
    })
  }

  const resend = new Resend(RESEND_API_KEY)

  const { error } = await resend.emails.send({
    from: FEEDBACK_EMAIL_FROM,
    to: FEEDBACK_EMAIL_TO,
    subject: `merMDitor feedback: [${input.type}] ${input.title}`,
    html: buildHtml(input),
    ...(input.email ? { replyTo: input.email } : {}),
  })

  if (error) {
    logError('email.sendFailed', new Error(error.message), {
      feedbackId: input.feedbackId,
      issueNumber: input.issueNumber,
    })
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to send feedback notification email.',
    })
  }
}
