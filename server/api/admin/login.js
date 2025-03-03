import { createHash } from 'crypto'
import { H3Event } from 'h3'

let loginAttempts = new Map()

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const clientIp = getRequestIP(event)
  
  const attempts = loginAttempts.get(clientIp) || { count: 0, timestamp: Date.now() }
  
  if (attempts.count >= 5 && (Date.now() - attempts.timestamp) < 15 * 60 * 1000) {
    throw createError({
      statusCode: 429,
      message: 'Too many login attempts. Please try again later.'
    })
  }

  if (body.username === config.adminUsername && 
      body.password === config.adminPassword) {
    loginAttempts.delete(clientIp)
    
    const session = createHash('sha256')
      .update(Date.now().toString() + clientIp)
      .digest('hex')
    
    // Remove httpOnly flag so client-side code can read it
    setCookie(event, 'admin-session', session, {
      httpOnly: false, // changed from true to false for client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24
    })
    
    return { success: true }
  }
  
  attempts.count++
  attempts.timestamp = Date.now()
  loginAttempts.set(clientIp, attempts)

  throw createError({
    statusCode: 401,
    message: 'Invalid credentials'
  })
})
