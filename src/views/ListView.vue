<template>
  <div class="list-page">
    <header class="list-header animate-fade-in">
      <el-button @click="router.push('/')" class="back-btn" link>
        <ArrowLeft :size="20" /> <span>返回主页</span>
      </el-button>
      <div class="header-info">
        <h1 class="gradient-text">{{ config.title }}</h1>
        <p>{{ config.desc }}</p>
      </div>
    </header>

    <section class="series-grid animate-fade-in">
      <div 
        v-for="(item, index) in config.series" 
        :key="index" 
        class="series-card glass-card"
        @click="goToSeries(item.id)"
      >
        <div class="series-preview">
          <img :src="item.image" :alt="item.name" />
        </div>
        <div class="series-info">
          <h3>{{ item.name }}</h3>
          <p>{{ item.count }} 个藏品</p>
          <div class="entry-btn">查看系列详细 →</div>
        </div>
        <!-- 增加卡片快捷发布按钮 (可选) -->
        <div class="card-action-hint">
          <Edit :size="16" />发布
        </div>
      </div>
    </section>

    <!-- Background Decoration -->
    <div class="bg-glow blob-list"></div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Edit } from 'lucide-vue-next'
import AuthOverlay from '../components/AuthOverlay.vue'

const route = useRoute()
const router = useRouter()

const brandsData = {
  popmart: {
    title: 'POPMART',
    desc: '潮流玩具的系列博览，点击下方系列探索更多。',
    series: [
      { id: 'labubu', name: 'Labubu', image: '/pic/ppmt/labbubu.jpg', count: 12 },
      { id: 'molly', name: 'Molly', image: '/pic/ppmt/MOLLE.jpg', count: 24 },
      { id: 'demoo', name: 'Dimoo', image: '/pic/ppmt/demoo.jpg', count: 18 },
      { id: 'sp', name: 'Skullpanda', image: '/pic/ppmt/sp.jpg', count: 15 },
      { id: 'xiaoye', name: 'Xiaoye', image: '/pic/ppmt/xiaoye.jpg', count: 8 }
    ]
  },
  lego: {
    title: 'LEGO',
    desc: '在每一块积木中释放无限想象力。',
    series: [
      { id: 'lego02', name: 'Architecture', image: '/pic/lego/lego02.jpg', count: 5 }
    ]
  },
  wentongzi: {
    title: '问童子',
    desc: '东方美学的潮流转世，中国创造的潮玩力量。',
    series: [
      { id: 'wtz-all', name: '问童子全系列', image: '/pic/wentongzi/wtz01.jpg', count: 5 }
    ]
  }
}

const config = computed(() => {
  return brandsData[route.params.id] || { title: 'Unknown', series: [] }
})

const goToSeries = (seriesId) => {
  router.push({ 
    name: 'series', 
    params: { brandId: route.params.id, seriesId: seriesId } 
  })
}
</script>

<style scoped>
.list-page { width: 100%; max-width: 1200px; padding: 2rem 0; min-height: 100vh; position: relative; }
.back-btn { color: var(--text-secondary) !important; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.5rem; position: relative; z-index: 10; }

.header-info h1 { font-size: 3.5rem; margin-bottom: 1rem; }
.header-info p { color: var(--text-secondary); font-size: 1.2rem; }

.series-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
}

.series-card {
  padding: 1.5rem;
  transition: all 0.4s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  z-index: 5; /* 确保卡片在背景上方 */
  user-select: none;
}

.series-card:hover {
  transform: scale(1.02) translateY(-5px);
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 0.08);
}

.series-card:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.1);
}

.series-preview {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
}

.series-preview img { width: 100%; height: 100%; object-fit: cover; }

.series-info h3 { font-size: 1.4rem; margin-bottom: 0.3rem; }
.series-info p { color: var(--text-secondary); font-size: 0.9rem; }
.entry-btn { color: var(--primary-color); font-size: 0.8rem; margin-top: 0.8rem; font-weight: 600; opacity: 1; transition: opacity 0.3s; }

.card-action-hint {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
  font-size: 0.7rem;
  padding: 4px 8px;
  border-radius: 8px;
  opacity: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s;
}

.series-card:hover .card-action-hint { opacity: 1; transform: translateY(-5px); }

.bg-glow.blob-list { 
  background: var(--primary-gradient); 
  top: 10%; 
  right: -10%; 
  width: 500px; 
  height: 500px; 
  opacity: 0.2; 
  position: absolute; 
  filter: blur(120px); 
  border-radius: 50%;
  pointer-events: none; /* 核心修复：防止背景遮挡点击 */
  z-index: 1;
}

@media (max-width: 768px) {
  .header-info h1 { font-size: 2.5rem; }
  .series-card { padding: 1rem; gap: 1rem; }
  .series-preview { width: 80px; height: 80px; }
}
</style>
