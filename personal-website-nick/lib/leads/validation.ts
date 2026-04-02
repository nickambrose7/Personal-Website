import { getLeadsEnv } from './env'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SOURCE_LABEL_REGEX = /^[A-Za-z0-9_-]+$/

function normalizeWhitespace(value: string) {
  return value.replace(/\r\n/g, '\n').trim()
}

function normalizeOptionalText(value: string | null | undefined) {
  const normalizedValue = normalizeWhitespace(value ?? '')
  return normalizedValue || null
}

function normalizeSourcePath(sourcePath: string | null | undefined) {
  const normalizedPath = normalizeWhitespace(sourcePath ?? '')

  if (!normalizedPath) {
    return null
  }

  if (!normalizedPath.startsWith('/')) {
    throw new Error('Invalid source path.')
  }

  return normalizedPath
}

export function validateLeadInput(input: {
  email: string
  name: string
  company?: string | null
  message: string
  sourceLabel?: string | null
  sourcePath?: string | null
  website?: string | null
}) {
  const env = getLeadsEnv()
  const email = normalizeWhitespace(input.email).toLowerCase()
  const name = normalizeWhitespace(input.name)
  const company = normalizeOptionalText(input.company)
  const message = normalizeWhitespace(input.message)
  const sourceLabel = normalizeOptionalText(input.sourceLabel)
  const sourcePath = normalizeSourcePath(input.sourcePath)
  const honeypot = normalizeWhitespace(input.website ?? '')

  if (honeypot) {
    throw new Error('Spam submission rejected.')
  }

  if (!email) {
    throw new Error('Email is required.')
  }

  if (email.length > env.maxEmailLength || !EMAIL_REGEX.test(email)) {
    throw new Error('A valid email address is required.')
  }

  if (!name) {
    throw new Error('Name is required.')
  }

  if (name.length > env.maxNameLength) {
    throw new Error(`Name must be ${env.maxNameLength} characters or fewer.`)
  }

  if (company && company.length > env.maxCompanyLength) {
    throw new Error(`Company must be ${env.maxCompanyLength} characters or fewer.`)
  }

  if (!message) {
    throw new Error('Message is required.')
  }

  if (message.length > env.maxMessageLength) {
    throw new Error(
      `Message must be ${env.maxMessageLength} characters or fewer.`
    )
  }

  if (sourceLabel && !SOURCE_LABEL_REGEX.test(sourceLabel)) {
    throw new Error('Invalid source label.')
  }

  return {
    email,
    name,
    company,
    message,
    sourceLabel,
    sourcePath,
  }
}
