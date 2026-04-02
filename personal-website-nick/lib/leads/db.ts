import { createHash } from 'crypto'
import { neon } from '@neondatabase/serverless'
import { getLeadsEnv } from './env'
import type { LeadNotificationStatus, LeadSubmissionRecord } from './types'

type DbLeadSubmissionRow = {
  id: string
  email: string
  name: string
  company: string | null
  message: string
  source_label: string | null
  source_path: string | null
  ip_hash: string | null
  notification_status: LeadNotificationStatus
  notification_error: string | null
  notified_at: Date | string | null
  created_at: Date | string
  updated_at: Date | string
}

let client: ReturnType<typeof neon> | null = null

function getClient() {
  if (!client) {
    client = neon(getLeadsEnv().databaseUrl)
  }

  return client
}

function toIsoString(value: Date | string | null) {
  if (!value) {
    return null
  }

  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}

function toLeadSubmissionRecord(row: DbLeadSubmissionRow): LeadSubmissionRecord {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    company: row.company,
    message: row.message,
    sourceLabel: row.source_label,
    sourcePath: row.source_path,
    ipHash: row.ip_hash,
    notificationStatus: row.notification_status,
    notificationError: row.notification_error,
    notifiedAt: toIsoString(row.notified_at),
    createdAt: toIsoString(row.created_at) || new Date().toISOString(),
    updatedAt: toIsoString(row.updated_at) || new Date().toISOString(),
  }
}

export function hashIpAddress(ipAddress: string) {
  return createHash('sha256')
    .update(`${getLeadsEnv().hashSecret}:${ipAddress}`)
    .digest('hex')
}

export async function insertLeadSubmission(input: {
  email: string
  name: string
  company?: string | null
  message: string
  sourceLabel?: string | null
  sourcePath?: string | null
  ipHash?: string | null
}) {
  const sql = getClient()
  const rows = (await sql`
    insert into lead_submissions (
      email,
      name,
      company,
      message,
      source_label,
      source_path,
      ip_hash,
      notification_status
    )
    values (
      ${input.email},
      ${input.name},
      ${input.company ?? null},
      ${input.message},
      ${input.sourceLabel ?? null},
      ${input.sourcePath ?? null},
      ${input.ipHash ?? null},
      'pending'
    )
    returning
      id,
      email,
      name,
      company,
      message,
      source_label,
      source_path,
      ip_hash,
      notification_status,
      notification_error,
      notified_at,
      created_at,
      updated_at
  `) as DbLeadSubmissionRow[]

  return toLeadSubmissionRecord(rows[0])
}

export async function updateLeadNotificationStatus(input: {
  id: string
  status: LeadNotificationStatus
  error?: string | null
  notifiedAt?: string | null
}) {
  const sql = getClient()
  await sql`
    update lead_submissions
    set
      notification_status = ${input.status},
      notification_error = ${input.error ?? null},
      notified_at = ${input.notifiedAt ?? null}
    where id = ${input.id}
  `
}

export async function enforceLeadRateLimit(input: {
  ipHash: string
  email: string
  normalizedMessage: string
}) {
  const env = getLeadsEnv()
  const sql = getClient()
  const ipCount = (await sql`
    select count(*)::text as count
    from lead_submissions
    where ip_hash = ${input.ipHash}
      and created_at >= now() - (${env.rateLimitWindowSeconds} * interval '1 second')
  `) as { count: string }[]
  const duplicateCount = (await sql`
    select count(*)::text as count
    from lead_submissions
    where ip_hash = ${input.ipHash}
      and email = ${input.email}
      and lower(message) = lower(${input.normalizedMessage})
      and created_at >= now() - (${env.duplicateCooldownSeconds} * interval '1 second')
  `) as { count: string }[]

  if (Number.parseInt(ipCount[0]?.count ?? '0', 10) >= env.leadsPerIpWindow) {
    throw new Error('Too many submissions from this IP address. Please try again later.')
  }

  if (Number.parseInt(duplicateCount[0]?.count ?? '0', 10) > 0) {
    throw new Error('Duplicate submission detected. Please wait before trying again.')
  }
}
