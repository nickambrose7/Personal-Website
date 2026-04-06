import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getPageMap, normalizePages } = vi.hoisted(() => ({
  getPageMap: vi.fn(),
  normalizePages: vi.fn(),
}))

vi.mock('nextra/page-map', () => ({
  getPageMap,
}))

vi.mock('nextra/normalize-pages', () => ({
  normalizePages,
}))

import { getPosts, getTags } from '../../app/posts/get-posts'

describe('getPosts', () => {
  beforeEach(() => {
    getPageMap.mockResolvedValue([])
    normalizePages.mockReturnValue({
      directories: [
        {
          name: 'index',
          route: '/posts',
          title: 'Posts',
          frontMatter: {},
        },
        {
          name: 'older-post',
          route: '/posts/older-post',
          title: 'Older Post',
          frontMatter: {
            date: '2024-01-15',
            tag: 'career',
          },
        },
        {
          name: 'newer-post',
          route: '/posts/newer-post',
          title: 'Newer Post',
          frontMatter: {
            date: '2025-08-01',
            tags: ['engineering', 'writing'],
          },
        },
      ],
    })
  })

  it('filters the index page, normalizes tags, and sorts newest first', async () => {
    const posts = await getPosts()

    expect(posts).toHaveLength(2)
    expect(posts.map((post) => post.name)).toEqual(['newer-post', 'older-post'])
    expect(posts[0].frontMatter.tags).toEqual(['engineering', 'writing'])
    expect(posts[1].frontMatter.tags).toEqual(['career'])
  })

  it('returns a flattened list of tags across posts', async () => {
    await expect(getTags()).resolves.toEqual([
      'engineering',
      'writing',
      'career',
    ])
  })
})
