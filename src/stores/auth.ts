import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuth } from '@/composables/useAuth'

// 以逗號分隔，可設定多個管理員 UID（GitHub 與 Google 登入各一個）
const ADMIN_UIDS = (import.meta.env.VITE_ADMIN_UID ?? '')
  .split(',')
  .map((uid) => uid.trim())
  .filter(Boolean)

export interface User {
  id: string
  email: string | null
  displayName?: string | null
  avatar?: string | null
  provider?: string
  role: 'user' | 'admin'
}

export const useAuthStore = defineStore('auth', () => {
  // 使用 Firebase Auth composable
  const firebaseAuth = useAuth()

  // 計算屬性
  const isAuthenticated = computed(() => firebaseAuth.isAuthenticated.value)
  // 只用來決定介面顯示；真正的權限由 firestore.rules 把關
  const isAdmin = computed(() => {
    const uid = firebaseAuth.user.value?.uid
    return !!uid && ADMIN_UIDS.includes(uid)
  })

  // 狀態 (使用 Firebase 的狀態)
  const user = computed<User | null>(() =>
    firebaseAuth.user.value
      ? {
          id: firebaseAuth.user.value.uid,
          email: firebaseAuth.user.value.email,
          displayName: firebaseAuth.user.value.displayName,
          avatar: firebaseAuth.user.value.photoURL,
          role: isAdmin.value ? 'admin' : 'user',
          provider: 'firebase',
        }
      : null,
  )

  const isLoading = computed(() => firebaseAuth.isLoading.value)
  const error = computed(() => firebaseAuth.error.value)

  return {
    // 狀態
    user,
    isLoading,
    error,

    // 計算屬性
    isAuthenticated,
    isAdmin,

    // 方法
    initAuth: firebaseAuth.initAuth,
    loginWithGoogle: firebaseAuth.loginWithGoogle,
    loginWithGithub: firebaseAuth.loginWithGithub,
    logout: firebaseAuth.logout,
    clearError: firebaseAuth.clearError,
  }
})
