import { createI18n } from 'vue-i18n'
import zhHant from './zh-Hant'
import ja from './ja'

export type Locale = 'zh-Hant' | 'ja'

const STORAGE_KEY = 'locale'

// 上次選過的語言優先；第一次來訪時，瀏覽器是日文就顯示日文
function initialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'zh-Hant' || saved === 'ja') return saved
  } catch {
    // 無痕模式等情況可能讀不到 localStorage
  }
  return navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'zh-Hant'
}

const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: 'zh-Hant',
  messages: { 'zh-Hant': zhHant, ja },
})

document.documentElement.lang = i18n.global.locale.value

// 頁面標題由 router 監聽 locale 自行更新
export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  document.documentElement.lang = locale
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // 存不了就只在這次瀏覽有效
  }
}

export default i18n
