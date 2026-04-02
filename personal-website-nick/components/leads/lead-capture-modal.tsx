'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type LeadCaptureModalProps = {
  open: boolean
  sourceLabel: string
  onClose: () => void
}

const EMPTY_FORM = {
  email: '',
  name: '',
  company: '',
  message: '',
  website: '',
}

export function LeadCaptureModal({
  open,
  sourceLabel,
  onClose,
}: LeadCaptureModalProps) {
  const pathname = usePathname()
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, open])

  useEffect(() => {
    if (!open) {
      setError(null)
      setSuccessMessage(null)
    }
  }, [open])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          company: form.company,
          message: form.message,
          website: form.website,
          sourceLabel,
          sourcePath: pathname,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit your inquiry.')
      }

      setForm(EMPTY_FORM)
      setSuccessMessage("Thanks. I'll review your note and follow up if it's a fit.")
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : 'Failed to submit your inquiry.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) {
    return null
  }

  return (
    <div
      className="lead-modal-backdrop"
      role="presentation"
      onClick={event => {
        if (event.target === event.currentTarget && !submitting) {
          onClose()
        }
      }}
    >
      <section
        className="lead-modal not-prose"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-modal-title"
      >
        <div className="lead-modal-header">
          <div>
            <p className="lead-modal-eyebrow">Work with me</p>
            <h2 id="lead-modal-title">Tell me about your project</h2>
            <p className="lead-modal-copy">
              Share a few details and I&apos;ll take a look.
            </p>
          </div>
          <button
            type="button"
            className="lead-modal-close"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close work inquiry form"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <form className="lead-form" onSubmit={handleSubmit}>
          <div className="lead-form-grid">
            <label className="comments-field">
              <span>Name</span>
              <input
                type="text"
                value={form.name}
                onChange={event =>
                  setForm(currentForm => ({ ...currentForm, name: event.target.value }))
                }
                maxLength={80}
                placeholder="Your name"
                required
              />
            </label>
            <label className="comments-field">
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={event =>
                  setForm(currentForm => ({
                    ...currentForm,
                    email: event.target.value,
                  }))
                }
                maxLength={254}
                placeholder="you@example.com"
                required
              />
            </label>
          </div>

          <label className="comments-field">
            <span>Company</span>
            <input
              type="text"
              value={form.company}
              onChange={event =>
                setForm(currentForm => ({ ...currentForm, company: event.target.value }))
              }
              maxLength={120}
              placeholder="Company or team"
            />
          </label>

          <label className="comments-field">
            <span>Message</span>
            <textarea
              value={form.message}
              onChange={event =>
                setForm(currentForm => ({ ...currentForm, message: event.target.value }))
              }
              rows={7}
              maxLength={4000}
              placeholder="What are you looking to build or improve?"
              required
            />
          </label>

          <label className="lead-honeypot" aria-hidden="true" tabIndex={-1}>
            <span>Website</span>
            <input
              type="text"
              autoComplete="off"
              value={form.website}
              onChange={event =>
                setForm(currentForm => ({ ...currentForm, website: event.target.value }))
              }
              tabIndex={-1}
            />
          </label>

          <div className="lead-form-actions">
            <button
              type="submit"
              disabled={submitting}
              className="lead-form-submit"
            >
              {submitting ? 'Sending...' : 'Send inquiry'}
            </button>
          </div>

          {successMessage ? (
            <p className="lead-form-feedback lead-form-feedback-success">
              {successMessage}
            </p>
          ) : null}
          {error ? (
            <p className="lead-form-feedback lead-form-feedback-error">{error}</p>
          ) : null}
        </form>
      </section>
    </div>
  )
}
