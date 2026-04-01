'use client'

import { startTransition, useEffect, useState } from 'react'
import type { PublicComment } from '../../lib/comments/types'

type CommentsClientProps = {
  postPath: string
}

const EMPTY_FORM = {
  name: '',
  email: '',
  body: '',
}

function formatTimestamp(timestamp: string) {
  return new Date(timestamp).toLocaleString()
}

export function CommentsClient({ postPath }: CommentsClientProps) {
  const [comments, setComments] = useState<PublicComment[]>([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function loadComments() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/comments?postPath=${encodeURIComponent(postPath)}`,
        {
          cache: 'no-store',
        }
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load comments.')
      }

      setComments(data.comments)
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : 'Failed to load comments.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadComments()
  }, [postPath])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postPath,
          name: form.name,
          email: form.email,
          body: form.body,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post comment.')
      }

      setForm(EMPTY_FORM)
      setSuccessMessage('Comment posted.')
      startTransition(() => {
        setComments(currentComments => [...currentComments, data.comment])
      })
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : 'Failed to post comment.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="comments-shell not-prose" aria-labelledby="comments-title">
      <div className="comments-header">
        <h2 id="comments-title">Comments</h2>
      </div>

      <form className="comments-form" onSubmit={handleSubmit}>
        <div className="comments-form-grid">
          <label className="comments-field">
            <span>Name</span>
            <input
              type="text"
              value={form.name}
              onChange={event =>
                setForm(currentForm => ({ ...currentForm, name: event.target.value }))
              }
              maxLength={80}
              required
            />
          </label>
          <label className="comments-field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={event =>
                setForm(currentForm => ({ ...currentForm, email: event.target.value }))
              }
              maxLength={254}
              required
            />
          </label>
        </div>
        <label className="comments-field">
          <span>Comment</span>
          <textarea
            value={form.body}
            onChange={event =>
              setForm(currentForm => ({ ...currentForm, body: event.target.value }))
            }
            rows={6}
            maxLength={4000}
            required
          />
        </label>
        <div className="comments-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post comment'}
          </button>
          {successMessage ? <p className="comments-success">{successMessage}</p> : null}
        </div>
      </form>

      {error ? <p className="comments-error">{error}</p> : null}

      <div className="comments-list">
        {loading ? <p>Loading comments...</p> : null}
        {!loading && comments.length === 0 ? (
          <p>No comments yet. Start the conversation.</p>
        ) : null}
        {comments.map(comment => (
          <article key={comment.id} className="comment-card">
            <header className="comment-meta">
              <div>
                <strong>{comment.authorName}</strong>
                {comment.isAuthor ? (
                  <span className="comment-badge">Author</span>
                ) : null}
              </div>
              <time dateTime={comment.createdAt}>{formatTimestamp(comment.createdAt)}</time>
            </header>
            <p className="comment-body">{comment.body}</p>
            {comment.replies.length > 0 ? (
              <div className="comment-replies">
                {comment.replies.map(reply => (
                  <article key={reply.id} className="comment-card comment-reply">
                    <header className="comment-meta">
                      <div>
                        <strong>{reply.authorName}</strong>
                        {reply.isAuthor ? (
                          <span className="comment-badge">Author</span>
                        ) : null}
                      </div>
                      <time dateTime={reply.createdAt}>
                        {formatTimestamp(reply.createdAt)}
                      </time>
                    </header>
                    <p className="comment-body">{reply.body}</p>
                  </article>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
