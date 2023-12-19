import 'nextra-theme-blog/style.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/main.css'

/*
  * This is the root component of the application.
  * It is used to add global styles and scripts.
  * It is also used to persist layout between page changes.
  * Can use this to keep state when navigating between pages.
  * For more info on exactly what this page does, see:
  * https://nextjs.org/docs/pages/building-your-application/routing/custom-app
  */

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS"
          href="/feed.xml"
        />
        <link
          rel="preload"
          href="/fonts/Inter-roman.latin.var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
