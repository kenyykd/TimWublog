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

// 全局用戶狀態
const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
let isInitialized = false

// 錯誤訊息處理
const errorMessages: Record<string, string> = {
  'auth/user-disabled': '該用戶帳戶已被停用',
  'auth/too-many-requests': '請求過於頻繁，請稍後再試',
  'auth/network-request-failed': '網絡連接失敗',
  'auth/popup-blocked': '彈出視窗被阻擋，請允許彈出視窗',
  'auth/account-exists-with-different-credential':
    '該電子郵件已使用其他方式註冊，請改用原本的登入方式（Google 或 GitHub）。',
  'auth/invalid-credential': '無效的憑證',
  'auth/operation-not-allowed': '該登入方式未啟用',
}

const getErrorMessage = (err: unknown): string => {
  const code = err instanceof FirebaseError ? err.code : ''
  return errorMessages[code] || '登入過程發生未知錯誤'
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
