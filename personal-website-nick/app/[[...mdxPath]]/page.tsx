import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

async function loadPage(mdxPath?: string[]) {
  // Browser/devtools probes like `/.well-known/...` should be treated as 404s,
  // not as missing Nextra content modules.
  if (mdxPath?.[0]?.startsWith('.')) {
    notFound()
  }

  try {
    return await importPage(mdxPath)
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'MODULE_NOT_FOUND'
    ) {
      notFound()
    }
    throw error
  }
}

export async function generateMetadata(props: {
  params: Promise<{ mdxPath?: string[] }>
}) {
  const params = await props.params
  const { metadata } = await loadPage(params.mdxPath)
  return metadata
}

const Wrapper = (getMDXComponents() as any).wrapper as ComponentType<any>

export default async function Page(props: {
  params: Promise<{ mdxPath?: string[] }>
}) {
  const params = await props.params
  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode,
  } = await loadPage(params.mdxPath)

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
