import { ref, computed } from 'vue'
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
  type AuthProvider,
  type User,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth } from '@/config/firebase'
import i18n from '@/i18n'

// 全局用戶狀態
const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
let isInitialized = false

// 錯誤訊息處理（值為 i18n key，以發生錯誤當下的語言顯示）
const errorMessages: Record<string, string> = {
  'auth/user-disabled': 'login.errors.userDisabled',
  'auth/too-many-requests': 'login.errors.tooManyRequests',
  'auth/network-request-failed': 'login.errors.networkFailed',
  'auth/popup-blocked': 'login.errors.popupBlocked',
  'auth/account-exists-with-different-credential': 'login.errors.accountExists',
  'auth/invalid-credential': 'login.errors.invalidCredential',
  'auth/operation-not-allowed': 'login.errors.operationNotAllowed',
}

const getErrorMessage = (err: unknown): string => {
  const code = err instanceof FirebaseError ? err.code : ''
  return i18n.global.t(errorMessages[code] || 'login.errors.unknown')
}

const isPopupClosed = (err: unknown) =>
  err instanceof FirebaseError &&
  (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request')

export const useAuth = () => {
  // 計算屬性
  const isAuthenticated = computed(() => !!user.value)

  // 清除錯誤
  const clearError = () => {
    error.value = null
  }

  const loginWith = async (provider: AuthProvider) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (err) {
      if (!isPopupClosed(err)) {
        error.value = getErrorMessage(err)
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Google 登入
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    return loginWith(provider)
  }

  // GitHub 登入
  const loginWithGithub = () => {
    const provider = new GithubAuthProvider()
    provider.addScope('user:email')
    return loginWith(provider)
  }

  // 登出
  const logout = async () => {
    isLoading.value = true
    error.value = null

    try {
      await signOut(auth)
    } catch (err) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 初始化認證狀態監聽（整個 app 只註冊一次）
  const initAuth = () => {
    if (isInitialized) return
    isInitialized = true
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
    })
  }

  return {
    // 狀態
    user: computed(() => user.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // 方法
    loginWithGoogle,
    loginWithGithub,
    logout,
    clearError,
    initAuth,
  }
}
