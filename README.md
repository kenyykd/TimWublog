<div align="center">

# Tim Wu

個人網站 · 作品集 · 留言板

[**kenyykdblog.vercel.app**](https://kenyykdblog.vercel.app/)

![Vue.js](https://img.shields.io/badge/Vue_3-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

<img src="docs/screenshot.png" alt="Tim Wu 網站首頁" width="720">

</div>

## 頁面

| 路徑       | 內容                                            |
| ---------- | ----------------------------------------------- |
| `/`        | 自我介紹、技術棧、喜歡的歌                      |
| `/blog`    | 文章（目前僅一篇展示卡片）                      |
| `/project` | 作品集，點擊卡片開啟 Demo 或 GitHub             |
| `/message` | 留言板，以 Google / GitHub 登入後留言，即時同步 |

## 技術

- **前端**：Vue 3（Composition API）、TypeScript、Vite、Vue Router、Pinia，手寫 CSS
- **後端服務**：Firebase Authentication、Cloud Firestore
- **部署**：Vercel，push `main` 後自動上線

## 開始使用

需要 Node.js `20.19+` 或 `22.12+`。

```bash
npm install
npm run dev       # 開發伺服器
npm run build     # 型別檢查 + 建置
npm run lint      # ESLint
npm run format    # Prettier
```

### 環境變數

在 `.env` 設定：

| 變數              | 說明                                            |
| ----------------- | ----------------------------------------------- |
| `VITE_FIREBASE_*` | Firebase Web 設定（屬公開資訊，安全由規則把關） |
| `VITE_ADMIN_UID`  | 管理員的 Firebase Auth UID，可刪除留言          |

## 專案結構

```
src/
├── components/    元件（AppNavbar、LoginModal、MessageForm、文字動畫）
├── composables/   useAuth 登入狀態、useMessages 留言讀寫
├── config/        Firebase 初始化
├── router/        路由
├── stores/        Pinia auth store
└── views/         Home、Blog、Project、Message 四個頁面

docs/              翻修紀錄與截圖
firestore.rules    Firestore 安全規則
vercel.json        SPA 路由設定
```

## Firestore 安全規則

規則位於 [`firestore.rules`](firestore.rules)，修改後至 **Firebase Console → Firestore Database → 規則** 貼上並發布。

- 所有人可讀取留言
- 登入者只能以自己的身分留言，內容 1–500 字
- 留言不可修改，僅管理員可刪除

## 開發紀錄

翻修內容與待辦事項見 [`docs/翻修紀錄.md`](docs/翻修紀錄.md)。
