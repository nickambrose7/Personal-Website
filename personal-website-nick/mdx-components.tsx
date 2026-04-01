import { useMDXComponents as getBlogMDXComponents } from 'nextra-theme-blog'
import { CommentsSection } from './components/comments/comments-section'

function getPostPath(mdxPath?: string[]) {
  if (!mdxPath || mdxPath[0] !== 'posts' || mdxPath.length < 2) {
    return null
  }

  return `/${mdxPath.join('/')}`
}

export function useMDXComponents(components: any = {}) {
  const blogComponents = getBlogMDXComponents(components) as any
  const BlogWrapper = blogComponents.wrapper as any

  return {
    ...blogComponents,
    wrapper(props: any) {
      const postPath = getPostPath(props.params?.mdxPath)

      return (
        <BlogWrapper
          {...props}
          children={
            <>
              {props.children}
              {postPath ? <CommentsSection postPath={postPath} /> : null}
            </>
          }
        />
      )
    },
  }
}
