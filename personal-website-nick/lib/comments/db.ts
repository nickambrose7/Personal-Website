import { createHash } from 'crypto'
import { neon } from '@neondatabase/serverless'
import { getCommentsEnv } from './env'
import type { AdminComment, CommentRecord, PublicComment } from './types'

type DbCommentRow = {
  id: string
  post_path: string
  parent_comment_id: string | null
  author_name: string
  author_email: string | null
  body: string
  is_author: boolean
  status: 'pending' | 'published' | 'deleted'
  created_at: Date | string
  updated_at: Date | string
}

let client: ReturnType<typeof neon> | null = null

function getClient() {
  if (!client) {
    client = neon(getCommentsEnv().databaseUrl)
  }

  return client
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}

function toCommentRecord(row: DbCommentRow): CommentRecord {
  return {
    id: row.id,
    postPath: row.post_path,
    parentCommentId: row.parent_comment_id,
    authorName: row.author_name,
    authorEmail: row.author_email,
    body: row.body,
    isAuthor: row.is_author,
    status: row.status,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  }
}

function buildPublicThreads(rows: DbCommentRow[]): PublicComment[] {
  const records = rows.map(toCommentRecord)
  const topLevelComments = records.filter(
    comment => comment.parentCommentId === null && comment.status === 'published'
  )
  const repliesByParent = new Map<string, CommentRecord[]>()

  for (const reply of records) {
    if (!reply.parentCommentId || reply.status !== 'published') {
      continue
    }

    const replies = repliesByParent.get(reply.parentCommentId) ?? []
    replies.push(reply)
    repliesByParent.set(reply.parentCommentId, replies)
  }

  return topLevelComments.map(comment => ({
    id: comment.id,
    body: comment.body,
    createdAt: comment.createdAt,
    authorName: comment.authorName,
    isAuthor: comment.isAuthor,
    replies: (repliesByParent.get(comment.id) ?? []).map(reply => ({
      id: reply.id,
      body: reply.body,
      createdAt: reply.createdAt,
      authorName: reply.authorName,
      isAuthor: reply.isAuthor,
    })),
  }))
}

function buildAdminThreads(rows: DbCommentRow[]): AdminComment[] {
  const records = rows.map(toCommentRecord)
  const topLevelComments = records.filter(comment => comment.parentCommentId === null)
  const repliesByParent = new Map<string, CommentRecord[]>()

  for (const reply of records) {
    if (!reply.parentCommentId) {
      continue
    }

    const replies = repliesByParent.get(reply.parentCommentId) ?? []
    replies.push(reply)
    repliesByParent.set(reply.parentCommentId, replies)
  }

  return topLevelComments.map(comment => ({
    ...comment,
    replies: repliesByParent.get(comment.id) ?? [],
  }))
}

export function hashIpAddress(ipAddress: string) {
  return createHash('sha256')
    .update(`${getCommentsEnv().cookieSecret}:${ipAddress}`)
    .digest('hex')
}

export async function listPublishedComments(postPath: string) {
  const sql = getClient()
  const rows = (await sql`
    select
      id,
      post_path,
      parent_comment_id,
      author_name,
      author_email,
      body,
      is_author,
      status,
      created_at,
      updated_at
    from comments
    where post_path = ${postPath}
      and status = 'published'
    order by created_at asc
  `) as DbCommentRow[]

  return buildPublicThreads(rows)
}

export async function listAdminComments() {
  const sql = getClient()
  const rows = (await sql`
    select
      id,
      post_path,
      parent_comment_id,
      author_name,
      author_email,
      body,
      is_author,
      status,
      created_at,
      updated_at
    from comments
    where status <> 'deleted'
    order by created_at desc
  `) as DbCommentRow[]

  return buildAdminThreads(rows)
}

export async function findCommentById(id: string) {
  const sql = getClient()
  const rows = (await sql`
    select
      id,
      post_path,
      parent_comment_id,
      author_name,
      author_email,
      body,
      is_author,
      status,
      created_at,
      updated_at
    from comments
    where id = ${id}
    limit 1
  `) as DbCommentRow[]

  return rows[0] ? toCommentRecord(rows[0]) : null
}

export async function insertComment(input: {
  postPath: string
  parentCommentId?: string | null
  authorName: string
  authorEmail?: string | null
  body: string
  isAuthor: boolean
  ipHash?: string | null
}) {
  const sql = getClient()
  const rows = (await sql`
    insert into comments (
      post_path,
      parent_comment_id,
      author_name,
      author_email,
      body,
      is_author,
      status,
      ip_hash
    )
    values (
      ${input.postPath},
      ${input.parentCommentId ?? null},
      ${input.authorName},
      ${input.authorEmail ?? null},
      ${input.body},
      ${input.isAuthor},
      'published',
      ${input.ipHash ?? null}
    )
    returning
      id,
      post_path,
      parent_comment_id,
      author_name,
      author_email,
      body,
      is_author,
      status,
      created_at,
      updated_at
  `) as DbCommentRow[]

  return toCommentRecord(rows[0])
}

export async function enforceRateLimit(input: {
  postPath: string
  ipHash: string
  normalizedBody: string
}) {
  const env = getCommentsEnv()
  const sql = getClient()
  const ipCount = (await sql`
    select count(*)::text as count
    from comments
    where ip_hash = ${input.ipHash}
      and is_author = false
      and status <> 'deleted'
      and created_at >= now() - (${env.rateLimitWindowSeconds} * interval '1 second')
  `) as { count: string }[]
  const postCount = (await sql`
    select count(*)::text as count
    from comments
    where ip_hash = ${input.ipHash}
      and post_path = ${input.postPath}
      and is_author = false
      and status <> 'deleted'
      and created_at >= now() - (${env.rateLimitWindowSeconds} * interval '1 second')
  `) as { count: string }[]
  const duplicateCount = (await sql`
    select count(*)::text as count
    from comments
    where ip_hash = ${input.ipHash}
      and post_path = ${input.postPath}
      and lower(body) = lower(${input.normalizedBody})
      and is_author = false
      and status <> 'deleted'
      and created_at >= now() - (${env.duplicateCooldownSeconds} * interval '1 second')
  `) as { count: string }[]

  if (Number.parseInt(ipCount[0]?.count ?? '0', 10) >= env.commentsPerIpWindow) {
    throw new Error('Too many comments from this IP address. Please try again later.')
  }

  if (
    Number.parseInt(postCount[0]?.count ?? '0', 10) >= env.commentsPerPostWindow
  ) {
    throw new Error('Too many comments on this post from this IP address. Please try again later.')
  }

  if (Number.parseInt(duplicateCount[0]?.count ?? '0', 10) > 0) {
    throw new Error('Duplicate comment detected. Please wait before posting the same comment again.')
  }
}

export async function softDeleteComment(id: string) {
  const sql = getClient()
  await sql`
    update comments
    set
      status = 'deleted',
      deleted_at = now(),
      updated_at = now()
    where id = ${id}
       or parent_comment_id = ${id}
  `
}
