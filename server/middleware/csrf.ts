import { defineEventHandler, getCookie, setCookie } from 'h3'
import { randomBytes } from 'crypto'

/**
 * CSRF Protection Middleware
 * 
 * Generates CSRF tokens for GET requests and validates them for state-changing requests.
 * While the application has no user authentication, this provides defense-in-depth protection.
 */
export default defineEventHandler((event) => {
  // Skip CSRF for non-API routes
  if (!event.path?.startsWith('/api/')) {
    return
  }

  // Generate token for GET requests
  if (event.method === 'GET') {
    const token = randomBytes(32).toString('hex')
    setCookie(event, 'csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    })
    return
  }
  
  // Validate token for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(event.method || '')) {
    const cookieToken = getCookie(event, 'csrf-token')
    const headerToken = event.node.req.headers['x-csrf-token'] as string | undefined
    
    if (!cookieToken || cookieToken !== headerToken) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Invalid CSRF token. Please refresh the page and try again.'
      })
    }
  }
})
