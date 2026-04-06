import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Project from '../../components/Project'

describe('Project', () => {
  it('renders image-based projects and hides the CTA when no project URL exists', () => {
    render(
      <Project
        title="Portfolio"
        description="A personal site."
        mediaUrl="/images/logo.png"
        projectUrl={undefined}
      />
    )

    expect(screen.getByRole('img', { name: 'Portfolio' })).toHaveAttribute(
      'src',
      '/images/logo.png'
    )
    expect(
      screen.queryByRole('link', { name: 'Learn More' })
    ).not.toBeInTheDocument()
  })

  it('renders video-based projects and exposes the external project link', () => {
    render(
      <Project
        title="Demo Reel"
        description="A video preview."
        mediaUrl="/images/demo.mp4"
        projectUrl="https://example.com/demo"
      />
    )

    expect(screen.getByTitle('Demo Reel').tagName).toBe('VIDEO')
    expect(screen.getByRole('link', { name: 'Learn More' })).toHaveAttribute(
      'href',
      'https://example.com/demo'
    )
  })
})
