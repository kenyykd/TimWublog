// 抓 iThome、科技新報、INSIDE、Hacker News，混合取 6 個月內最新 10 篇，寫入 src/data/news.json
// 由 .github/workflows/update-news.yml 每天執行；本機可用 `node scripts/update-news.mjs`
// 單一來源失敗只會略過；全部失敗或湊不到 10 篇就不覆寫檔案，網站維持上次的新聞
import { writeFile } from 'node:fs/promises'

const NEWS_COUNT = 10
const MAX_AGE_MONTHS = 6
const HN_STORY_COUNT = 30
const TIMEOUT_MS = 15_000
const OUTPUT = new URL('../src/data/news.json', import.meta.url)

const RSS_SOURCES = [
  { name: 'iThome', url: 'https://www.ithome.com.tw/rss' },
  { name: '科技新報', url: 'https://technews.tw/feed/' },
  { name: 'INSIDE', url: 'https://www.inside.com.tw/feed/rss' },
]
const HN_API = 'https://hacker-news.firebaseio.com/v0'

const request = async (url) => {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TimWuBlogBot/1.0)' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res
}

const decodeEntities = (text) =>
  text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')

// 取 <tag>…</tag> 的文字，處理 CDATA 與 entity
const readTag = (xml, tag) => {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'))
  if (!match) return ''
  const raw = match[1].replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, '$1')
  return decodeEntities(raw).replace(/\s+/g, ' ').trim()
}

// iThome 的日期沒有時區（例如 "2026-10-19  11:10:47"），視為台灣時間
const parseDate = (text) => {
  const noZone = text.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})$/)
  const date = new Date(noZone ? `${noZone[1]}T${noZone[2]}+08:00` : text)
  return Number.isNaN(date.getTime()) ? null : date
}

const fetchRss = async ({ name, url }) => {
  const xml = await (await request(url)).text()
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? []
  return items.map((item) => ({
    title: readTag(item, 'title'),
    url: readTag(item, 'link'),
    source: name,
    date: parseDate(readTag(item, 'pubDate')),
  }))
}

const fetchHackerNews = async () => {
  const ids = await (await request(`${HN_API}/topstories.json`)).json()
  const stories = await Promise.all(
    ids.slice(0, HN_STORY_COUNT).map(async (id) => {
      try {
        return await (await request(`${HN_API}/item/${id}.json`)).json()
      } catch {
        return null
      }
    }),
  )
  return stories
    .filter((s) => s?.type === 'story' && s.title)
    .map((s) => ({
      title: s.title,
      // Ask HN 之類沒有外部連結，改連到討論頁
      url: s.url ?? `https://news.ycombinator.com/item?id=${s.id}`,
      source: 'Hacker News',
      date: new Date(s.time * 1000),
    }))
}

const tasks = [
  ...RSS_SOURCES.map((source) => ({ name: source.name, run: () => fetchRss(source) })),
  { name: 'Hacker News', run: fetchHackerNews },
]

const results = await Promise.all(
  tasks.map(async ({ name, run }) => {
    try {
      const items = await run()
      console.log(`${name}：${items.length} 篇`)
      return items
    } catch (err) {
      console.warn(`略過 ${name}：${err.message}`)
      return []
    }
  }),
)

const now = new Date()
const cutoff = new Date(now)
cutoff.setMonth(cutoff.getMonth() - MAX_AGE_MONTHS)

const seen = new Set()
const items = results
  .flat()
  .filter((n) => n.title && /^https?:\/\//.test(n.url) && n.date && n.date >= cutoff)
  // iThome 偶爾會把 pubDate 設在未來（文章已上線），視為現在，避免一直卡在最上面
  .map((n) => (n.date > now ? { ...n, date: now } : n))
  .filter((n) => !seen.has(n.url) && seen.add(n.url))
  .sort((a, b) => b.date - a.date)
  .slice(0, NEWS_COUNT)
  .map(({ title, url, source, date }) => ({ title, url, source, publishedAt: date.toISOString() }))

if (items.length < NEWS_COUNT) {
  console.error(`更新新聞失敗：只取得 ${items.length} 篇（需要 ${NEWS_COUNT} 篇），不覆寫檔案`)
  process.exit(1)
}

await writeFile(
  OUTPUT,
  JSON.stringify({ updatedAt: new Date().toISOString(), items }, null, 2) + '\n',
)
console.log(`已更新 ${items.length} 篇：`)
for (const n of items) console.log(`  [${n.source}] ${n.publishedAt.slice(0, 16)} ${n.title}`)
