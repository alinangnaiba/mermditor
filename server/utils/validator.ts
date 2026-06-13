import {
  ALLOWED_FEEDBACK_ATTACHMENT_TYPES,
  MAX_FEEDBACK_ATTACHMENT_BYTES,
  MAX_FEEDBACK_ATTACHMENTS,
} from './feedbackAttachments'

export const validateFeedback = (body: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  // Required fields
  if (!body.title || typeof body.title !== 'string') {
    errors.push('Title is required and must be a string')
  }
  if (!body.description || typeof body.description !== 'string') {
    errors.push('Description is required and must be a string')
  }
  if (!body.type || typeof body.type !== 'string') {
    errors.push('Type is required and must be a string')
  }
  
  // Length limits
  if (body.title && body.title.length > 200) {
    errors.push('Title must be 200 characters or less')
  }
  if (body.description && body.description.length > 5000) {
    errors.push('Description must be 5000 characters or less')
  }
  
  // Type validation
  const validTypes = ['Bug Report', 'Feature Request', 'Improvement', 'Question', 'Other']
  if (body.type && !validTypes.includes(body.type)) {
    errors.push('Invalid feedback type')
  }
  
  // Email validation (if provided)
  if (body.email && body.email.length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      errors.push('Invalid email format')
    }
    if (body.email.length > 254) {
      errors.push('Email must be 254 characters or less')
    }
  }

  if (body.attachments !== undefined) {
    if (!Array.isArray(body.attachments)) {
      errors.push('Attachments must be an array')
    } else {
      if (body.attachments.length > MAX_FEEDBACK_ATTACHMENTS) {
        errors.push('Attachments must include 10 files or fewer')
      }

      for (const attachment of body.attachments) {
        if (!attachment || typeof attachment !== 'object') {
          errors.push('Each attachment must include valid metadata')
          continue
        }

        if (typeof attachment.filename !== 'string' || !attachment.filename.trim()) {
          errors.push('Each attachment must include a filename')
        }
        if (typeof attachment.url !== 'string' || !isHttpUrl(attachment.url)) {
          errors.push('Each attachment must include a valid URL')
        }
        if (
          typeof attachment.contentType !== 'string' ||
          !ALLOWED_FEEDBACK_ATTACHMENT_TYPES.has(attachment.contentType)
        ) {
          errors.push('Each attachment must use an allowed file type')
        }
        if (
          typeof attachment.size !== 'number' ||
          !Number.isFinite(attachment.size) ||
          attachment.size <= 0
        ) {
          errors.push('Each attachment must include a valid size')
        } else if (attachment.size > MAX_FEEDBACK_ATTACHMENT_BYTES) {
          errors.push('Each attachment must be 10 MB or less')
        }
      }
    }
  }

  if (body.attachmentUploadFailures !== undefined) {
    if (!Array.isArray(body.attachmentUploadFailures)) {
      errors.push('Attachment upload failures must be an array')
    } else if (body.attachmentUploadFailures.length > MAX_FEEDBACK_ATTACHMENTS) {
      errors.push('Attachment upload failures must include 10 files or fewer')
    } else {
      for (const failure of body.attachmentUploadFailures) {
        if (
          !failure ||
          typeof failure !== 'object' ||
          typeof failure.filename !== 'string' ||
          !failure.filename.trim() ||
          typeof failure.error !== 'string' ||
          !failure.error.trim()
        ) {
          errors.push('Each attachment upload failure must include a filename and error')
        }
      }
    }
  }
  
  return { valid: errors.length === 0, errors }
}

const isHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

// Sanitize function
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove HTML brackets
    .trim()
    .slice(0, 5000) // Hard limit
}

export const validateGitHubToken = (token: string): boolean => {
  // GitHub tokens start with specific prefixes
  const validPrefixes = ['ghp_', 'github_pat_']
  return validPrefixes.some(prefix => token.startsWith(prefix)) && 
         token.length >= 40
}
