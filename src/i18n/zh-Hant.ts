// 中文版保留網站原本的文字（含原本就是英文的部分），切回中文時畫面與改版前一致
export default {
  nav: {
    home: 'Home',
    blog: 'Blog',
    news: 'News',
    project: 'Project',
    message: 'Message',
    switchLanguage: '切換成日文',
    switchLabel: '日',
  },
  // 頁面大標題與分頁標題
  page: {
    blog: 'Blog',
    news: 'News',
    project: 'Project',
    message: 'Message',
  },
  home: {
    greeting: "Hi, I'm",
    tags: '#Tim Wu #Frontend #坤郁',
    welcome: 'Welcome to my blog, feel free to explore and discover amazing content!',
    blog: 'Blog',
    projects: 'Projects',
    aboutTitle: 'About Me',
    aboutDescription: 'You can call me  Tim Wu, Kunyu or 坤郁, living in Taiwan, Taipei.',
    techStackTitle: 'Tech Stack',
  },
  spotify: {
    title: 'Global Top 5',
  },
  post: {
    back: '← 回到 Blog',
    notFoundTitle: '找不到這篇文章',
    notFoundDescription: '文章可能已被移除，或網址打錯了。',
    notFoundPageTitle: '找不到文章',
  },
  news: {
    updated: '每天更新 · 最後更新',
  },
  projects: {
    instagram: {
      description: '使用純html和css實現的instagram登入頁面',
    },
    wanpai: {
      name: 'wanpai (已停止部署)',
      description: '讓喜歡玩具的人能更快找到喜歡的玩具，是一個大型的團體專案',
    },
    inline: {
      description: '模仿inline訂餐系統的頁面',
    },
    ubike: {
      description: 'UBike資訊頁面API串接',
    },
    brick: {
      name: '打磚遊戲',
      description: 'canvas和matter.js，2d物理引擎實現的打磚遊戲',
    },
  },
  message: {
    loginNotice: '🔒 Please log in to leave a message',
    loadFailed: '留言暫時載不出來',
    retry: '重新載入',
    loading: '載入留言中',
    empty: '還沒有留言，成為第一個留言的人吧！',
    confirmDelete: '確定刪除',
    cancel: '取消',
    delete: '刪除',
    logout: '登出',
    placeholder: '寫下您的留言...',
    sending: '發送中...',
    cooldown: '請稍候 {seconds} 秒',
    send: '發送留言',
    justNow: 'Just now',
    minutesAgo: '{n} minute ago | {n} minutes ago',
    hoursAgo: '{n} hour ago | {n} hours ago',
    daysAgo: '{n} day ago | {n} days ago',
    errors: {
      tooFrequent: '留言太頻繁，請稍後再試',
      sendFailed: '發送留言失敗：{detail}',
      deleteFailed: '刪除留言失敗：{detail}',
      timeout: '超過 10 秒沒有回應',
    },
  },
  login: {
    title: '登入',
    subtitle: '登入後即可留言',
    github: '使用 GitHub 登入',
    google: '使用 Google 登入',
    close: '關閉',
    errors: {
      userDisabled: '該用戶帳戶已被停用',
      tooManyRequests: '請求過於頻繁，請稍後再試',
      networkFailed: '網絡連接失敗',
      popupBlocked: '彈出視窗被阻擋，請允許彈出視窗',
      accountExists: '該電子郵件已使用其他方式註冊，請改用原本的登入方式（Google 或 GitHub）。',
      invalidCredential: '無效的憑證',
      operationNotAllowed: '該登入方式未啟用',
      unknown: '登入過程發生未知錯誤',
    },
  },
  notFound: {
    title: '找不到這個頁面',
    pageTitle: '找不到頁面',
    description: '網址可能打錯了，或這個頁面已經不存在。',
    home: '回到首頁',
  },
}
