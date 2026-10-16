# Tim Wu

個人網站：https://kenyykdblog.vercel.app/

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

## 頁面

| 路徑       | 內容                                                       |
| ---------- | ---------------------------------------------------------- |
| `/`        | 自我介紹、技術棧、喜歡的歌                                 |
| `/blog`    | 文章（目前只有一篇展示卡片）                               |
| `/project` | 作品集，點卡片開啟 demo 或 GitHub                          |
| `/message` | 留言板：Google / GitHub 登入後留言，即時同步；管理員可刪除 |

## 技術

- **Vue 3**（Composition API）+ **TypeScript** + **Vite**
- **Vue Router**、**Pinia**
- **Firebase Authentication**（Google、GitHub 登入）
- **Cloud Firestore**（留言資料，`onSnapshot` 即時更新）
- **Vercel** 部署，push `main` 自動上線；`vercel.json` 讓所有路徑回到 `index.html`
- 樣式為手寫 CSS，無 UI 框架

## 專案結構

```
src/
├── components/   # AppNavbar、LoginModal、MessageForm、動畫文字等元件
├── composables/  # useAuth（登入狀態）、useMessages（留言讀寫）
├── config/       # Firebase 初始化
├── router/       # 路由
├── stores/       # Pinia auth store（含管理員判斷）
└── views/        # 四個頁面
firestore.rules   # Firestore 安全規則
vercel.json       # SPA rewrite
```

## 開發

需要 Node.js 20.19+ 或 22.12+。

```bash
npm install
npm run dev        # 開發伺服器
npm run build      # 型別檢查 + 建置
npm run lint       # ESLint
npm run format     # Prettier
```

## 環境變數（`.env`）

| 變數              | 說明                                      |
| ----------------- | ----------------------------------------- |
| `VITE_FIREBASE_*` | Firebase Web 設定（公開資訊，安全靠規則） |
| `VITE_ADMIN_UID`  | 管理員的 Firebase Auth UID，可刪除留言    |

## Firestore 安全規則

規則在 [`firestore.rules`](firestore.rules)。修改後到 Firebase Console → Firestore Database → 規則，貼上內容並發布。

- 所有人可讀留言
- 登入者只能以自己的 UID 留言，內容 1–500 字，時間由伺服器決定
- 留言不可修改，只有管理員可刪除
