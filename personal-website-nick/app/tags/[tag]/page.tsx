import { PostCard } from 'nextra-theme-blog'
import { getPosts, getTags } from '../../posts/get-posts'

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}) {
  const params = await props.params
  return {
    title: `Posts Tagged with "${decodeURIComponent(params.tag)}"`,
  }
}

export async function generateStaticParams() {
  const allTags = await getTags()
  return [...new Set(allTags)].map(tag => ({ tag }))
}

export default async function TagPage(props: {
  params: Promise<{ tag: string }>
}) {
  const params = await props.params
  const { title } = await generateMetadata({ params: Promise.resolve(params) })
  const posts = await getPosts()
  const tag = decodeURIComponent(params.tag)

  return (
    <>
      <h1>{title}</h1>
      {posts
        .filter(post => post.frontMatter.tags?.includes(tag))
        .map(post => (
          <div key={post.route} className="post-card-shell not-prose">
            <PostCard post={post as never} />
          </div>
        ))}
    </>
  )
}
