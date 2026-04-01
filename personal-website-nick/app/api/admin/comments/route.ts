import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '../../../../lib/comments/auth'
import { listAdminComments } from '../../../../lib/comments/db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const comments = await listAdminComments()
    return NextResponse.json({ comments })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load admin comments.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
