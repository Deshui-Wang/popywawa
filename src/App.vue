<template>
  <div class="popy-container dark">
    <!-- Shared Navbar -->
    <header class="navbar glass-card">
      <div class="logo cursor-pointer" @click="router.push('/')">
        <img src="/pic/delove/popywawa_square.png" alt="PoPyWaWa Logo" class="logo-img" />
        <span class="gradient-text logo-text">PoPyWaWa</span>
      </div>
      <nav class="nav-links">
        <router-link to="/" class="nav-item">🏠 Home</router-link>
        <router-link to="/story" class="nav-item">📚 Story</router-link>
        <router-link to="/network" class="nav-item">🕸️ 关系网</router-link>
      </nav>
      <div class="actions">
        <el-button @click="router.push('/join')" class="premium-join-btn">
          <span>Join Now</span>
        </el-button>
      </div>
    </header>

    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.fullPath" />
    </router-view>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2026 PoPyWaWa. Built with Deshui ❤️ Angel for the future.</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToyStore } from './store/toyStore'

const router = useRouter()
const toyStore = useToyStore()

onMounted(() => {
  // 应用启动时，从云端拉取最新数据
  toyStore.fetchToys()
  toyStore.fetchStories()
})
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
  display: flex;
  align-items: center;
  gap: 0.8rem;
  perspective: 1000px;
  margin-left: -1.5rem; /* 整体向左移动 */
}

.logo-img {
  height: 90px; /* 大尺寸，溢出导航栏 */
  width: auto;
  object-fit: contain;
  margin-top: -45px; /* 向上突破边界 */
  margin-bottom: -25px; /* 向下轻微突破 */
  filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.5));
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: center bottom;
  position: relative;
  z-index: 10;
}

.logo:hover .logo-img {
  transform: scale(1.15) rotateX(10deg) rotateY(-10deg) translateY(-10px);
  filter: drop-shadow(0 30px 40px rgba(0, 0, 0, 0.7));
}

.logo-text {
  font-size: 1.8rem;
  letter-spacing: 1px;
  font-weight: 900;
  text-shadow: 0 4px 10px rgba(0,0,0,0.3);
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

.premium-join-btn {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 100px !important;
  padding: 0.8rem 1.8rem !important;
  color: #fff !important;
  font-weight: 600 !important;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.premium-join-btn:hover {
  background: var(--primary-gradient) !important;
  border-color: transparent !important;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
  transform: translateY(-2px);
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
