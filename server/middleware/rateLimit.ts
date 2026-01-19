import { defineEventHandler } from 'h3'

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export default defineEventHandler((event) => {
  const xForwardedFor = event.node.req.headers['x-forwarded-for']
  const ip = typeof xForwardedFor === 'string' 
    ? xForwardedFor.split(',')[0]?.trim() || 'unknown'
    : Array.isArray(xForwardedFor) 
    ? xForwardedFor[0]?.trim() || 'unknown'
    : (event.node.req.socket.remoteAddress || 'unknown')
  
  const now = Date.now()
  const limit = 10 // requests
  const window = 60000 // 1 minute
  
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + window })
  } else {
    record.count++
    if (record.count > limit) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Too many requests. Please try again later.',
      })
    }
  }
})
