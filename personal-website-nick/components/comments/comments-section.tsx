import { CommentsClient } from './comments-client'

type CommentsSectionProps = {
  postPath: string
}

export function CommentsSection({ postPath }: CommentsSectionProps) {
  return <CommentsClient postPath={postPath} />
}
