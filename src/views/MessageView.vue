<template>
  <div class="message-view">
    <div class="message-header">
      <div class="container">
        <h1 class="page-title">Message</h1>
      </div>
    </div>

    <div class="message-content">
      <div class="container">
        <!-- 登入狀態判斷 -->
        <div v-if="!authStore.isAuthenticated" class="login-notice" @click="showLogin">
          🔒 Please log in to leave a message
        </div>

        <!-- 留言輸入框（登入後顯示） -->
        <MessageForm
          v-else
          :user="{
            id: authStore.user?.id || '',
            name: authStore.user?.displayName || undefined,
            email: authStore.user?.email || undefined,
            avatar: authStore.user?.avatar || undefined,
          }"
          @logout="handleLogout"
        />

        <p v-if="authStore.isAdmin && messagesError" class="list-error">{{ messagesError }}</p>

        <!-- 載入失敗（所有訪客都看得到；已有留言時保留列表） -->
        <div v-if="loadError" class="load-error" role="alert">
          <span>留言暫時載不出來</span>
          <button class="retry-btn" @click="reload">重新載入</button>
          <p v-if="authStore.isAdmin" class="load-error-detail">{{ loadError }}</p>
        </div>

        <!-- 留言列表 -->
        <div class="messages-list">
          <div v-if="messagesLoading" aria-label="載入留言中" aria-busy="true">
            <div v-for="n in 3" :key="n" class="message-item skeleton-item">
              <div class="skeleton skeleton-avatar"></div>
              <div class="message-info">
                <div class="skeleton skeleton-line short"></div>
                <div class="skeleton skeleton-line"></div>
              </div>
            </div>
          </div>
          <div v-else-if="firestoreMessages.length === 0 && !loadError" class="no-messages">
            還沒有留言，成為第一個留言的人吧！
          </div>
          <div v-else>
            <div v-for="message in firestoreMessages" :key="message.id" class="message-item">
              <div class="message-avatar">
                <img
                  :src="message.userAvatar || `https://i.pravatar.cc/40?u=${message.userId}`"
                  :alt="message.userName"
                />
              </div>

              <div class="message-info">
                <div class="message-meta">
                  <span class="message-author">{{ message.userName }}</span>
                  <span class="message-date">{{ formatMessageDate(message.createdAt) }}</span>

                  <!-- 管理員刪除（點兩次確認） -->
                  <span v-if="authStore.isAdmin" class="admin-actions">
                    <template v-if="pendingDeleteId === message.id">
                      <button class="delete-btn confirm" @click="confirmDelete(message.id)">
                        確定刪除
                      </button>
                      <button class="delete-btn" @click="pendingDeleteId = null">取消</button>
                    </template>
                    <button v-else class="delete-btn" @click="pendingDeleteId = message.id">
                      刪除
                    </button>
                  </span>
                </div>
                <div class="message-content-text">{{ message.content }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 登入模態框 -->
        <LoginModal :is-visible="showLoginModal" @close="closeLogin" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMessages } from '@/composables/useMessages'
import LoginModal from '@/components/LoginModal.vue'
import MessageForm from '@/components/MessageForm.vue'

// 登入狀態
const authStore = useAuthStore()
const showLoginModal = ref(false)

// 留言狀態
const {
  messages: firestoreMessages,
  subscribeToMessages,
  deleteMessage,
  formatMessageDate,
  isLoading: messagesLoading,
  error: messagesError,
  loadError,
} = useMessages()

let unsubscribe: (() => void) | null = null

// 等待確認刪除的留言 ID
const pendingDeleteId = ref<string | null>(null)

// 顯示登入模態框
const showLogin = () => {
  showLoginModal.value = true
}

// 關閉登入模態框
const closeLogin = () => {
  showLoginModal.value = false
}

// 處理登出
const handleLogout = async () => {
  try {
    await authStore.logout()
  } catch (error) {
    console.error('登出失敗:', error)
  }
}

