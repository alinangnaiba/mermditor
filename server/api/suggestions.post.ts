import { randomUUID } from 'crypto'
import { validateFeedback, sanitizeInput } from '../utils/validator'
import rateLimit from '../middleware/rateLimit'
import { enqueueFeedbackJob } from '../utils/queue'
import { logError } from '../../utils/logging'

type SuggestionsEvent = Parameters<typeof readBody>[0]

export default defineEventHandler(async (event: SuggestionsEvent) => {
  await rateLimit(event)
  try {
    const body = await readBody(event)

    // Validate input
    const { valid, errors } = validateFeedback(body)
    if (!valid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed: ' + errors.join(', '),
      })
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(body.title)
    const sanitizedDescription = sanitizeInput(body.description)
    const sanitizedType = sanitizeInput(body.type)
    const sanitizedEmail = body.email ? sanitizeInput(body.email) : undefined

    const feedbackId = randomUUID()

    // Hand the slow work (GitHub issue + private email) off to the queue so the
    // user gets an instant response. The user's email is carried only inside the
    // job payload and is never exposed publicly.
    await enqueueFeedbackJob({
      feedbackId,
      type: sanitizedType,
      title: sanitizedTitle,
      description: sanitizedDescription,
      email: sanitizedEmail,
      submittedAt: new Date().toISOString(),
    })

    setResponseStatus(event, 202)

    return {
      success: true,
      feedbackId,
      message: 'Feedback received. Thanks for helping improve merMDitor!',
    }
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error
    }

    logError('suggestions.internal', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'An unexpected error occurred. Please try again later.',
    })
  }
})
