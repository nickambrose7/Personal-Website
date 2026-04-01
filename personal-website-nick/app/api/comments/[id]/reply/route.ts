import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '../../../../../lib/comments/auth'
import { findCommentById, insertComment } from '../../../../../lib/comments/db'
import { validateReplyBody } from '../../../../../lib/comments/validation'

export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { id } = await context.params

  try {
    const parentComment = await findCommentById(id)

    if (!parentComment || parentComment.status === 'deleted') {
      return NextResponse.json({ error: 'Comment not found.' }, { status: 404 })
    }

    if (parentComment.parentCommentId) {
      return NextResponse.json(
        { error: 'Replies can only target top-level comments.' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedBody = validateReplyBody(body.body)

    const reply = await insertComment({
      postPath: parentComment.postPath,
      parentCommentId: parentComment.id,
      authorName: 'Nick Ambrose',
      body: validatedBody,
      isAuthor: true,
    })

    return NextResponse.json(
      {
        reply: {
          id: reply.id,
          body: reply.body,
          createdAt: reply.createdAt,
          authorName: reply.authorName,
          isAuthor: reply.isAuthor,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to create reply.'

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
