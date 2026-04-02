import type { Metadata } from 'next'
import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-blog'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'nextra-theme-blog/style.css'
import '../styles/main.css'
import { LeadCaptureTrigger } from '../components/leads/lead-capture-trigger'

const title = "Nick's Portfolio"
const description =
  "Nick's portfolio website, all you need to know about him!"

export const metadata: Metadata = {
  metadataBase: new URL('https://nickambrose.com'),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  applicationName: title,
  alternates: {
    types: {
      'application/rss+xml': [
        {
          title: 'RSS',
          url: '/feed.xml',
        },
      ],
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title,
    description,
    siteName: title,
    images: ['/images/logo.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@nickambrose',
    title,
    description,
    images: ['/images/logo.png'],
  },
  robots: {
    follow: true,
    index: true,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head backgroundColor={{ dark: '#0f172a', light: '#ffffff' }}>
        <link
          rel="preload"
          href="/fonts/Inter-roman.latin.var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/devicon/devicon.min.css"
        />
      </Head>
      <body>
        <Layout>
          <Navbar pageMap={await getPageMap()}>
            <LeadCaptureTrigger
              label="Work with me"
              sourceLabel="navbar-cta"
              className="lead-trigger-inline"
            />
            <ThemeSwitch />
          </Navbar>
          {children}
          <Footer>
            <small className="footer">
              <span>
                <time>{new Date().getFullYear()}</time> © Nicholas Ambrose.
              </span>
              <span className="footer-actions">
                <a href="/feed.xml">RSS</a>
              </span>
            </small>
          </Footer>
        </Layout>
      </body>
    </html>
  )
}
