import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '../../../../lib/comments/auth'
import { softDeleteComment } from '../../../../lib/comments/db'

export const runtime = 'nodejs'

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { id } = await context.params

  try {
    await softDeleteComment(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to delete comment.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
