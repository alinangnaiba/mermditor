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
  const validTypes = ['Bug Report', 'Feature Request', 'Improvement', 'Question']
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
  
  return { valid: errors.length === 0, errors }
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
