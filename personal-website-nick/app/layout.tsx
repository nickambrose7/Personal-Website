import type { Metadata } from 'next'
import { Footer, Layout } from 'nextra-theme-blog'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { normalizePages } from 'nextra/normalize-pages'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'nextra-theme-blog/style.css'
import '../styles/main.css'
import { SiteHeader } from '../components/site-header'

const title = 'Nick Ambrose | Software Engineer'
const description =
  'Portfolio, projects, and resume for Nick Ambrose, a software engineer focused on backend systems, databases, and dependable product delivery.'

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
  const pageMap = await getPageMap()
  const { topLevelNavbarItems } = normalizePages({
    list: pageMap,
    route: '/',
  })
  const navItems = topLevelNavbarItems.flatMap((item) =>
    item.route && item.title ? [{ route: item.route, title: item.title }] : []
  )

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
          <SiteHeader navItems={navItems} />
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
