import { ref, computed } from 'vue'
import {
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  onSnapshot,
  Timestamp,
  writeBatch,
  FirestoreError,
} from 'firebase/firestore'
import { db } from '@/config/firestore'
import i18n from '@/i18n'

export interface Message {
  id: string
  userId: string
  userName: string
  userEmail?: string
  userAvatar?: string
  content: string
  // serverTimestamp() 寫入後、伺服器回傳前，本地快照中會是 null
  createdAt: Timestamp | null
}

export type NewMessage = Omit<Message, 'id' | 'createdAt'>

export const MAX_MESSAGE_LENGTH = 500
// 兩次留言的最短間隔（秒），需與 firestore.rules 的 rateLimits 規則一致
export const MESSAGE_COOLDOWN_SECONDS = 30

// 全局留言狀態（所有元件共用同一份）
const messages = ref<Message[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
// 載入留言列表的錯誤（與發送／刪除的 error 分開，訪客也要看得到）
const loadError = ref<string | null>(null)

// 超過這個時間還沒收到伺服器資料，就提示載入失敗（仍會繼續等待）
const LOAD_TIMEOUT_MS = 10_000

const messagesRef = collection(db, 'messages')

const { t } = i18n.global

const errorText = (err: unknown) => (err instanceof Error ? err.message : String(err))

export const useMessages = () => {
  // 清除錯誤
  const clearError = () => {
    error.value = null
  }

  // 新增留言；onSnapshot 會立即帶出本地寫入，不需要自己做樂觀更新
  // 留言與 rateLimits/{uid} 必須同一批寫入，Firestore 規則才會放行（防洗版）
  const addMessage = async (messageData: NewMessage) => {
    error.value = null
    try {
      const messageRef = doc(messagesRef)
      const batch = writeBatch(db)
      batch.set(messageRef, { ...messageData, createdAt: serverTimestamp() })
      batch.set(doc(db, 'rateLimits', messageData.userId), { lastPostAt: serverTimestamp() })
      await batch.commit()
      return messageRef.id
    } catch (err) {
      error.value =
        err instanceof FirestoreError && err.code === 'permission-denied'
          ? t('message.errors.tooFrequent')
          : t('message.errors.sendFailed', { detail: errorText(err) })
      throw err
    }
  }

  // 刪除留言（Firestore 規則限制只有管理員可以刪除）
  const deleteMessage = async (id: string) => {
    error.value = null
    try {
      await deleteDoc(doc(db, 'messages', id))
    } catch (err) {
      error.value = t('message.errors.deleteFailed', { detail: errorText(err) })
      throw err
    }
  }

  // 實時監聽留言更新，回傳取消監聽的函數
  const subscribeToMessages = () => {
    isLoading.value = true
    loadError.value = null
    const q = query(messagesRef, orderBy('createdAt', 'desc'))

    const timeout = setTimeout(() => {
      loadError.value = t('message.errors.timeout')
      isLoading.value = false
    }, LOAD_TIMEOUT_MS)

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        // 離線時 Firestore 會先給一份空的快取結果，不能當成「沒有留言」
        if (querySnapshot.metadata.fromCache && querySnapshot.empty) return

        clearTimeout(timeout)
        messages.value = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data({ serverTimestamps: 'estimate' }) as Omit<Message, 'id'>),
        }))
        loadError.value = null
        isLoading.value = false
      },
      (err) => {
        clearTimeout(timeout)
        loadError.value = err.message
        isLoading.value = false
      },
    )

    return () => {
      clearTimeout(timeout)
      unsubscribe()
    }
  }

  // 格式化時間顯示（在模板中呼叫，t 會讀取 locale，換語言時自動重新渲染）
  const formatMessageDate = (timestamp: Timestamp | null): string => {
    const date = timestamp ? timestamp.toDate() : new Date()

    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) {
      return t('message.justNow')
    } else if (diffInMinutes < 60) {
      return t('message.minutesAgo', diffInMinutes)
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60)
      return t('message.hoursAgo', hours)
    } else if (diffInMinutes < 7 * 24 * 60) {
      const days = Math.floor(diffInMinutes / (24 * 60))
      return t('message.daysAgo', days)
    } else {
      return i18n.global.locale.value === 'ja'
        ? date.toLocaleDateString('ja-JP')
        : date.toLocaleDateString()
    }
  }

  return {
    // 狀態
    messages: computed(() => messages.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    loadError: computed(() => loadError.value),

    // 方法
    addMessage,
    deleteMessage,
    subscribeToMessages,
    formatMessageDate,
    clearError,
  }
}
