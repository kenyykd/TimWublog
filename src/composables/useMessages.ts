import { ref, computed } from 'vue'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/config/firestore'

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

// 全局留言狀態（所有元件共用同一份）
const messages = ref<Message[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const messagesRef = collection(db, 'messages')

const errorText = (err: unknown) => (err instanceof Error ? err.message : String(err))

export const useMessages = () => {
  // 清除錯誤
  const clearError = () => {
    error.value = null
  }

  // 新增留言；onSnapshot 會立即帶出本地寫入，不需要自己做樂觀更新
  const addMessage = async (messageData: NewMessage) => {
    error.value = null
    try {
      const docRef = await addDoc(messagesRef, {
        ...messageData,
        createdAt: serverTimestamp(),
      })
      return docRef.id
    } catch (err) {
      error.value = '發送留言失敗：' + errorText(err)
      throw err
    }
  }

  // 刪除留言（Firestore 規則限制只有管理員可以刪除）
  const deleteMessage = async (id: string) => {
    error.value = null
    try {
      await deleteDoc(doc(db, 'messages', id))
    } catch (err) {
      error.value = '刪除留言失敗：' + errorText(err)
      throw err
    }
  }

  // 實時監聽留言更新，回傳取消監聽的函數
  const subscribeToMessages = () => {
    isLoading.value = true
    const q = query(messagesRef, orderBy('createdAt', 'desc'))

    return onSnapshot(
      q,
      (querySnapshot) => {
        messages.value = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data({ serverTimestamps: 'estimate' }) as Omit<Message, 'id'>),
        }))
        isLoading.value = false
      },
      (err) => {
        error.value = '載入留言失敗：' + err.message
        isLoading.value = false
      },
    )
  }

  // 格式化時間顯示
  const formatMessageDate = (timestamp: Timestamp | null): string => {
    const date = timestamp ? timestamp.toDate() : new Date()

    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) {
      return 'Just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (diffInMinutes < 7 * 24 * 60) {
      const days = Math.floor(diffInMinutes / (24 * 60))
      return `${days} day${days > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return {
    // 狀態
    messages: computed(() => messages.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // 方法
    addMessage,
    deleteMessage,
    subscribeToMessages,
    formatMessageDate,
    clearError,
  }
}
