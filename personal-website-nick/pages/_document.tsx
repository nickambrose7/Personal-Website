import { Html, Head, Main, NextScript } from 'next/document'

/*
  * A custom document that wraps around your entire Next.js application. 
  * It serves as the main document template.
*/

export default function Document() {
  const meta = {
    title: 'Nick\'s Portfolio',
    description: 'Nick\'s Portfolio website, all you need to know about him!',
    image: '/images/logo.png',
  }

  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="follow, index" />
        <meta name="description" content={meta.description} />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@nickambrose" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
