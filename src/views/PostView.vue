<template>
  <div class="post-view">
    <main class="container">
      <RouterLink to="/blog" class="back-link">← 回到 Blog</RouterLink>

      <article v-if="post">
        <header class="post-header">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">
            <span class="post-date">{{ post.date }}</span>
            <span v-if="post.category" class="post-category">{{ post.category }}</span>
          </div>
        </header>
        <!-- markdown-it 關閉 html 選項，原始 HTML 會被跳脫 -->
        <div class="post-body" v-html="html"></div>
      </article>

      <div v-else class="not-found">
        <h1 class="post-title">找不到這篇文章</h1>
        <p>文章可能已被移除，或網址打錯了。</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { findPost } from '@/posts'

const md = new MarkdownIt({ html: false, linkify: true })

const route = useRoute()
const post = computed(() => findPost(String(route.params.slug)))
const html = computed(() => (post.value ? md.render(post.value.content) : ''))
</script>

<style scoped>
.post-view {
  min-height: 100vh;
  background: #0a0a0a;
  padding: 5rem 0 4rem;
  color: white;
}

.container {
  max-width: 760px;
  margin: 0 auto;
  padding: 3rem 2rem 0;
}

.back-link {
  display: inline-block;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: rgba(255, 255, 255, 0.9);
}

.post-header {
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.post-title {
  font-size: 2.25rem;
  font-weight: 600;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
}

.post-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.post-date {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}

.post-category {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.not-found p {
  color: rgba(255, 255, 255, 0.7);
}

/* v-html 產生的內容不帶 scoped 屬性，要用 :deep() */
.post-body {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  font-size: 1rem;
}

.post-body :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 2.5rem 0 1rem;
}

.post-body :deep(h3) {
  font-size: 1.2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 2rem 0 0.75rem;
}

.post-body :deep(p),
.post-body :deep(ul),
.post-body :deep(ol),
.post-body :deep(table),
.post-body :deep(pre) {
  margin-bottom: 1.25rem;
}

.post-body :deep(ul),
.post-body :deep(ol) {
  padding-left: 1.5rem;
}

.post-body :deep(li) {
  margin-bottom: 0.4rem;
}

.post-body :deep(a) {
  color: #60a5fa;
}

.post-body :deep(strong) {
  color: rgba(255, 255, 255, 0.95);
}

.post-body :deep(code) {
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.15rem 0.4rem;
  border-radius: 0.3rem;
}

.post-body :deep(pre) {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
}

.post-body :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 0.85rem;
  line-height: 1.6;
}

.post-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  display: block;
  overflow-x: auto;
}

.post-body :deep(th),
.post-body :deep(td) {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.post-body :deep(th) {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
}

@media (max-width: 768px) {
  .container {
    padding: 2rem 1.25rem 0;
  }

  .post-title {
    font-size: 1.75rem;
  }
}
</style>
