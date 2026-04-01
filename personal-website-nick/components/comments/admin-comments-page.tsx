'use client'

import { startTransition, useEffect, useState } from 'react'
import type { AdminComment } from '../../lib/comments/types'

function formatTimestamp(timestamp: string) {
  return new Date(timestamp).toLocaleString()
}

export function AdminCommentsPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [comments, setComments] = useState<AdminComment[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingCommentId, setPendingCommentId] = useState<string | null>(null)
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})

  async function loadSession() {
    const response = await fetch('/api/admin/session', { cache: 'no-store' })
    const data = await response.json()
    setAuthenticated(Boolean(data.authenticated))
    return Boolean(data.authenticated)
  }

  async function loadComments() {
    setLoading(true)

    try {
      const response = await fetch('/api/admin/comments', { cache: 'no-store' })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load comments.')
      }

      setComments(data.comments)
      setError(null)
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : 'Failed to load comments.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function initialize() {
      try {
        const isAuthenticated = await loadSession()

        if (isAuthenticated) {
          await loadComments()
          return
        }

        setLoading(false)
      } catch (sessionError) {
        const message =
          sessionError instanceof Error
            ? sessionError.message
            : 'Failed to initialize admin page.'
        setError(message)
        setLoading(false)
      }
    }

    void initialize()
  }, [])

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed.')
      }

      setPassword('')
      setAuthenticated(true)
      await loadComments()
    } catch (loginError) {
      const message =
        loginError instanceof Error ? loginError.message : 'Login failed.'
      setError(message)
      setLoading(false)
    }
  }

  async function handleLogout() {
    setLoading(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    setAuthenticated(false)
    setComments([])
    setLoading(false)
  }

  async function handleDelete(commentId: string) {
    setPendingCommentId(commentId)
    setError(null)

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete comment.')
      }

      startTransition(() => {
        setComments(currentComments =>
          currentComments.filter(comment => comment.id !== commentId)
        )
      })
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : 'Failed to delete comment.'
      setError(message)
    } finally {
      setPendingCommentId(null)
    }
  }

  async function handleReply(commentId: string) {
    const body = replyDrafts[commentId] || ''
    setPendingCommentId(commentId)
    setError(null)

    try {
      const response = await fetch(`/api/comments/${commentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create reply.')
      }

      startTransition(() => {
        setComments(currentComments =>
          currentComments.map(comment =>
            comment.id === commentId
              ? { ...comment, replies: [...comment.replies, data.reply] }
              : comment
          )
        )
        setReplyDrafts(currentDrafts => ({ ...currentDrafts, [commentId]: '' }))
      })
    } catch (replyError) {
      const message =
        replyError instanceof Error ? replyError.message : 'Failed to create reply.'
      setError(message)
    } finally {
      setPendingCommentId(null)
    }
  }

  if (!authenticated) {
    return (
      <div className="admin-comments-page">
        <h1>Comments Admin</h1>
        <p>Owner login for reviewing, deleting, and replying to comments.</p>
        <form className="admin-login-form" onSubmit={handleLogin}>
          <label className="comments-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        {error ? <p className="comments-error">{error}</p> : null}
      </div>
    )
  }

  return (
    <div className="admin-comments-page">
      <div className="admin-comments-header">
        <div>
          <h1>Comments Admin</h1>
          <p>Review published comments, remove bad submissions, and post author replies.</p>
        </div>
        <button type="button" onClick={handleLogout}>
          Sign out
        </button>
      </div>

      {error ? <p className="comments-error">{error}</p> : null}
      {loading ? <p>Loading comments...</p> : null}

      {!loading && comments.length === 0 ? <p>No comments yet.</p> : null}

      <div className="admin-comments-list">
        {comments.map(comment => (
          <article key={comment.id} className="admin-comment-card">
            <header className="comment-meta">
              <div>
                <strong>{comment.authorName}</strong>
                <span className="admin-comment-email">{comment.authorEmail}</span>
              </div>
              <time dateTime={comment.createdAt}>{formatTimestamp(comment.createdAt)}</time>
            </header>
            <p className="admin-comment-post">{comment.postPath}</p>
            <p className="comment-body">{comment.body}</p>
            <div className="admin-comment-actions">
              <button
                type="button"
                onClick={() => handleDelete(comment.id)}
                disabled={pendingCommentId === comment.id}
              >
                {pendingCommentId === comment.id ? 'Working...' : 'Delete'}
              </button>
            </div>

            {comment.replies.length > 0 ? (
              <div className="comment-replies">
                {comment.replies.map(reply => (
                  <article key={reply.id} className="comment-card comment-reply">
                    <header className="comment-meta">
                      <div>
                        <strong>{reply.authorName}</strong>
                        <span className="comment-badge">Author</span>
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

            <label className="comments-field">
              <span>Reply as author</span>
              <textarea
                rows={4}
                value={replyDrafts[comment.id] || ''}
                onChange={event =>
                  setReplyDrafts(currentDrafts => ({
                    ...currentDrafts,
                    [comment.id]: event.target.value,
                  }))
                }
              />
            </label>
            <button
              type="button"
              onClick={() => handleReply(comment.id)}
              disabled={pendingCommentId === comment.id}
            >
              {pendingCommentId === comment.id ? 'Posting...' : 'Post reply'}
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
