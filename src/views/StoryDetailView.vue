<template>
  <div class="story-detail-page">
    <header class="header-nav animate-fade-in">
      <el-button @click="router.back()" class="back-btn" link>
        <ArrowLeft :size="20" /> <span>返回故事列表</span>
      </el-button>
    </header>

    <main v-if="story" class="story-container animate-fade-in">
      <div class="story-meta">
        <span class="date">{{ story.date || formatDate(story.created_at) }}</span>
      </div>
      
      <h1 class="story-title gradient-text">{{ story.title }}</h1>
      
      <div class="story-divider"></div>

      <div class="story-body">
        <p v-for="(paragraph, index) in contentParagraphs" :key="index">
          {{ paragraph }}
        </p>
      </div>
    </main>

    <div v-else-if="loading" class="loading-state">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 背景装饰 -->
    <div class="bg-glow blob-story-detail"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { supabase } from '../supabase'

const route = useRoute()
const router = useRouter()
const story = ref(null)
const loading = ref(true)

const contentParagraphs = computed(() => {
  if (!story.value?.excerpt) return []
  return story.value.excerpt.split('\n').filter(p => p.trim())
})

const formatDate = (isoString) => {
  if (!isoString) return ''
  return new Date(isoString).toISOString().split('T')[0]
}

onMounted(async () => {
  const { id } = route.params
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('id', id)
    .single()
  
  if (!error && data) {
    story.value = data
  }
  loading.value = false
})
</script>

<style scoped>
.story-detail-page {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
  min-height: 100vh;
  position: relative;
}

.header-nav { margin-bottom: 3rem; }
.back-btn { color: var(--text-secondary) !important; }

.story-container {
  position: relative;
  z-index: 10;
  padding: 2rem;
}

.story-meta {
  margin-bottom: 1rem;
  color: var(--primary-color);
  font-weight: 600;
  font-size: 0.9rem;
}

.story-title {
  font-size: 3.5rem;
  line-height: 1.2;
  margin-bottom: 2rem;
}

.story-divider {
  width: 60px;
  height: 4px;
  background: var(--primary-gradient);
  margin-bottom: 3rem;
  border-radius: 2px;
}

.story-body {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #e2e8f0;
  letter-spacing: 0.5px;
}

.story-body p {
  margin-bottom: 1.5rem;
}

.loading-state { padding: 4rem 2rem; }

.bg-glow {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(140px);
  z-index: 1;
}

.blob-story-detail {
  background: var(--secondary-color);
  top: 20%;
  right: -10%;
  width: 600px;
  height: 600px;
  opacity: 0.1;
}

@media (max-width: 768px) {
  .story-title { font-size: 2.2rem; }
  .story-body { font-size: 1.1rem; }
  .story-container { padding: 1rem; }
}
</style>
