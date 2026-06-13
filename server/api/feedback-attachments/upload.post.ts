import { handleUpload } from '@vercel/blob/client'
import {
  ALLOWED_FEEDBACK_ATTACHMENT_TYPES,
  MAX_FEEDBACK_ATTACHMENT_BYTES,
} from '../../utils/feedbackAttachments'

type BlobUploadEvent = Parameters<typeof readBody>[0]

const isValidFeedbackPathname = (pathname: string): boolean =>
  /^feedback\/[a-zA-Z0-9_-]{8,80}\/[a-zA-Z0-9._ -]{1,160}$/.test(pathname)

export default defineEventHandler(async (event: BlobUploadEvent) => {
  const body = await readBody(event)

  try {
    return await handleUpload({
      body,
      request: event.node.req,
      onBeforeGenerateToken: async (pathname, _clientPayload, multipart) => {
        if (multipart || !isValidFeedbackPathname(pathname)) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Invalid attachment upload request',
          })
        }

        return {
          allowedContentTypes: [...ALLOWED_FEEDBACK_ATTACHMENT_TYPES],
          maximumSizeInBytes: MAX_FEEDBACK_ATTACHMENT_BYTES,
          addRandomSuffix: true,
          validUntil: Date.now() + 5 * 60 * 1000,
        }
      },
    })
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to prepare attachment upload',
    })
  }
})
