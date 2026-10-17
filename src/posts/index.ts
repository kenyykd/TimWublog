// 文章放在 src/posts/*.md，檔名即網址（/blog/<檔名>）
// 檔案開頭用 --- 包住的 frontmatter 寫 title、date、category、description、cover（選填）

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

function parsePost(path: string, raw: string): Post {
  const slug = path.replace(/^\.\//, '').replace(/\.md$/, '')
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

// 新的在前
export const posts: Post[] = Object.entries(files)
  .map(([path, raw]) => parsePost(path, raw))
  .sort((a, b) => b.date.localeCompare(a.date))

export function findPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}
