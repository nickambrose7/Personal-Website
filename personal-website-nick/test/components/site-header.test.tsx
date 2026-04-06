import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { usePathname } = vi.hoisted(() => ({
  usePathname: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname,
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}))

vi.mock('nextra-theme-blog', () => ({
  ThemeSwitch: () => <button type="button">Toggle theme</button>,
}))

vi.mock('../../components/leads/lead-capture-trigger', () => ({
  LeadCaptureTrigger: ({ label }: { label: string }) => (
    <button type="button">{label}</button>
  ),
}))

import { SiteHeader } from '../../components/site-header'

describe('SiteHeader', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/projects')
  })

  it('renders the primary navigation and marks the active route', () => {
    render(
      <SiteHeader
        navItems={[
          { route: '/projects', title: 'Projects' },
          { route: '/resume', title: 'Resume' },
        ]}
      />
    )

    expect(
      screen.getByRole('link', { name: 'Nick Ambrose home' })
    ).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(screen.getByRole('link', { name: 'Resume' })).not.toHaveAttribute(
      'aria-current'
    )
    expect(screen.getByRole('button', { name: 'Work with me' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument()
  })
})
