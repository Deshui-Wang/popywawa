<template>
  <div class="list-page">
    <header class="list-header animate-fade-in">
      <el-button @click="router.back()" class="back-btn" link>
        <ArrowLeft :size="20" /> <span>返回首页</span>
      </el-button>
      <div class="header-info">
        <h1 class="gradient-text">{{ config.title }}</h1>
        <p>{{ config.desc }}</p>
      </div>
    </header>

    <section class="toy-grid animate-fade-in">
      <div v-for="(item, index) in config.items" :key="index" class="toy-card glass-card">
        <div class="toy-image">
          <img :src="item.image" :alt="item.name" />
        </div>
        <div class="toy-info">
          <h3>{{ item.name }}</h3>
          <p class="tag">{{ config.title }} 系列</p>
        </div>
      </div>
    </section>

    <!-- Background Decoration -->
    <div class="bg-glow blob-list"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const brandsData = {
  popmart: {
    title: 'POPMART',
    desc: '潮流玩具的艺术殿堂，汇聚全世界的惊喜与创意。',
    items: [
      { name: 'Labubu', image: '/pic/ppmt/labbubu.jpg' },
      { name: 'Molly', image: '/pic/ppmt/MOLLE.jpg' },
      { name: 'Dimoo', image: '/pic/ppmt/demoo.jpg' },
      { name: 'Skullpanda', image: '/pic/ppmt/sp.jpg' },
      { name: 'Xiaoye', image: '/pic/ppmt/xiaoye.jpg' }
    ]
  },
  lego: {
    title: 'LEGO',
    desc: '在每一块积木中释放无限想象力。',
    items: [
      { name: '积木世界', image: '/pic/lego/lego02.jpg' }
    ]
  },
  wentongzi: {
    title: '问童子',
    desc: '东方美学的潮流转世，中国创造的潮玩力量。',
    items: [
      { name: '问童子 01', image: '/pic/wentongzi/wtz01.jgp' },
      { name: '问童子 02', image: '/pic/wentongzi/wtz02.jgp' },
      { name: '问童子 03', image: '/pic/wentongzi/wtz03.jgp' },
      { name: '问童子 04', image: '/pic/wentongzi/wtz04.jgp' },
      { name: '问童子 05', image: '/pic/wentongzi/wtz05.jgp' }
    ]
  }
}

const config = computed(() => {
  return brandsData[route.params.id] || { title: 'Unknown', items: [] }
})
</script>

<style scoped>
.list-page {
  width: 100%;
  max-width: 1200px;
  padding: 2rem 0;
  min-height: 100vh;
}

.list-header {
  margin-bottom: 4rem;
}

.back-btn {
  color: var(--text-secondary) !important;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.back-btn:hover {
  color: var(--primary-color) !important;
}

.header-info h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.header-info p {
  color: var(--text-secondary);
  font-size: 1.2rem;
}

.toy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
  margin-bottom: 6rem;
}

.toy-card {
  padding: 1.5rem;
  transition: all 0.4s ease;
}

.toy-card:hover {
  transform: translateY(-10px);
  border-color: var(--primary-color);
}

.toy-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 1.5rem;
}

.toy-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.toy-card:hover .toy-image img {
  transform: scale(1.1);
}

.toy-info h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.tag {
  color: var(--primary-color);
  font-size: 0.9rem;
  font-weight: 600;
  background: rgba(99, 102, 241, 0.1);
  display: inline-block;
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
}

.bg-glow.blob-list {
  background: var(--primary-gradient);
  top: 10%;
  right: -10%;
  width: 500px;
  height: 500px;
  opacity: 0.2;
}

@media (max-width: 768px) {
  .header-info h1 { font-size: 2.5rem; }
}
</style>
