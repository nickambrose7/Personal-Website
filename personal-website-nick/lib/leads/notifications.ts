import { getLeadsEnv } from './env'
import type { LeadSubmissionRecord } from './types'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatTextBody(submission: LeadSubmissionRecord) {
  return [
    'New work inquiry received.',
    '',
    `Submitted: ${new Date(submission.createdAt).toLocaleString()}`,
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Company: ${submission.company || 'Not provided'}`,
    `Source label: ${submission.sourceLabel || 'Not provided'}`,
    `Source path: ${submission.sourcePath || 'Not provided'}`,
    '',
    'Message:',
    submission.message,
  ].join('\n')
}

function formatHtmlBody(submission: LeadSubmissionRecord) {
  const rows = [
    ['Submitted', new Date(submission.createdAt).toLocaleString()],
    ['Name', submission.name],
    ['Email', submission.email],
    ['Company', submission.company || 'Not provided'],
    ['Source label', submission.sourceLabel || 'Not provided'],
    ['Source path', submission.sourcePath || 'Not provided'],
  ]

  const metadataRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;">${escapeHtml(
          label
        )}</td><td style="padding:8px 12px;">${escapeHtml(value)}</td></tr>`
    )
    .join('')

  return `
    <div style="font-family:Inter,Arial,sans-serif;color:#111827;">
      <h2 style="margin-bottom:16px;">New work inquiry received</h2>
      <table style="border-collapse:collapse;margin-bottom:20px;">
        <tbody>${metadataRows}</tbody>
      </table>
      <h3 style="margin-bottom:8px;">Message</h3>
      <p style="white-space:pre-wrap;line-height:1.6;">${escapeHtml(
        submission.message
      )}</p>
    </div>
  `
}

export async function sendLeadNotification(submission: LeadSubmissionRecord) {
  const env = getLeadsEnv()
  const response = await fetch('https://api.mailersend.com/v1/email', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.mailerSendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: {
        email: env.notificationFromEmail,
        name: env.notificationFromName,
      },
      to: [
        {
          email: env.notificationToEmail,
        },
      ],
      subject: `New work inquiry from ${submission.name}`,
      text: formatTextBody(submission),
      html: formatHtmlBody(submission),
      reply_to: {
        email: submission.email,
        name: submission.name,
      },
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `MailerSend request failed with status ${response.status}: ${body || 'Unknown error'}`
    )
  }
}
