'use client'

import { useState } from 'react'
import { LeadCaptureModal } from './lead-capture-modal'

type LeadCaptureTriggerProps = {
  label: string
  sourceLabel: string
  className?: string
}

export function LeadCaptureTrigger({
  label,
  sourceLabel,
  className,
}: LeadCaptureTriggerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className={className ? `lead-trigger ${className}` : 'lead-trigger'}
        onClick={() => setOpen(true)}
      >
        {label}
      </button>
      <LeadCaptureModal
        open={open}
        sourceLabel={sourceLabel}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
