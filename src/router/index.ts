import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BlogView from '@/views/BlogView.vue'
import ProjectView from '@/views/ProjectView.vue'
import MessageView from '@/views/MessageView.vue'

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
      component: BlogView,
    },
    {
      path: '/blog/:slug',
      name: 'post',
      // 文章頁才用到 markdown-it，拆成獨立 chunk
      component: () => import('@/views/PostView.vue'),
    },
    {
      path: '/project',
      name: 'project',
      component: ProjectView,
    },
    {
      path: '/message',
      name: 'message',
      component: MessageView,
    },
  ],
})

export default router
