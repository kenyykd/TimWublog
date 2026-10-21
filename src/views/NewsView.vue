<template>
  <div class="news-view">
    <header class="news-header">
      <div class="container">
        <h1 class="page-title">{{ $t('page.news') }}</h1>
      </div>
    </header>

    <main class="news-content">
      <div class="container">
        <ol class="news-list">
          <li v-for="item in news.items" :key="item.url" class="news-item">
            <a :href="item.url" target="_blank" rel="noopener noreferrer" class="news-link">
              <span class="news-title">{{ item.title }}</span>
              <span class="news-meta">
                <span class="news-source">{{ item.source }}</span>
                <time :datetime="item.publishedAt" class="news-date">
                  {{ formatDate(item.publishedAt) }}
                </time>
              </span>
            </a>
          </li>
        </ol>

        <p class="news-footer">
          {{ $t('news.updated') }}
          <time :datetime="news.updatedAt">{{ formatDate(news.updatedAt) }}</time>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// 由 GitHub Actions 每天執行 scripts/update-news.mjs 更新
import news from '@/data/news.json'

// 以台灣時間顯示 YYYY-MM-DD
const dateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Taipei',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const formatDate = (iso: string) => dateFormat.format(new Date(iso))
</script>

<style scoped>
.news-view {
  min-height: 100vh;
  background: #0a0a0a;
  padding-top: 5rem;
  color: white;
}

.news-header {
  padding: 3rem 0;
}

.news-header .container,
.news-content .container {
  max-width: none;
  margin: 0;
  padding-left: 25vw;
  padding-right: 25vw;
}

.page-title {
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
}

.news-content {
  padding: 2rem 0 4rem;
}

.news-list {
  list-style: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.news-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.news-link {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1rem 0.5rem;
  color: inherit;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
}

.news-link:hover {
  background: rgba(255, 255, 255, 0.04);
}

.news-link:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

.news-title {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
}

.news-link:hover .news-title {
  color: #fff;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.news-source {
  padding: 0.125rem 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.7);
}

.news-date {
  font-variant-numeric: tabular-nums;
}

.news-footer {
  margin-top: 1.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

@media (max-width: 1024px) {
  .news-header .container,
  .news-content .container {
    padding-left: 15vw;
    padding-right: 15vw;
  }
}

@media (max-width: 768px) {
  .news-header .container,
  .news-content .container {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .page-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .news-header .container,
  .news-content .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  /* 手機版 navbar 在底部，底部留空 */
  .news-content {
    padding-bottom: 6.5rem;
  }

  .news-title {
    font-size: 0.9375rem;
  }
}
</style>
