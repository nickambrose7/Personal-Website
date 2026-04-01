import type { NextRequest } from 'next/server'

export function getRequestIpAddress(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}
