import { normalizePages } from 'nextra/normalize-pages'
import { getPageMap } from 'nextra/page-map'

type FrontMatter = {
  date?: string
  description?: string
  tag?: string
  tags?: string[]
  title?: string
}

type Post = {
  frontMatter: FrontMatter
  name: string
  route: string
  title: string
}

function normalizeTags(frontMatter: FrontMatter) {
  if (Array.isArray(frontMatter.tags)) {
    return frontMatter.tags
  }
  if (frontMatter.tag) {
    return [frontMatter.tag]
  }
  return []
}

export async function getPosts() {
  const { directories } = normalizePages({
    list: await getPageMap('/posts'),
    route: '/posts',
  })

  return (directories as Post[])
    .filter(post => post.name !== 'index')
    .map(post => ({
      ...post,
      frontMatter: {
        ...post.frontMatter,
        tags: normalizeTags(post.frontMatter),
      },
    }))
    .sort(
      (a, b) =>
        new Date(b.frontMatter.date ?? 0).getTime() -
        new Date(a.frontMatter.date ?? 0).getTime()
    )
}

export async function getTags() {
  const posts = await getPosts()
  return posts.flatMap(post => post.frontMatter.tags ?? [])
}
