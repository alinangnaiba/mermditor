import { Client } from '@upstash/qstash'
import { logError } from '../../utils/logging'
import type { FeedbackAttachment, FeedbackAttachmentUploadFailure } from './feedbackAttachments'

export interface FeedbackJob {
  feedbackId: string
  type: string
  title: string
  description: string
  email?: string
  submittedAt: string
  attachments?: FeedbackAttachment[]
  attachmentUploadFailures?: FeedbackAttachmentUploadFailure[]
}

const WORKER_PATH = '/api/jobs/process-feedback'

/**
 * Publish a feedback job to QStash. QStash will durably deliver it to the
 * worker endpoint with retries, decoupling the slow issue+email work from the
 * user-facing request.
 */
export const enqueueFeedbackJob = async (job: FeedbackJob): Promise<void> => {
  const QSTASH_TOKEN = process.env.QSTASH_TOKEN
  const APP_ORIGIN = process.env.APP_ORIGIN

  if (!QSTASH_TOKEN || !APP_ORIGIN) {
    logError('queue.missingConfig', new Error('Missing QStash configuration'), {
      feedbackId: job.feedbackId,
    })
    throw createError({
      statusCode: 500,
      statusMessage: 'Service temporarily unavailable',
    })
  }

  const client = new Client({ token: QSTASH_TOKEN })

  try {
    await client.publishJSON({
      url: `${APP_ORIGIN}${WORKER_PATH}`,
      body: job,
      // De-duplicate retries / double submissions for the same feedback item.
      deduplicationId: job.feedbackId,
    })
  } catch (error) {
    logError('queue.publishFailed', error, { feedbackId: job.feedbackId })
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to queue feedback. Please try again later.',
    })
  }
}
