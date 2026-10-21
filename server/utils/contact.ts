/** Contact validation is shared by the route and its isolated tests. */
export interface ContactPayload {
  name: string
  email: string
  projectType: string
  budget: string
  message: string
  website: string
}

export type ContactValidation =
  | { ok: true; value: ContactPayload }
  | { ok: false; error: string }

const shortFieldControls = /[\u0000-\u001f\u007f]/
const messageControls = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/

export function validateContact(body: unknown): ContactValidation {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Please complete the contact form.' }
  }

  const input = body as Record<string, unknown>
  const limits = { name: 100, email: 254, projectType: 80, budget: 80, message: 5000, website: 512 }
  const values: ContactPayload = { name: '', email: '', projectType: '', budget: '', message: '', website: '' }

  for (const key of Object.keys(limits) as (keyof ContactPayload)[]) {
    const maximum = limits[key]
    const raw = input[key]
    if (raw !== undefined && typeof raw !== 'string') {
      return { ok: false, error: 'Please use text values in the contact form.' }
    }
    // Check before trimming as well: whitespace must not bypass size limits.
    if (typeof raw === 'string' && raw.length > maximum) {
      return { ok: false, error: `The ${key === 'projectType' ? 'project type' : key} field is too long.` }
    }
    if (typeof raw === 'string' && key !== 'message' && shortFieldControls.test(raw)) {
      return { ok: false, error: 'A contact field contains unsupported characters.' }
    }
    values[key] = typeof raw === 'string' ? raw.trim() : ''
  }

  if (values.name.length < 2) return { ok: false, error: 'Please enter your name (at least 2 characters).' }
  if (!emailPattern.test(values.email)) return { ok: false, error: 'Please enter a valid email address.' }
  if (values.message.length < 20) return { ok: false, error: 'Please add a little more detail (at least 20 characters).' }
  if (messageControls.test(values.message)) return { ok: false, error: 'The message contains unsupported characters.' }

  return {
    ok: true,
    value: {
      name: values.name,
      email: values.email,
      projectType: values.projectType || 'Not specified',
      budget: values.budget || 'Not specified',
      message: values.message,
      website: values.website,
    },
  }
}

/** Plain text only: visitor-supplied markup is never rendered as HTML. */
export function contactMessageText(contact: ContactPayload): string {
  return [
    'New portfolio inquiry',
    '',
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `Project type: ${contact.projectType}`,
    `Budget: ${contact.budget}`,
    '',
    'Message:',
    contact.message,
  ].join('\n')
}
