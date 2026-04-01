export type CommentStatus = 'pending' | 'published' | 'deleted'

export type CommentRecord = {
  id: string
  postPath: string
  parentCommentId: string | null
  authorName: string
  authorEmail: string | null
  body: string
  isAuthor: boolean
  status: CommentStatus
  createdAt: string
  updatedAt: string
}

export type PublicCommentReply = {
  id: string
  body: string
  createdAt: string
  authorName: string
  isAuthor: boolean
}

export type PublicComment = {
  id: string
  body: string
  createdAt: string
  authorName: string
  isAuthor: boolean
  replies: PublicCommentReply[]
}

export type AdminComment = CommentRecord & {
  replies: CommentRecord[]
}
