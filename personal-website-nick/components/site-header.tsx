'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeSwitch } from 'nextra-theme-blog'
import { LeadCaptureTrigger } from './leads/lead-capture-trigger'

type NavItem = {
  route: string
  title: ReactNode
}

export function SiteHeader({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname()

  return (
    <header className="site-navbar" data-pagefind-ignore="all">
      <Link href="/" className="site-brand" aria-label="Nick Ambrose home">
        <span className="site-brand-mark">
          <Image
            src="/images/logo.png"
            alt="Nick Ambrose logo"
            width={44}
            height={44}
            priority
          />
        </span>
        <span className="site-brand-copy">
          <span className="site-brand-name">Nick Ambrose</span>
        </span>
      </Link>

      <nav className="site-nav" aria-label="Primary">
        {navItems.map((item) => {
          const isActive = pathname === item.route

          return (
            <Link
              key={item.route}
              href={item.route}
              className="site-nav-link"
              aria-current={isActive ? 'page' : undefined}
            >
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="site-nav-actions">
        <LeadCaptureTrigger
          label="Work with me"
          sourceLabel="navbar-cta"
          className="lead-trigger-inline"
        />
        <ThemeSwitch />
      </div>
    </header>
  )
}
