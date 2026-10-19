import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

export const SITE_NAME = 'Tim Wu'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

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
      meta: { title: 'Blog' },
    },
    {
      path: '/blog/:slug',
      name: 'post',
      // 文章頁才用到 markdown-it；標題由 PostView 依文章設定
      component: () => import('@/views/PostView.vue'),
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('@/views/NewsView.vue'),
      meta: { title: 'News' },
    },
    {
      path: '/project',
      name: 'project',
      component: () => import('@/views/ProjectView.vue'),
      meta: { title: 'Project' },
    },
    {
      path: '/message',
      name: 'message',
      // 留言板才用到 Firestore
      component: () => import('@/views/MessageView.vue'),
      meta: { title: 'Message' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: '找不到頁面' },
    },
  ],
})

export function setPageTitle(title?: string) {
  document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME
}

router.afterEach((to) => {
  if (to.name !== 'post') setPageTitle(to.meta.title)
})

export default router
