import { Receiver } from '@upstash/qstash'
import { createGitHubIssue, formatPublicIssueBody } from '../../utils/github'
import { sendFeedbackNotification } from '../../utils/email'
import type { FeedbackJob } from '../../utils/queue'
import { logError } from '../../../utils/logging'

type ProcessFeedbackEvent = Parameters<typeof readRawBody>[0]

/**
 * QStash worker: creates the public GitHub issue (without the user's email),
 * then sends the private notification email containing the contact address and
 * the new issue link.
 *
 * This endpoint is authenticated via the QStash request signature rather than
 * the app's CSRF middleware, since QStash (not a browser) calls it.
 */
export default defineEventHandler(async (event: ProcessFeedbackEvent) => {
  const currentSigningKey = process.env.QSTASH_CURRENT_SIGNING_KEY
  const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY

  if (!currentSigningKey || !nextSigningKey) {
    logError('processFeedback.missingSigningKeys', new Error('Missing QStash signing keys'))
    throw createError({ statusCode: 500, statusMessage: 'Worker not configured' })
  }

  const signature = getHeader(event, 'upstash-signature')
  const rawBody = await readRawBody(event)

  if (!signature || !rawBody) {
    throw createError({ statusCode: 401, statusMessage: 'Missing signature' })
  }

  const receiver = new Receiver({ currentSigningKey, nextSigningKey })

  const isValid = await receiver
    .verify({ signature, body: rawBody })
    .catch(() => false)

  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid signature' })
  }

  const job = JSON.parse(rawBody) as FeedbackJob

  const issueTitle = `[${job.type.toUpperCase()}] ${job.title}`
  const issueBody = formatPublicIssueBody(
    job.type,
    job.description,
    Boolean(job.email),
    job.feedbackId
  )
  const issueLabels = [job.type.toLowerCase(), 'user-feedback']

  const issue = await createGitHubIssue({
    title: issueTitle,
    body: issueBody,
    labels: issueLabels,
  })

  await sendFeedbackNotification({
    type: job.type,
    title: job.title,
    description: job.description,
    email: job.email,
    issueUrl: issue.htmlUrl,
    issueNumber: issue.number,
    feedbackId: job.feedbackId,
    submittedAt: job.submittedAt,
  })

  return { success: true, issueNumber: issue.number }
})
