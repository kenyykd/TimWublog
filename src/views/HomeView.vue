<template>
  <div class="home-view">
    <div class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            {{ t('home.greeting') }}
            <TextFlip text="Tim Wu" class="highlight-text" />
          </h1>

          <p class="hero-tags">{{ t('home.tags') }}</p>
          <div class="hero-description">
            <!-- 換語言時重新掛載，動畫才會重播 -->
            <TextGenerateEffect :key="locale" :text="t('home.welcome')" class="description-text" />
          </div>
          <div class="hero-actions">
            <router-link to="/blog" class="btn btn-primary">{{ t('home.blog') }}</router-link>
            <router-link to="/project" class="btn btn-secondary">{{
              t('home.projects')
            }}</router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="featured-section">
      <div class="container">
        <div class="cards-grid">
          <div v-for="company in companies" :key="company.id" class="hover-effect-card">
            <div class="card-content">
              <div class="card-header">
                <h3 class="card-title" v-if="company.title">{{ t(company.title) }}</h3>
              </div>
              <p class="card-description" v-if="company.description">
                {{ t(company.description) }}
              </p>
              <TechStackIcons v-if="company.id === 'tech'" />
              <SpotifyPlaylist v-if="company.id === 'spotify'" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TextFlip from '@/components/TextFlip.vue'
import TextGenerateEffect from '@/components/TextGenerateEffect.vue'
import TechStackIcons from '@/components/TechStackIcons.vue'
import SpotifyPlaylist from '@/components/SpotifyPlaylist.vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// title / description 是 i18n key；Spotify 卡片自帶標題
const companies = [
  { id: 'about', title: 'home.aboutTitle', description: 'home.aboutDescription' },
  { id: 'tech', title: 'home.techStackTitle' },
  { id: 'spotify' },
]
</script>

<script lang="ts">
export default {
  name: 'HomeView',
}
</script>

<style scoped>
/* 桌機：Hero 與三張卡片排在同一個畫面（上方留給浮動 navbar） */
.home-view {
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(2rem, 7vh, 4.5rem);
  padding: 6rem 0 2.5rem;
  background: #0a0a0a;
}

.hero-section {
  background: #0a0a0a;
  color: white;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-section .container {
  display: flex;
  justify-content: flex-start;
  max-width: none;
  margin: 0;
  padding-left: 25vw;
  padding-right: 2rem;
}

.featured-section .container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-content {
  max-width: 900px;
  text-align: left;
  width: 100%;
  margin: 0;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: left;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  line-height: 1.1;
}

.highlight-text {
  display: inline-block;
  padding: 0.3rem 1.2rem;
  background: #0a0a0a;
  border: none;
  border-radius: 3rem;
  backdrop-filter: blur(20px);
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1em;
}

.highlight-text:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.hero-tags {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  text-align: left;
}

.hero-description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2.5rem;
  max-width: 650px;
  text-align: left;
}

.description-text {
  font-size: 1.125rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
}

.btn {
  padding: 0.75rem 1rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-block;
  border: none;
  background: transparent;
}

.btn-primary {
  color: rgba(255, 255, 255, 0.9);
}

.btn-primary:hover {
  color: white;
  transform: translateX(4px);
}

.btn-secondary {
  color: rgba(255, 255, 255, 0.7);
}

.btn-secondary:hover {
  color: rgba(255, 255, 255, 0.9);
  transform: translateX(4px);
}

.featured-section {
  padding: 0;
  background: #0a0a0a;
  position: relative;
}

.featured-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
  pointer-events: none;
}

/* 卡片網格布局 */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 900px;
  margin: 0;
  width: 100%;
}

/* Aceternity UI Hover Effect Cards */
.hover-effect-card {
  background: #000000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.hover-effect-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(255, 255, 255, 0.03) 50%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.hover-effect-card:hover::before {
  opacity: 1;
}

.hover-effect-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: -10px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.3;
  flex: 1;
}

.card-description {
  color: rgba(139, 148, 158, 0.8);
  line-height: 1.6;
  font-size: 0.875rem;
  margin: 0.5rem 0 0 0;
}

/* 響應式設計 */

/* 高度較矮的桌機／筆電（例如 1366x768、1280x720）：收緊 Hero 間距，讓卡片完整出現 */
@media (min-width: 769px) and (max-height: 820px) {
  .hero-title {
    font-size: 3.25rem;
    margin-bottom: 1rem;
  }

  .hero-tags {
    margin-bottom: 1.25rem;
  }

  .hero-description {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 768px) {
  /* 手機／平板：內容由上往下排，Hero 不再撐滿整個畫面 */
  .home-view {
    justify-content: flex-start;
    gap: 2.5rem;
    padding: 6rem 0 3rem;
  }

  .hero-section {
    align-items: center;
    justify-content: center;
  }

  .hero-section .container {
    padding-left: 2rem;
    padding-right: 2rem;
    justify-content: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .hero-content {
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    text-align: center;
  }

  .hero-tags {
    text-align: center;
  }

  .hero-description {
    text-align: center;
    font-size: 1rem;
  }

  .highlight-text {
    font-size: 0.9em;
    padding: 0.25rem 0.8rem;
  }

  .hero-description {
    margin-bottom: 1.5rem;
  }

  .hero-actions {
    justify-content: center;
  }

  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  /* 兩欄時第三張（Spotify）獨佔一列，避免旁邊空一格 */
  .hover-effect-card:last-child {
    grid-column: 1 / -1;
  }

  /* 固定高度在窄螢幕容易讓內容溢出，改成最小高度 */
  .hover-effect-card {
    padding: 1.25rem;
    height: auto;
    min-height: 180px;
  }

  .card-header {
    margin-bottom: 0.75rem;
  }

  .card-title {
    font-size: 1.125rem;
    margin: 0;
  }

  .card-description {
    font-size: 0.8rem;
  }

  .container {
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  /* 手機版 navbar 在底部：上方不用留空，底部要留給 navbar */
  .home-view {
    gap: 2rem;
    padding: 3rem 0 6.5rem;
  }

  .hero-title {
    font-size: 2rem;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .hero-tags {
    margin-bottom: 1.25rem;
  }

  .hero-tags {
    font-size: 1rem;
  }

  .hero-description {
    font-size: 0.9rem;
  }

  .highlight-text {
    font-size: 0.85em;
    padding: 0.2rem 0.6rem;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .hover-effect-card {
    padding: 1rem;
    min-height: 0;
  }

  .card-header {
    margin-bottom: 0.5rem;
  }

  .card-title {
    font-size: 1rem;
    margin: 0;
  }

  .card-description {
    font-size: 0.8rem;
  }
}
</style>
