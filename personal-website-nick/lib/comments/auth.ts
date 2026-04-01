import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import type { NextRequest } from 'next/server'
import { getCommentsEnv } from './env'

const ADMIN_COOKIE_NAME = 'comments_admin_session'

type SessionPayload = {
  exp: number
  role: 'admin'
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function sign(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

function safeEqualString(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

function verifyScryptPassword(password: string, encodedHash: string) {
  const [salt, expectedHash] = encodedHash.split(':')

  if (!salt || !expectedHash) {
    return false
  }

  const actualHash = scryptSync(password, salt, 64).toString('hex')
  return safeEqualString(actualHash, expectedHash)
}

export function hashAdminPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyAdminPassword(password: string) {
  const env = getCommentsEnv()

  if (env.adminPassword) {
    return safeEqualString(password, env.adminPassword)
  }

  if (env.adminPasswordHash) {
    return verifyScryptPassword(password, env.adminPasswordHash)
  }

  return false
}

export function createAdminSessionCookieValue() {
  const env = getCommentsEnv()
  const payload: SessionPayload = {
    role: 'admin',
    exp: Date.now() + env.adminSessionDays * 24 * 60 * 60 * 1000,
  }
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signature = sign(encodedPayload, env.cookieSecret)
  return `${encodedPayload}.${signature}`
}

function parseSessionCookie(value: string | undefined) {
  if (!value) {
    return null
  }

  const [encodedPayload, signature] = value.split('.')

  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = sign(encodedPayload, getCommentsEnv().cookieSecret)

  if (!safeEqualString(signature, expectedSignature)) {
    return null
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload

    if (payload.role !== 'admin' || payload.exp < Date.now()) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export function getAdminSession(request: NextRequest) {
  return parseSessionCookie(request.cookies.get(ADMIN_COOKIE_NAME)?.value)
}

export function isAdminRequest(request: NextRequest) {
  return getAdminSession(request) !== null
}

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME
}
