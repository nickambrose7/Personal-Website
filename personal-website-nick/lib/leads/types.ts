export type LeadNotificationStatus = 'pending' | 'sent' | 'failed'

export type LeadSubmissionRecord = {
  id: string
  email: string
  name: string
  company: string | null
  message: string
  sourceLabel: string | null
  sourcePath: string | null
  ipHash: string | null
  notificationStatus: LeadNotificationStatus
  notificationError: string | null
  notifiedAt: string | null
  createdAt: string
  updatedAt: string
}