// 管理員刪除留言
const confirmDelete = async (id: string) => {
  pendingDeleteId.value = null
  try {
    await deleteMessage(id)
  } catch {
    // 錯誤訊息已由 useMessages 設定並顯示在列表上方
  }
}

// 重新建立監聽（載入失敗後由使用者觸發）
const reload = () => {
  unsubscribe?.()
  unsubscribe = subscribeToMessages()
}

// 生命週期管理
onMounted(() => {
  // 開始監聽實時留言更新
  unsubscribe = subscribeToMessages()
})

onUnmounted(() => {
  // 清理監聽器
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>

<style scoped>
.message-view {
  min-height: 100vh;
  background: #0a0a0a;
  padding-top: 5rem;
  color: white;
}

.message-header {
  padding: 3rem 0;
}

.message-header .container {
  display: flex;
  justify-content: flex-start;
  max-width: none;
  margin: 0;
  padding-left: 25vw;
  padding-right: 2rem;
}

.page-title {
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
}

.message-content {
  padding: 2rem 0 4rem 0;
}

.container {
  max-width: none;
  margin: 0;
  padding-left: 25vw;
  padding-right: 2rem;
}

/* 登入提示 */
.login-notice {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 2rem;
  color: #ffc107;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 60%;
}

.login-notice:hover {
  background: rgba(255, 193, 7, 0.15);
  border-color: rgba(255, 193, 7, 0.4);
  transform: translateY(-1px);
}

/* 響應式調整登入提示 */
@media (max-width: 768px) {
  .login-notice,
  .load-error {
    max-width: 90%;
  }
}

/* 留言列表 */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  padding-left: 1rem;
  max-height: 60vh;
  max-width: 60%;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 隱藏滾動條 */
.messages-list::-webkit-scrollbar {
  display: none;
}

/* Firefox 隱藏滾動條 */
.messages-list {
  scrollbar-width: none;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  position: relative;
}

.message-item::before {
  content: '';
  position: absolute;
  left: -1.25rem;
  top: 1.25rem;
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}

.message-avatar {
  flex-shrink: 0;
}

.message-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.message-info {
  flex: 1;
  min-width: 0;
}

.message-meta {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.admin-actions {
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
}

.delete-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.25rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  cursor: pointer;
}

.delete-btn:hover {
  color: rgba(255, 255, 255, 0.9);
}

.delete-btn.confirm {
  border-color: rgba(248, 113, 113, 0.6);
  color: #f87171;
}

.list-error {
  color: #f87171;
  font-size: 0.8125rem;
  margin-bottom: 1rem;
}

.message-author {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
}

.message-date {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.message-content-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  line-height: 1.4;
}

/* 載入失敗提示 */
.load-error {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  max-width: 60%;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: 0.5rem;
  background: rgba(248, 113, 113, 0.08);
  color: #fca5a5;
  font-size: 0.875rem;
}

.retry-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 0.375rem;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.8125rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
}

.retry-btn:hover {
  border-color: rgba(255, 255, 255, 0.5);
}

.load-error-detail {
  flex-basis: 100%;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  word-break: break-word;
}

/* 載入中骨架 */
.skeleton-item::before {
  display: none;
}

.skeleton {
  background: rgba(255, 255, 255, 0.08);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.skeleton-line {
  height: 0.75rem;
  width: 80%;
  border-radius: 0.25rem;
  margin-top: 0.375rem;
}

.skeleton-line.short {
  width: 30%;
}

@keyframes skeleton-pulse {
  50% {
    opacity: 0.4;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}

.no-messages {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  padding: 2rem;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .message-header .container {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .page-title {
    font-size: 2.5rem;
  }

  .message-content .container {
    padding-left: 2rem;
    padding-right: 1rem;
  }

  .messages-list {
    padding-left: 0.75rem;
    max-height: 50vh;
  }

  .message-item::before {
    left: -1rem;
  }
}
</style>
