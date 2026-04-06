import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  normalizePostPath,
  validatePublicCommentInput,
  validateReplyBody,
} from '../../lib/comments/validation'

const originalEnv = { ...process.env }

describe('comment validation', () => {
  beforeEach(() => {
    process.env.DATABASE_URL = 'postgres://example'
    process.env.COMMENTS_COOKIE_SECRET = 'secret'
    process.env.COMMENTS_ADMIN_PASSWORD = 'password'
    delete process.env.COMMENTS_ADMIN_PASSWORD_HASH
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('normalizes public comment input', () => {
    expect(
      validatePublicCommentInput({
        postPath: ' /posts/meaning_of_life ',
        name: '  Nick Ambrose  ',
        email: '  NICK@EXAMPLE.COM  ',
        body: '\n  Thanks for reading.  \n',
      })
    ).toEqual({
      postPath: '/posts/meaning_of_life',
      name: 'Nick Ambrose',
      email: 'nick@example.com',
      body: 'Thanks for reading.',
    })
  })

  it('rejects post paths outside the blog post namespace', () => {
    expect(() => normalizePostPath('/resume')).toThrow(
      'Comments can only be attached to blog posts.'
    )
  })

  it('validates reply bodies after trimming whitespace', () => {
    expect(validateReplyBody('\n  Appreciate it.  \n')).toBe('Appreciate it.')
  })
})
