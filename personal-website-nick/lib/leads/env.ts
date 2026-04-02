const DEFAULT_MAX_NAME_LENGTH = 80
const DEFAULT_MAX_EMAIL_LENGTH = 254
const DEFAULT_MAX_COMPANY_LENGTH = 120
const DEFAULT_MAX_MESSAGE_LENGTH = 4000
const DEFAULT_LEADS_PER_IP_WINDOW = 5
const DEFAULT_RATE_LIMIT_WINDOW_SECONDS = 3600
const DEFAULT_DUPLICATE_COOLDOWN_SECONDS = 86400

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

export function getLeadsEnv() {
  return {
    databaseUrl: readRequiredEnv('DATABASE_URL'),
    hashSecret:
      process.env.LEADS_HASH_SECRET?.trim() ||
      process.env.COMMENTS_COOKIE_SECRET?.trim() ||
      (() => {
        throw new Error(
          'Missing hashing secret: set LEADS_HASH_SECRET or COMMENTS_COOKIE_SECRET'
        )
      })(),
    mailerSendApiKey: readRequiredEnv('MAILERSEND_API_KEY'),
    notificationToEmail: readRequiredEnv('LEADS_NOTIFICATION_TO_EMAIL'),
    notificationFromEmail: readRequiredEnv('LEADS_NOTIFICATION_FROM_EMAIL'),
    notificationFromName: readRequiredEnv('LEADS_NOTIFICATION_FROM_NAME'),
    maxNameLength: readIntegerEnv('LEADS_MAX_NAME_LENGTH', DEFAULT_MAX_NAME_LENGTH),
    maxEmailLength: readIntegerEnv(
      'LEADS_MAX_EMAIL_LENGTH',
      DEFAULT_MAX_EMAIL_LENGTH
    ),
    maxCompanyLength: readIntegerEnv(
      'LEADS_MAX_COMPANY_LENGTH',
      DEFAULT_MAX_COMPANY_LENGTH
    ),
    maxMessageLength: readIntegerEnv(
      'LEADS_MAX_MESSAGE_LENGTH',
      DEFAULT_MAX_MESSAGE_LENGTH
    ),
    leadsPerIpWindow: readIntegerEnv(
      'LEADS_RATE_LIMIT_MAX_PER_IP',
      DEFAULT_LEADS_PER_IP_WINDOW
    ),
    rateLimitWindowSeconds: readIntegerEnv(
      'LEADS_RATE_LIMIT_WINDOW_SECONDS',
      DEFAULT_RATE_LIMIT_WINDOW_SECONDS
    ),
    duplicateCooldownSeconds: readIntegerEnv(
      'LEADS_DUPLICATE_COOLDOWN_SECONDS',
      DEFAULT_DUPLICATE_COOLDOWN_SECONDS
    ),
  }
}
