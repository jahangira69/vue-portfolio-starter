import {
  createError,
  defineEventHandler,
  getHeader,
  getRequestIP,
  getRequestURL,
  readBody,
  setResponseHeader,
} from 'h3'
import nodemailer from 'nodemailer'
import { contactMessageText, validateContact } from '../utils/contact'

// Best-effort process-local throttling. Use shared storage for multiple instances.
const buckets = new Map<string, { count: number; resetAt: number }>()
const windowMs = 15 * 60 * 1000
const maximumAttempts = 5
const maximumBuckets = 10000

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')

  const origin = getHeader(event, 'origin')
  if (origin) {
    let allowed = false
    try {
      // Forwarded host is never trusted. Forwarded scheme supports HTTPS proxies.
      allowed = new URL(origin).origin === getRequestURL(event, {
        xForwardedHost: false,
        xForwardedProto: true,
      }).origin
    } catch {
      allowed = false
    }
    if (!allowed) throw createError({ statusCode: 403, statusMessage: 'Please use the contact form on this website.' })
  }

  const contentType = getHeader(event, 'content-type') || ''
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
    throw createError({ statusCode: 415, statusMessage: 'Please submit the form as JSON.' })
  }
  const contentLength = Number(getHeader(event, 'content-length') || 0)
  if (contentLength > 16000) {
    throw createError({ statusCode: 413, statusMessage: 'Your message is too large.' })
  }

  const now = Date.now()
  // Direct socket address only. Forwarded IP headers are not trusted by default.
  const address = getRequestIP(event, { xForwardedFor: false }) || 'unknown'
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
  const current = buckets.get(address) || { count: 0, resetAt: now + windowMs }
  if (current.count >= maximumAttempts) {
    setResponseHeader(event, 'Retry-After', Math.max(1, Math.ceil((current.resetAt - now) / 1000)))
    throw createError({ statusCode: 429, statusMessage: 'Please wait a few minutes before trying again.' })
  }
  current.count += 1
  if (!buckets.has(address) && buckets.size >= maximumBuckets) {
    const oldest = buckets.keys().next().value
    if (oldest !== undefined) buckets.delete(oldest)
  }
  buckets.set(address, current)

  let body: unknown
  try {
    body = await readBody(event)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'We could not read your message. Please try again.' })
  }
  if (JSON.stringify(body ?? '').length > 16000) {
    throw createError({ statusCode: 413, statusMessage: 'Your message is too large.' })
  }
  const validation = validateContact(body)
  if (!validation.ok) throw createError({ statusCode: 400, statusMessage: validation.error })
  const contact = validation.value

  // Honeypot submissions are discarded without giving spambots useful feedback.
  if (contact.website) return { sent: true }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } = process.env
  const port = Number(SMTP_PORT || 587)
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO || !CONTACT_FROM || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw createError({ statusCode: 503, statusMessage: 'The contact form is not connected yet. Please use the email option instead.' })
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  })

  try {
    const info = await transport.sendMail({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: { name: contact.name, address: contact.email },
      subject: `Portfolio inquiry: ${contact.projectType}`,
      text: contactMessageText(contact),
    })
    if (!info.accepted?.length || info.rejected?.length) throw new Error('SMTP recipient rejected')
    return { sent: true }
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Your message could not be sent. Please try again or use the email option.' })
  } finally {
    transport.close()
  }
})
