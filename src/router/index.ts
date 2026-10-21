import { watch } from 'vue'
import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import i18n from '@/i18n'

export const SITE_NAME = 'Tim Wu'

declare module 'vue-router' {
  interface RouteMeta {
    // i18n key
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
      meta: { title: 'page.blog' },
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
      meta: { title: 'page.news' },
    },
    {
      path: '/project',
      name: 'project',
      component: () => import('@/views/ProjectView.vue'),
      meta: { title: 'page.project' },
    },
    {
      path: '/message',
      name: 'message',
      // 留言板才用到 Firestore
      component: () => import('@/views/MessageView.vue'),
      meta: { title: 'page.message' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'notFound.pageTitle' },
    },
  ],
})

export function setPageTitle(title?: string) {
  document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME
}

const setRouteTitle = (to: RouteLocationNormalized) => {
  if (to.name !== 'post') setPageTitle(to.meta.title && i18n.global.t(to.meta.title))
}

router.afterEach(setRouteTitle)

// 切換語言時重設標題（文章頁由 PostView 自己處理）
watch(i18n.global.locale, () => setRouteTitle(router.currentRoute.value))

export default router
