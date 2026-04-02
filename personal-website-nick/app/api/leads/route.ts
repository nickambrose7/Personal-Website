import { NextRequest, NextResponse } from 'next/server'
import {
  enforceLeadRateLimit,
  hashIpAddress,
  insertLeadSubmission,
  updateLeadNotificationStatus,
} from '../../../lib/leads/db'
import { getRequestIpAddress } from '../../../lib/comments/http'
import { sendLeadNotification } from '../../../lib/leads/notifications'
import { validateLeadInput } from '../../../lib/leads/validation'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = validateLeadInput({
      email: body.email,
      name: body.name,
      company: body.company,
      message: body.message,
      sourceLabel: body.sourceLabel,
      sourcePath: body.sourcePath,
      website: body.website,
    })
    const ipHash = hashIpAddress(getRequestIpAddress(request))

    await enforceLeadRateLimit({
      ipHash,
      email: validated.email,
      normalizedMessage: validated.message,
    })

    const submission = await insertLeadSubmission({
      email: validated.email,
      name: validated.name,
      company: validated.company,
      message: validated.message,
      sourceLabel: validated.sourceLabel,
      sourcePath: validated.sourcePath,
      ipHash,
    })

    try {
      await sendLeadNotification(submission)
      await updateLeadNotificationStatus({
        id: submission.id,
        status: 'sent',
        error: null,
        notifiedAt: new Date().toISOString(),
      })
    } catch (notificationError) {
      const message =
        notificationError instanceof Error
          ? notificationError.message
          : 'Failed to send lead notification.'
      console.error('Lead notification failed', {
        leadId: submission.id,
        error: message,
      })

      await updateLeadNotificationStatus({
        id: submission.id,
        status: 'failed',
        error: message,
        notifiedAt: null,
      })
    }

    return NextResponse.json(
      {
        success: true,
        leadId: submission.id,
      },
      { status: 201 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to submit work inquiry.'
    const status =
      message.includes('Too many') ||
      message.includes('Duplicate') ||
      message.includes('Spam')
        ? 429
        : 400

    return NextResponse.json({ error: message }, { status })
  }
}
