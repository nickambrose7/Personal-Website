const DEFAULT_MAX_NAME_LENGTH = 80
const DEFAULT_MAX_EMAIL_LENGTH = 254
const DEFAULT_MAX_BODY_LENGTH = 4000
const DEFAULT_COMMENTS_PER_IP_WINDOW = 5
const DEFAULT_COMMENTS_PER_POST_WINDOW = 3
const DEFAULT_RATE_LIMIT_WINDOW_SECONDS = 900
const DEFAULT_DUPLICATE_COOLDOWN_SECONDS = 3600
const DEFAULT_ADMIN_SESSION_DAYS = 7

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function readIntegerEnv(name: string, fallback: number) {
  const rawValue = process.env[name]

  if (!rawValue) {
    return fallback
  }

  const parsed = Number.parseInt(rawValue, 10)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Environment variable ${name} must be a positive integer`)
  }

  return parsed
}

export function getCommentsEnv() {
  const databaseUrl = readRequiredEnv('DATABASE_URL')
  const cookieSecret = readRequiredEnv('COMMENTS_COOKIE_SECRET')
  const adminPassword =
    process.env.COMMENTS_ADMIN_PASSWORD?.trim() || undefined
  const adminPasswordHash =
    process.env.COMMENTS_ADMIN_PASSWORD_HASH?.trim() || undefined

  if (!adminPassword && !adminPasswordHash) {
    throw new Error(
      'Missing admin credentials: set COMMENTS_ADMIN_PASSWORD or COMMENTS_ADMIN_PASSWORD_HASH'
    )
  }

  return {
    databaseUrl,
    cookieSecret,
    adminPassword,
    adminPasswordHash,
    maxNameLength: readIntegerEnv(
      'COMMENTS_MAX_NAME_LENGTH',
      DEFAULT_MAX_NAME_LENGTH
    ),
    maxEmailLength: readIntegerEnv(
      'COMMENTS_MAX_EMAIL_LENGTH',
      DEFAULT_MAX_EMAIL_LENGTH
    ),
    maxBodyLength: readIntegerEnv(
      'COMMENTS_MAX_BODY_LENGTH',
      DEFAULT_MAX_BODY_LENGTH
    ),
    commentsPerIpWindow: readIntegerEnv(
      'COMMENTS_RATE_LIMIT_MAX_PER_IP',
      DEFAULT_COMMENTS_PER_IP_WINDOW
    ),
    commentsPerPostWindow: readIntegerEnv(
      'COMMENTS_RATE_LIMIT_MAX_PER_POST',
      DEFAULT_COMMENTS_PER_POST_WINDOW
    ),
    rateLimitWindowSeconds: readIntegerEnv(
      'COMMENTS_RATE_LIMIT_WINDOW_SECONDS',
      DEFAULT_RATE_LIMIT_WINDOW_SECONDS
    ),
    duplicateCooldownSeconds: readIntegerEnv(
      'COMMENTS_DUPLICATE_COOLDOWN_SECONDS',
      DEFAULT_DUPLICATE_COOLDOWN_SECONDS
    ),
    adminSessionDays: readIntegerEnv(
      'COMMENTS_ADMIN_SESSION_DAYS',
      DEFAULT_ADMIN_SESSION_DAYS
    ),
  }
}
