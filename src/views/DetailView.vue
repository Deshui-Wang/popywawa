<template>
  <div class="detail-page" v-if="toy">
    <header class="header-nav animate-fade-in">
      <el-button @click="router.back()" class="back-btn" link>
        <ArrowLeft :size="20" /> <span>返回系列</span>
      </el-button>
    </header>

    <main class="detail-container">
      <!-- Left: Interactive Image Section -->
      <section class="image-section animate-fade-in">
        <div class="main-image-wrapper glass-card">
          <img :src="toy.image" :alt="toy.name" class="toy-featured-img" />
          <div class="image-glow"></div>
        </div>
      </section>

      <!-- Right: Content Section -->
      <section class="content-section animate-fade-in">
        <div class="brand-tag">{{ brandName.toUpperCase() }}</div>
        <h1 class="toy-title gradient-text">{{ toy.name }}</h1>
        <div class="series-name">{{ seriesName }}</div>

        <p class="toy-description">
          这款作品延续了 {{ brandName }} 一贯的艺术风格，通过精湛的喷涂工艺和独特的造型语言，展现了潮玩文化中探索自我与世界的精神核心。它是收藏家们不容错过的诚意之作。
        </p>

        <div class="specs">
          <div class="spec-item glass-card">
            <span class="label">材质</span>
            <span class="value">PVC / ABS</span>
          </div>
          <div class="spec-item glass-card">
            <span class="label">尺寸</span>
            <span class="value">约 10-12cm</span>
          </div>
          <div class="spec-item glass-card">
            <span class="label">工艺</span>
            <span class="value">手工喷图</span>
          </div>
        </div>

        <div class="actions">
          <el-button type="primary" size="large" round class="action-btn buy">
            <ShoppingBag :size="20" /> 立即收藏
          </el-button>
          <el-button size="large" round class="action-btn share">
            <Share2 :size="20" /> 分享艺术
          </el-button>
        </div>
      </section>
    </main>

    <!-- Background Decoration -->
    <div class="bg-glow blob-detail"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ShoppingBag, Share2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// 这里简化数据逻辑，实际开发中可以从仓库地址获取
const toy = computed(() => {
  // 从 query 中获取名称和图片，或者通过 ID 从本地数据匹配
  return {
    name: route.query.name || '潮玩单品',
    image: route.query.image || '/pic/ppmt/labbubu.jpg'
  }
})

const brandName = computed(() => route.params.brandId || 'Brand')
const seriesName = computed(() => route.params.seriesId?.toUpperCase() || 'Series')
</script>

<style scoped>
.detail-page {
  width: 100%;
  max-width: 1400px;
  padding: 2rem 0;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
}

.header-nav { margin-bottom: 2rem; }
.back-btn { color: var(--text-secondary) !important; font-size: 1rem; }

.detail-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 5rem;
  align-items: center;
}

.image-section {
  position: relative;
}

.main-image-wrapper {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  position: relative;
  overflow: visible;
}

.toy-featured-img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  filter: drop-shadow(0 20px 50px rgba(0,0,0,0.6));
  z-index: 5;
  transition: transform 0.5s ease;
}

.main-image-wrapper:hover .toy-featured-img {
  transform: scale(1.05) rotate(2deg);
}

.image-glow {
  position: absolute;
  width: 60%;
  height: 60%;
  background: var(--primary-gradient);
  filter: blur(80px);
  opacity: 0.3;
  z-index: 1;
}

.brand-tag {
  color: var(--primary-color);
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 1rem;
}

.toy-title {
  font-size: 4rem;
  line-height: 1.1;
  margin-bottom: 0.5rem;
}

.series-name {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.toy-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  max-width: 500px;
}

.specs {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.spec-item {
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 100px;
}

.spec-item .label { font-size: 0.8rem; color: var(--text-secondary); }
.spec-item .value { font-weight: 600; color: #fff; }

.actions {
  display: flex;
  gap: 1.5rem;
}

.action-btn {
  padding: 1.5rem 2.5rem !important;
  font-weight: 600 !important;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.action-btn.buy {
  background: var(--primary-gradient) !important;
  border: none !important;
}

.bg-glow {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(140px);
  z-index: 1;
}

.bg-glow.blob-detail {
  background: var(--secondary-color);
  bottom: -10%;
  left: -10%;
  width: 700px;
  height: 700px;
  opacity: 0.15;
}

@media (max-width: 1024px) {
  .detail-container { grid-template-columns: 1fr; gap: 3rem; text-align: center; }
  .toy-description { margin-left: auto; margin-right: auto; }
  .specs, .actions { justify-content: center; }
  .toy-title { font-size: 3rem; }
}
</style>
