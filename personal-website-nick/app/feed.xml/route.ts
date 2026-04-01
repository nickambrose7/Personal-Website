import { getPosts } from '../posts/get-posts'

const CONFIG = {
  description: 'Latest blog posts from Nick Ambrose',
  lang: 'en-us',
  siteUrl: 'https://nickambrose.com',
  title: "Nick's Portfolio",
}

export async function GET() {
  const allPosts = await getPosts()
  const posts = allPosts
    .map(post => {
      const frontMatter = post.frontMatter as {
        date?: string
        description?: string
      }

      return `    <item>
      <title>${post.title}</title>
      <description>${frontMatter.description ?? ''}</description>
      <link>${CONFIG.siteUrl}${post.route}</link>
      <pubDate>${new Date(frontMatter.date ?? 0).toUTCString()}</pubDate>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${CONFIG.title}</title>
    <link>${CONFIG.siteUrl}</link>
    <description>${CONFIG.description}</description>
    <language>${CONFIG.lang}</language>
${posts}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  })
}
