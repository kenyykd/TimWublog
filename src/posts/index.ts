import type { Locale } from '@/i18n'

// 文章放在 src/posts/*.md，檔名即網址（/blog/<檔名>）
// 檔案開頭用 --- 包住的 frontmatter 寫 title、date、category、description、cover（選填）
// 日文版另存為 <檔名>.ja.md，共用同一個網址；沒有日文版的文章在日文模式顯示中文

export interface Post {
  slug: string
  title: string
  date: string
  category: string
  description: string
  cover?: string
  content: string
}

const files = import.meta.glob<string>('./*.md', { query: '?raw', import: 'default', eager: true })

function parsePost(slug: string, raw: string): Post {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const meta: Record<string, string> = {}

  if (match) {
    for (const line of match[1]!.split(/\r?\n/)) {
      const index = line.indexOf(':')
      if (index === -1) continue
      meta[line.slice(0, index).trim()] = line.slice(index + 1).trim()
    }
  }

  return {
    slug,
    title: meta.title ?? slug,
    date: meta.date ?? '',
    category: meta.category ?? '',
    description: meta.description ?? '',
    cover: meta.cover || undefined,
    content: match ? match[2]! : raw,
  }
}

const zhPosts = new Map<string, Post>()
const jaPosts = new Map<string, Post>()

for (const [path, raw] of Object.entries(files)) {
  const name = path.replace(/^\.\//, '').replace(/\.md$/, '')
  if (name.endsWith('.ja')) {
    const slug = name.slice(0, -'.ja'.length)
    jaPosts.set(slug, parsePost(slug, raw))
  } else {
    zhPosts.set(name, parsePost(name, raw))
  }
}

function localize(post: Post, locale: Locale): Post {
  return (locale === 'ja' && jaPosts.get(post.slug)) || post
}

// 以中文版為準列出文章（只有日文版的檔案不會出現），新的在前
const sortedPosts = [...zhPosts.values()].sort((a, b) => b.date.localeCompare(a.date))

export function getPosts(locale: Locale): Post[] {
  return sortedPosts.map((post) => localize(post, locale))
}

export function findPost(slug: string, locale: Locale): Post | undefined {
  const post = zhPosts.get(slug)
  return post && localize(post, locale)
}
