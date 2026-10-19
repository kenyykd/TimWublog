<template>
  <div class="spotify-playlist">
    <div class="playlist-header">
      <div class="playlist-icon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path
            d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.669 11.538a.5.5 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686m.979-2.176a.6.6 0 0 1-.859.208c-2.203-1.33-5.318-1.628-8.528-.869a.6.6 0 0 1-.365-1.157c3.559-.828 7.008-.42 9.294 1.052a.6.6 0 0 1 .209.859m.258-2.387c-2.646-1.552-6.44-1.988-10.386-1.176a.75.75 0 1 1-.318-1.472c4.354-.882 8.448-.344 11.189 1.344a.75.75 0 0 1-.317 1.476"
          />
        </svg>
      </div>
      <span class="playlist-title">Global Top 5</span>
      <span class="playlist-month">{{ monthLabel }}</span>
    </div>

    <ol class="song-list">
      <li v-for="song in topSongs.songs" :key="song.rank" class="song-item">
        <span class="song-rank">{{ song.rank }}</span>
        <span class="song-title">{{ song.title }}</span>
        <span class="song-artist">{{ song.artist }}</span>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
// 由 GitHub Actions 每月執行 scripts/update-top-songs.mjs 更新（Spotify 全球週榜前 5 名）
import topSongs from '@/data/top-songs.json'

// "2026-10" → "2026.10"
const monthLabel = topSongs.month.replace('-', '.')
</script>

<style scoped>
.spotify-playlist {
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0.5rem;
  padding: 0.625rem 0.75rem;
  margin-top: -14px;
}

.playlist-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.375rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.playlist-icon {
  color: #1ed760;
  display: flex;
  align-items: center;
}

.playlist-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.playlist-month {
  margin-left: auto;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
  font-variant-numeric: tabular-nums;
}

.song-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

/* 一首一行：名次、歌名、歌手；太長就用省略號 */
.song-item {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  min-width: 0;
  line-height: 1.5;
}

.song-rank {
  flex-shrink: 0;
  width: 0.75rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.song-title,
.song-artist {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-title {
  flex-shrink: 1;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.song-artist {
  flex: 1 1 0;
  min-width: 2.5rem;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.55);
}

.song-item:first-child .song-rank,
.song-item:first-child .song-title {
  color: #1ed760;
}

@media (max-width: 480px) {
  .spotify-playlist {
    padding: 0.5rem;
  }

  .playlist-title {
    font-size: 0.7rem;
  }
}
</style>
