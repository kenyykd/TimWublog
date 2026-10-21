<template>
  <div class="message-form-container">
    <div class="user-info">
      <img
        :src="user.avatar || `https://i.pravatar.cc/40?u=${user.id}`"
        :alt="user.name"
        class="user-avatar"
      />
      <div class="user-details">
        <span class="user-name">{{ user.name || user.email }}</span>
        <button @click="$emit('logout')" class="logout-btn">{{ $t('message.logout') }}</button>
      </div>
    </div>

    <form @submit.prevent="submitMessage" class="message-form">
      <div class="form-group">
        <textarea
          v-model="messageContent"
          class="message-input"
          :placeholder="$t('message.placeholder')"
          rows="3"
          :maxlength="MAX_MESSAGE_LENGTH"
          required
        ></textarea>
        <div class="char-count">{{ messageContent.length }}/{{ MAX_MESSAGE_LENGTH }}</div>
      </div>

      <p v-if="error" class="error-text">{{ error }}</p>

      <div class="form-actions">
        <button
          type="submit"
          class="submit-btn"
          :disabled="isSubmitting || cooldownLeft > 0 || !messageContent.trim()"
        >
          <span v-if="isSubmitting">{{ $t('message.sending') }}</span>
          <span v-else-if="cooldownLeft > 0">
            {{ $t('message.cooldown', { seconds: cooldownLeft }) }}
          </span>
          <span v-else>{{ $t('message.send') }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import {
  useMessages,
  MAX_MESSAGE_LENGTH,
  MESSAGE_COOLDOWN_SECONDS,
} from '@/composables/useMessages'

interface Props {
  user: {
    id: string
    name?: string
    email?: string
    avatar?: string
  }
}

interface Emits {
  (e: 'logout'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const { addMessage, error, messages } = useMessages()

const messageContent = ref('')
const isSubmitting = ref(false)

// 防洗版冷卻：以自己最新一則留言的時間計算（列表依時間新到舊排序，
// 剛送出的留言會由 onSnapshot 立即帶出），重新整理頁面後倒數也會接續
const now = ref(Date.now())
const timer = setInterval(() => (now.value = Date.now()), 1000)
onUnmounted(() => clearInterval(timer))

const cooldownLeft = computed(() => {
  const lastPost = messages.value.find((m) => m.userId === props.user.id)?.createdAt
  if (!lastPost) return 0
  const endsAt = lastPost.toMillis() + MESSAGE_COOLDOWN_SECONDS * 1000
  return Math.max(0, Math.ceil((endsAt - now.value) / 1000))
})

const submitMessage = async () => {
  const content = messageContent.value.trim()
  if (!content) return

  isSubmitting.value = true

  try {
    // 保存到 Firestore（Firestore 不接受 undefined 欄位，所以沒有頭像就不帶）
    await addMessage({
      userId: props.user.id,
      userName: props.user.name || props.user.email?.split('@')[0] || 'User',
      ...(props.user.avatar ? { userAvatar: props.user.avatar } : {}),
      content,
    })
    messageContent.value = '' // 清空輸入框
  } catch {
    // 錯誤訊息已由 useMessages 設定並顯示在表單上
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.message-form-container {
  background: transparent;
  border: none;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  max-width: 60%;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-name {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.logout-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.375rem;
  padding: 0.25rem 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  border-color: rgba(255, 255, 255, 0.4);
  color: rgba(255, 255, 255, 0.9);
}

.message-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  position: relative;
}

.message-input {
  width: 100%;
  max-width: 60%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: white;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 80px;
  transition: all 0.3s ease;
}

.message-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

.message-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.char-count {
  position: absolute;
  bottom: 0.75rem;
  right: 1rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  background: none;
  padding: 0;
  pointer-events: none;
  z-index: 1;
}

.error-text {
  color: #f87171;
  font-size: 0.8125rem;
  margin-bottom: 0.75rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .message-form-container {
    padding: 1rem;
    max-width: 90%;
  }

  .user-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .logout-btn {
    align-self: flex-end;
  }

  .message-input {
    max-width: 90%;
  }

  .char-count {
    display: none;
  }
}
</style>
