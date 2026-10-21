import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer, type Server } from 'node:http'
import { register } from 'node:module'
import { createApp, createRouter, toNodeListener } from 'h3'

// This is a test-only Node loader. No application dependency is added.
register(new URL('./helpers/resolve-typescript.mjs', import.meta.url), import.meta.url)
const { default: contactHandler } = await import('../server/api/contact.post.ts')

const smtpKeys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_TO', 'CONTACT_FROM']
const originalEnv = new Map(smtpKeys.map((key) => [key, process.env[key]]))
let server: Server
let base = ''

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  projectType: 'Web application',
  budget: 'To discuss',
  message: 'I would like to discuss a thoughtful new application.',
  website: '',
}

before(async () => {
  // Credentials must never be used by an automated test.
  for (const key of smtpKeys) delete process.env[key]
  const app = createApp()
  const router = createRouter().post('/api/contact', contactHandler)
  app.use(router)
  server = createServer(toNodeListener(app))
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  const address = server.address()
  assert.ok(address && typeof address === 'object')
  base = `http://127.0.0.1:${address.port}`
})

after(async () => {
  if (server) {
    server.closeAllConnections()
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
  for (const [key, value] of originalEnv) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
})

function post(body: unknown, headers: Record<string, string> = {}) {
  return fetch(`${base}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
}

test('unconfigured direct delivery returns 503 without claiming a send', async () => {
  const response = await post(valid, { Origin: base })
  assert.equal(response.status, 503)
  const payload = await response.json()
  assert.notEqual(payload.sent, true)
  assert.match(payload.statusMessage, /not connected yet/i)
  assert.equal(response.headers.get('cache-control'), 'no-store')
})

test('invalid visitor email returns 400', async () => {
  const response = await post({ ...valid, email: 'invalid-email' })
  assert.equal(response.status, 400)
  const payload = await response.json()
  assert.match(payload.statusMessage, /valid email/i)
})

test('a different Origin is rejected with 403', async () => {
  const response = await post(valid, { Origin: 'https://other.example' })
  assert.equal(response.status, 403)
})

test('a text/plain request is rejected with 415', async () => {
  const response = await post(valid, { 'Content-Type': 'text/plain' })
  assert.equal(response.status, 415)
})

test('honeypot submissions are discarded with a neutral result and no SMTP', async () => {
  const response = await post({ ...valid, website: 'https://spam.example' })
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { sent: true })
})
