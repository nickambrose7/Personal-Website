import { getCommentsEnv } from './env'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const POST_PATH_SEGMENT_REGEX = /^[A-Za-z0-9_-]+$/

function normalizeWhitespace(value: string) {
  return value.replace(/\r\n/g, '\n').trim()
}

export function normalizePostPath(postPath: string) {
  const trimmed = postPath.trim()

  if (!trimmed.startsWith('/posts/')) {
    throw new Error('Comments can only be attached to blog posts.')
  }

  const segments = trimmed.split('/').filter(Boolean)

  if (segments.length < 2 || segments[0] !== 'posts') {
    throw new Error('Invalid post path.')
  }

  for (const segment of segments) {
    if (!POST_PATH_SEGMENT_REGEX.test(segment)) {
      throw new Error('Invalid post path.')
    }
  }

  return `/${segments.join('/')}`
}

export function validatePublicCommentInput(input: {
  postPath: string
  name: string
  email: string
  body: string
}) {
  const env = getCommentsEnv()
  const postPath = normalizePostPath(input.postPath)
  const name = normalizeWhitespace(input.name)
  const email = normalizeWhitespace(input.email).toLowerCase()
  const body = normalizeWhitespace(input.body)

  if (!name) {
    throw new Error('Name is required.')
  }

  if (name.length > env.maxNameLength) {
    throw new Error(`Name must be ${env.maxNameLength} characters or fewer.`)
  }

  if (!email) {
    throw new Error('Email is required.')
  }

  if (email.length > env.maxEmailLength || !EMAIL_REGEX.test(email)) {
    throw new Error('A valid email address is required.')
  }

  if (!body) {
    throw new Error('Comment body is required.')
  }

  if (body.length > env.maxBodyLength) {
    throw new Error(`Comment must be ${env.maxBodyLength} characters or fewer.`)
  }

  return { postPath, name, email, body }
}

export function validateReplyBody(body: string) {
  const env = getCommentsEnv()
  const normalizedBody = normalizeWhitespace(body)

  if (!normalizedBody) {
    throw new Error('Reply body is required.')
  }

  if (normalizedBody.length > env.maxBodyLength) {
    throw new Error(`Reply must be ${env.maxBodyLength} characters or fewer.`)
  }

  return normalizedBody
}
