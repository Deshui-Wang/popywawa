<template>
  <div class="popy-container dark">
    <!-- Shared Navbar -->
    <header class="navbar glass-card">
      <div class="logo cursor-pointer" @click="router.push('/')">
        <span class="gradient-text">PoPyWaWa</span>
      </div>
      <nav class="nav-links">
        <router-link to="/" class="nav-item">🏠 Home</router-link>
        <a href="#" class="nav-item">✨ Features</a>
        <a href="#" class="nav-item">🚀 Launch</a>
      </nav>
      <div class="actions">
        <el-button type="primary" round class="premium-button">Join Now</el-button>
      </div>
    </header>

    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2026 PoPyWaWa. Built with ❤️ for the future.</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.popy-container {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.navbar {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  z-index: 100;
  margin-bottom: 2rem;
}

.logo {
  cursor: pointer;
}

.logo span {
  font-size: 1.5rem;
  letter-spacing: 2px;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-item {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-item:hover, .router-link-active {
  color: var(--text-primary);
}

.footer {
  margin-top: auto;
  padding: 4rem 0 2rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  z-index: 10;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
