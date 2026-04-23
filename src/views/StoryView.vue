<template>
  <div class="story-page animate-fade-in">
    <header class="story-header">
      <div class="title-group">
        <h1 class="gradient-text">Toy Stories</h1>
        <p>记录每一份热爱与奇遇</p>
      </div>
      <el-button type="primary" round class="publish-btn" @click="showAuth = true">
        <PenLine :size="18" /> <span>写故事</span>
      </el-button>
    </header>

    <!-- 纯文字卡片列表页 -->
    <main class="story-grid">
      <div v-for="story in stories" :key="story.id" class="story-card glass-card">
        <div class="story-content">
          <h3>{{ story.title }}</h3>
          <p>{{ story.excerpt }}</p>
          <div class="story-footer">
            <span class="date">{{ story.date }}</span>
          </div>
        </div>
      </div>
    </main>

    <!-- 验证弹窗 -->
    <AuthOverlay 
      v-model:visible="showAuth" 
      @success="handleAuthSuccess" 
    />

    <!-- 背景装饰 -->
    <div class="bg-glow blob-story"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { PenLine } from 'lucide-vue-next'
import AuthOverlay from '../components/AuthOverlay.vue'
import { useToyStore } from '../store/toyStore'

const router = useRouter()
const toyStore = useToyStore()
const showAuth = ref(false)

// 从 Store 中获取数据，实现动态响应
const stories = computed(() => toyStore.stories)

const handleAuthSuccess = () => {
  showAuth.value = false
  // 跳转到发布故事页面
  router.push('/publish?mode=story')
}
</script>

<style scoped>
.story-page { width: 100%; max-width: 1200px; margin: 0 auto; padding-bottom: 5rem; }

.story-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 4rem;
  padding: 0 1rem;
}

.title-group h1 { font-size: 3rem; margin-bottom: 0.5rem; }
.title-group p { color: var(--text-secondary); font-size: 1.1rem; }

.publish-btn {
  padding: 1.5rem 2rem !important;
  font-weight: 600 !important;
  background: var(--primary-gradient) !important;
  border: none !important;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 网格布局 */
.story-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

.story-card {
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.story-card:hover { transform: translateY(-10px); }

.story-image { width: 100%; height: 240px; position: relative; overflow: hidden; }
.story-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.story-card:hover .story-image img { transform: scale(1.1); }

.story-tag {
  position: absolute; top: 1rem; left: 1rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 0.8rem;
  color: #fff;
}

.story-content { padding: 1.5rem; }
.story-content h3 { font-size: 1.4rem; margin-bottom: 0.8rem; color: #fff; }
.story-content p {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.story-footer {
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.bg-glow {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(140px); /* 让它变成柔和的光晕 */
  z-index: 1;
}

.bg-glow.blob-story {
  background: var(--secondary-color);
  top: 40%;
  left: -10%;
  width: 700px;
  height: 700px;
  opacity: 0.15;
}

@media (max-width: 768px) {
  .story-header { flex-direction: column; align-items: flex-start; gap: 2rem; }
}
</style>
