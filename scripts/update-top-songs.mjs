// 抓 Spotify 全球週榜前 5 名，寫入 src/data/top-songs.json
// 由 .github/workflows/update-top-songs.yml 每月執行；本機可用 `node scripts/update-top-songs.mjs`
// 資料來源是 Spotify Charts 網站自己用的非公開接口，格式改了就會失敗，此時不覆寫檔案，網站維持上次的歌單
import { writeFile } from 'node:fs/promises'

const CHARTS_URL =
  process.env.CHARTS_URL ?? 'https://charts-spotify-com-service.spotify.com/public/v0/charts'
const CHART_ALIAS = 'REGIONAL_GLOBAL_WEEKLY'
const SONG_COUNT = 5
const OUTPUT = new URL('../src/data/top-songs.json', import.meta.url)

const fail = (message) => {
  console.error(`更新熱門歌曲失敗：${message}`)
  process.exit(1)
}

const res = await fetch(CHARTS_URL).catch((err) => fail(err.message))
if (!res.ok) fail(`HTTP ${res.status}`)

const data = await res.json().catch(() => fail('回應不是 JSON'))
const chart = data?.chartEntryViewResponses?.find(
  (c) => c?.displayChart?.chartMetadata?.alias === CHART_ALIAS,
)
if (!chart) fail(`找不到 ${CHART_ALIAS} 排行榜`)

const songs = (chart.entries ?? [])
  .map((entry) => ({
    rank: entry?.chartEntryData?.currentRank,
    title: entry?.trackMetadata?.trackName,
    artist: (entry?.trackMetadata?.artists ?? [])
      .map((a) => a?.name)
      .filter(Boolean)
      .join(', '),
  }))
  .filter((s) => Number.isInteger(s.rank) && s.title && s.artist)
  .sort((a, b) => a.rank - b.rank)
  .slice(0, SONG_COUNT)

if (songs.length < SONG_COUNT) fail(`只取得 ${songs.length} 首歌`)

// 以台灣時間決定月份
const month = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Taipei',
  year: 'numeric',
  month: '2-digit',
})
  .format(new Date())
  .slice(0, 7)

const result = { month, chartDate: chart.displayChart.date, songs }
await writeFile(OUTPUT, JSON.stringify(result, null, 2) + '\n')
console.log(`已更新 ${month}（榜單日期 ${result.chartDate}）：`)
for (const s of songs) console.log(`  ${s.rank}. ${s.title} — ${s.artist}`)
