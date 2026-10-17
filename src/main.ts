import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

useAuthStore().initAuth()

// 頁面是懶載入的，等第一個路由解析完再掛載，導覽列才不會先停在 Home 再滑過去
router.isReady().then(() => app.mount('#app'))
