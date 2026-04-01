import { NextRequest, NextResponse } from 'next/server'
import {
  createAdminSessionCookieValue,
  getAdminCookieName,
  verifyAdminPassword,
} from '../../../../lib/comments/auth'
import { getCommentsEnv } from '../../../../lib/comments/env'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const password = typeof body.password === 'string' ? body.password : ''

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid password.' },
        { status: 401 }
      )
    }

    const env = getCommentsEnv()
    const response = NextResponse.json({ ok: true })

    response.cookies.set({
      name: getAdminCookieName(),
      value: createAdminSessionCookieValue(),
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: env.adminSessionDays * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed.'

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
