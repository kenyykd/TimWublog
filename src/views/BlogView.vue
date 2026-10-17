<template>
  <div class="blog-view">
    <header class="blog-header">
      <div class="container">
        <h1 class="page-title">Blog</h1>
      </div>
    </header>

    <main class="blog-content">
      <div class="container">
        <div class="article-list">
          <RouterLink
            v-for="post in posts"
            :key="post.slug"
            :to="{ name: 'post', params: { slug: post.slug } }"
            class="article-link"
          >
            <article class="article-card">
              <div v-if="post.cover" class="article-image">
                <div class="placeholder-image">
                  <div class="terminal-window">
                    <img :src="post.cover" :alt="post.title" loading="lazy" />
                  </div>
                </div>
              </div>
              <div class="article-content">
                <div class="article-header">
                  <h2 class="article-title">{{ post.title }}</h2>
                  <div class="article-meta">
                    <span class="article-date">{{ post.date }}</span>
                    <span v-if="post.category" class="article-category">{{ post.category }}</span>
                  </div>
                </div>
                <p class="article-description">{{ post.description }}</p>
              </div>
            </article>
          </RouterLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { posts } from '@/posts'
</script>

<style scoped>
.blog-view {
  min-height: 100vh;
  background: #0a0a0a;
  padding-top: 5rem;
  color: white;
}

.blog-header {
  padding: 3rem 0;
}

.blog-header .container {
  display: flex;
  justify-content: flex-start;
  max-width: none;
  margin: 0;
  padding-left: 25vw;
  padding-right: 2rem;
}

.page-title {
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
}

.blog-content {
  padding: 2rem 0;
}

.blog-content .container {
  max-width: none;
  margin: 0;
  padding: 0 2rem;
  padding-left: 25vw;
  padding-right: 25vw;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.article-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.article-card {
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}

.article-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.article-image {
  position: relative;
  width: 50%;
  height: 250px;
  overflow: hidden;
  flex-shrink: 0;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
}

.terminal-window img {
  width: 100%;
  height: calc(100% - 4px);
  object-fit: cover;
  border-radius: 0.5rem;
  margin: 2px 0;
}

.terminal-window {
  background: #2d2d2d;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.article-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.article-header {
  margin-bottom: 1rem;
}

.article-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.article-date {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}

.article-category {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.article-description {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .blog-header .container {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .blog-content .container {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .page-title {
    font-size: 2.5rem;
  }

  .article-card {
    flex-direction: column;
    gap: 0;
  }

  .article-image {
    width: 100%;
    height: 200px;
  }

  .article-content {
    padding: 1.5rem;
  }

  .article-title {
    font-size: 1.25rem;
  }
}
</style>
