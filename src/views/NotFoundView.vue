<template>
  <div class="not-found-view">
    <main class="container">
      <p class="code">404</p>
      <h1 class="title">找不到這個頁面</h1>
      <p class="description">網址可能打錯了，或這個頁面已經不存在。</p>
      <RouterLink to="/" class="home-link">回到首頁</RouterLink>
    </main>
  </div>
</template>

<style scoped>
.not-found-view {
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
}

.container {
  text-align: center;
}

.code {
  font-size: 5rem;
  font-weight: 700;
  line-height: 1;
  color: rgba(255, 255, 255, 0.15);
  margin-bottom: 1rem;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.75rem;
}

.description {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2rem;
}

.home-link {
  display: inline-block;
  padding: 0.6rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: background 0.2s ease;
}

.home-link:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
