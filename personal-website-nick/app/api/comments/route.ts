import { NextRequest, NextResponse } from 'next/server'
import {
  enforceRateLimit,
  hashIpAddress,
  insertComment,
  listPublishedComments,
} from '../../../lib/comments/db'
import { getRequestIpAddress } from '../../../lib/comments/http'
import {
  normalizePostPath,
  validatePublicCommentInput,
} from '../../../lib/comments/validation'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const postPath = request.nextUrl.searchParams.get('postPath')

  if (!postPath) {
    return NextResponse.json(
      { error: 'Missing postPath query parameter.' },
      { status: 400 }
    )
  }

  try {
    const comments = await listPublishedComments(normalizePostPath(postPath))
    return NextResponse.json({ comments })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load comments.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = validatePublicCommentInput({
      postPath: body.postPath,
      name: body.name,
      email: body.email,
      body: body.body,
    })
    const ipHash = hashIpAddress(getRequestIpAddress(request))

    await enforceRateLimit({
      postPath: validated.postPath,
      ipHash,
      normalizedBody: validated.body,
    })

    const comment = await insertComment({
      postPath: validated.postPath,
      authorName: validated.name,
      authorEmail: validated.email,
      body: validated.body,
      isAuthor: false,
      ipHash,
    })

    return NextResponse.json(
      {
        comment: {
          id: comment.id,
          body: comment.body,
          createdAt: comment.createdAt,
          authorName: comment.authorName,
          isAuthor: comment.isAuthor,
          replies: [],
        },
      },
      { status: 201 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to create comment.'
    const status =
      message.includes('Too many') || message.includes('Duplicate') ? 429 : 400

    return NextResponse.json({ error: message }, { status })
  }
}
