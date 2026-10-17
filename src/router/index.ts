import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

// 首頁直接載入，其他頁面懶載入（各自拆成獨立 chunk）
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/BlogView.vue'),
    },
    {
      path: '/blog/:slug',
      name: 'post',
      // 文章頁才用到 markdown-it
      component: () => import('@/views/PostView.vue'),
    },
    {
      path: '/project',
      name: 'project',
      component: () => import('@/views/ProjectView.vue'),
    },
    {
      path: '/message',
      name: 'message',
      // 留言板才用到 Firestore
      component: () => import('@/views/MessageView.vue'),
    },
  ],
})

export default router
