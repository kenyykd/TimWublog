import type zhHant from './zh-Hant'

const ja: typeof zhHant = {
  // 導覽列維持英文：日文標籤較長，手機版會超出畫面
  nav: {
    home: 'Home',
    blog: 'Blog',
    news: 'News',
    project: 'Project',
    message: 'Message',
    switchLanguage: '中国語（繁体字）に切り替え',
    switchLabel: '中',
  },
  page: {
    blog: 'ブログ',
    news: 'ニュース',
    project: 'プロジェクト',
    message: 'メッセージ',
  },
  home: {
    greeting: 'こんにちは、',
    tags: '#Tim Wu #フロントエンド #坤郁',
    welcome: 'ブログへようこそ。気軽に見て回って、いろいろな記事を楽しんでください！',
    blog: 'ブログ',
    projects: 'プロジェクト',
    aboutTitle: '自己紹介',
    aboutDescription:
      'Tim Wu（ティム・ウー）です。坤郁（クンユー）とも呼ばれています。台湾・台北在住です。',
    techStackTitle: '技術スタック',
  },
  spotify: {
    title: 'グローバル Top 5',
  },
  post: {
    back: '← ブログに戻る',
    notFoundTitle: '記事が見つかりません',
    notFoundDescription: '記事が削除されたか、URL が間違っている可能性があります。',
    notFoundPageTitle: '記事が見つかりません',
  },
  news: {
    updated: '毎日更新 · 最終更新',
  },
  projects: {
    status: {
      inProgress: '開発中',
    },
    saas: {
      description: '建設・内装業向けの工事日報と不具合管理システム',
    },
    instagram: {
      description: 'HTML と CSS だけで再現した Instagram のログインページ',
    },
    wanpai: {
      name: 'wanpai（公開終了）',
      description: 'おもちゃ好きのためのおもちゃ探しサービス（チーム開発）',
    },
    inline: {
      description: 'inline の予約システムを模したページ',
    },
    ubike: {
      description: 'API と連携した UBike（台湾のシェアサイクル）情報ページ',
    },
    brick: {
      name: 'ブロック崩し',
      description: 'canvas と 2D 物理エンジン matter.js で作ったブロック崩しゲーム',
    },
  },
  message: {
    loginNotice: '🔒 メッセージを残すにはログインしてください',
    loadFailed: 'メッセージを読み込めませんでした',
    retry: '再読み込み',
    loading: 'メッセージを読み込み中',
    empty: 'まだメッセージはありません。最初のメッセージを残してみませんか？',
    confirmDelete: '削除する',
    cancel: 'キャンセル',
    delete: '削除',
    logout: 'ログアウト',
    placeholder: 'メッセージを入力...',
    sending: '送信中...',
    cooldown: 'あと {seconds} 秒お待ちください',
    send: 'メッセージを送信',
    justNow: 'たった今',
    minutesAgo: '{n}分前',
    hoursAgo: '{n}時間前',
    daysAgo: '{n}日前',
    errors: {
      tooFrequent: '送信の間隔が短すぎます。しばらくしてからもう一度お試しください',
      sendFailed: 'メッセージの送信に失敗しました：{detail}',
      deleteFailed: 'メッセージの削除に失敗しました：{detail}',
      timeout: '10 秒以上応答がありません',
    },
  },
  login: {
    title: 'ログイン',
    subtitle: 'ログインするとメッセージを残せます',
    github: 'GitHub でログイン',
    google: 'Google でログイン',
    close: '閉じる',
    errors: {
      userDisabled: 'このアカウントは無効になっています',
      tooManyRequests: 'リクエストが多すぎます。しばらくしてからもう一度お試しください',
      networkFailed: 'ネットワークに接続できませんでした',
      popupBlocked: 'ポップアップがブロックされました。ポップアップを許可してください',
      accountExists:
        'このメールアドレスは別の方法で登録済みです。最初に使ったログイン方法（Google または GitHub）でログインしてください。',
      invalidCredential: '認証情報が無効です',
      operationNotAllowed: 'このログイン方法は有効になっていません',
      unknown: 'ログイン中に不明なエラーが発生しました',
    },
  },
  notFound: {
    title: 'ページが見つかりません',
    pageTitle: 'ページが見つかりません',
    description: 'URL が間違っているか、このページはすでに存在しない可能性があります。',
    home: 'ホームに戻る',
  },
}

export default ja
