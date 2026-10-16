import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuth } from '@/composables/useAuth'

const ADMIN_UID = import.meta.env.VITE_ADMIN_UID

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
  const isAdmin = computed(() => !!ADMIN_UID && firebaseAuth.user.value?.uid === ADMIN_UID)

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
