---
title: 這個網站是怎麼做的
date: 2026-10-17
category: Vue
description: 用 Vue 3、Firebase 與 Vercel 打造一個沒有自建伺服器的個人網站，順便記錄一次大翻修。
cover: /images/blogs/kenyydblog.png
---

這個網站是我的個人頁面，包含自我介紹、作品集、留言板，以及你正在看的這個 Blog。這篇文章記錄它用了哪些技術、為什麼這樣設計，還有最近一次翻修改了什麼。

## 技術選擇

| 分類 | 技術 |
| ---- | ---- |
| 前端 | Vue 3（Composition API + `<script setup>`）、TypeScript |
| 建置 | Vite |
| 路由 | Vue Router（History 模式） |
| 狀態 | Pinia + Composables |
| 後端 | Firebase Authentication、Cloud Firestore |
| 部署 | Vercel |

樣式全部用原生 CSS 寫，沒有用 UI 框架。

## 沒有自建伺服器

整個網站是純前端的 SPA。登入和資料都交給 Firebase：前端直接用 Firebase SDK 讀寫 Firestore，權限則由 **Firestore Security Rules** 在雲端把關。

這代表 Firebase 的 Web 設定本來就是公開的，真正的安全防線是規則。以留言板為例，規則寫的是：

- 所有人都可以讀留言
- 登入的人只能用**自己的 UID** 留言，內容 1–500 字，時間必須是伺服器時間
- 留言不能修改
- 只有管理員可以刪除

```js
allow create: if request.auth != null
  && request.resource.data.userId == request.auth.uid
  && request.resource.data.content.size() <= 500
  && request.resource.data.createdAt == request.time;
```

## 第三方登入與即時留言

登入用 Firebase Authentication 的 `signInWithPopup`，支援 Google 和 GitHub。`onAuthStateChanged` 只在 App 啟動時註冊一次，使用者狀態放在模組層級的 `ref`，所有元件共用同一份。

留言板用 Firestore 的 `onSnapshot` 訂閱留言集合，有人新增或刪除留言，所有開著頁面的人都會即時看到。新增時用 `serverTimestamp()`，避免使用者電腦時間不準造成順序錯亂。

## SPA 路由在 Vercel 上的坑

Vue Router 用 History 模式，網址沒有 `#`。但直接打開 `/blog` 時，Vercel 找不到 `blog` 這個檔案就會回 404。解法是在 `vercel.json` 把所有路徑導回 `index.html`，交給前端路由處理：

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 一次大翻修

網站做好一段時間後，我回頭整理了一次：

1. **清除死碼**：刪掉連正式版都開著的假 API（mock）、沒人用的 store 與元件。
2. **統一名稱與 SEO**：網站名稱統一為 Tim Wu，補上 `lang`、description、OG 標籤與 favicon。
3. **修好留言板**：原本兩個元件各拿一份狀態，樂觀更新完全沒效果；改成模組層共用狀態後才正常。順便不再把留言者的 email 存進資料庫，並加上管理員刪除功能。
4. **Blog 真的能寫文章了**：文章是放在 repo 裡的 Markdown 檔，push 到 GitHub 就自動上線，不需要後台。

## 文章是怎麼運作的

每篇文章是 `src/posts/` 底下的一個 `.md` 檔，開頭用 frontmatter 寫標題和日期。Vite 的 `import.meta.glob` 會在建置時把所有文章讀進來，文章頁再用 `markdown-it` 轉成 HTML。檔名就是網址，例如這篇是 `/blog/how-this-site-was-built`。
