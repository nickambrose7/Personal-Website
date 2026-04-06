import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { validateLeadInput } from '../../lib/leads/validation'

const originalEnv = { ...process.env }

describe('lead validation', () => {
  beforeEach(() => {
    process.env.DATABASE_URL = 'postgres://example'
    process.env.COMMENTS_COOKIE_SECRET = 'secret'
    process.env.MAILERSEND_API_KEY = 'mailer-key'
    process.env.LEADS_NOTIFICATION_TO_EMAIL = 'to@example.com'
    process.env.LEADS_NOTIFICATION_FROM_EMAIL = 'from@example.com'
    process.env.LEADS_NOTIFICATION_FROM_NAME = 'Nick Ambrose'
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('normalizes valid lead submissions', () => {
    expect(
      validateLeadInput({
        email: '  HELLO@EXAMPLE.COM  ',
        name: '  Taylor  ',
        company: '  Acme  ',
        message: '\n Need help with a project. \n',
        sourceLabel: 'navbar-cta',
        sourcePath: ' /posts/meaning_of_life ',
        website: '',
      })
    ).toEqual({
      email: 'hello@example.com',
      name: 'Taylor',
      company: 'Acme',
      message: 'Need help with a project.',
      sourceLabel: 'navbar-cta',
      sourcePath: '/posts/meaning_of_life',
    })
  })

  it('rejects honeypot submissions', () => {
    expect(() =>
      validateLeadInput({
        email: 'hello@example.com',
        name: 'Taylor',
        message: 'Need help with a project.',
        website: 'https://spam.example',
      })
    ).toThrow('Spam submission rejected.')
  })
})
