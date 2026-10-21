import assert from 'node:assert/strict'
import test from 'node:test'
import { validateContact, contactMessageText } from '../server/utils/contact.ts'

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  projectType: 'Web application',
  budget: '$5,000–$10,000',
  message: 'I would like to discuss a new application for our team.',
  website: '',
}

test('valid inquiries preserve content; optional fields get safe defaults', () => {
  const result = validateContact({ ...valid, name: ' Ada Lovelace ', budget: undefined, projectType: undefined })
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.equal(result.value.name, 'Ada Lovelace')
  assert.equal(result.value.budget, 'Not specified')
  assert.equal(result.value.projectType, 'Not specified')
})

test('rejects header injection and malformed email', () => {
  for (const overrides of [
    { email: 'ada@example.com\r\nBcc: victim@example.com' },
    { name: 'Ada\nInjected' },
    { projectType: 'A\r\nSubject: B' },
    { email: 'invalid-email' },
    { email: 'a@b@c.com' },
  ]) assert.equal(validateContact({ ...valid, ...overrides }).ok, false)
})

test('rejects oversized, non-string, missing and control-character inputs', () => {
  for (const body of [
    null, [], {},
    { ...valid, name: 'x'.repeat(101) },
    { ...valid, message: 'x'.repeat(5001) },
    { ...valid, message: 'short' },
    { ...valid, budget: ['unexpected'] },
    { ...valid, message: 'An otherwise long message\u0000 with invalid characters' },
  ]) assert.equal(validateContact(body).ok, false)
})

test('message markup is only plain text; newlines are preserved', () => {
  const result = validateContact({ ...valid, message: 'A long message with <script>alert(1)</script>\nSecond line.' })
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.match(contactMessageText(result.value), /<script>alert\(1\)<\/script>\nSecond line\./)
})

test('honeypot is retained for the route to discard', () => {
  const result = validateContact({ ...valid, website: 'https://spam.example' })
  assert.equal(result.ok, true)
  if (result.ok) assert.equal(result.value.website, 'https://spam.example')
})
