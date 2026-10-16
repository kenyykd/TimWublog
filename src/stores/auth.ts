import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuth } from '@/composables/useAuth'

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

  // 狀態 (使用 Firebase 的狀態)
  const user = computed<User | null>(() =>
    firebaseAuth.user.value
      ? {
          id: firebaseAuth.user.value.uid,
          email: firebaseAuth.user.value.email,
          displayName: firebaseAuth.user.value.displayName,
          avatar: firebaseAuth.user.value.photoURL,
          role: 'user',
          provider: 'firebase',
        }
      : null,
  )

  const isLoading = computed(() => firebaseAuth.isLoading.value)
  const error = computed(() => firebaseAuth.error.value)

  // 計算屬性
  const isAuthenticated = computed(() => firebaseAuth.isAuthenticated.value)
  const isAdmin = computed(() => false)

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
