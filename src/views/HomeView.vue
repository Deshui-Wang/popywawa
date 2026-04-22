<template>
  <main class="main-content">
    <!-- Hero Section -->
    <section class="hero-section animate-fade-in">
      <h1 class="hero-title">Experience the <br/><span class="gradient-text">Future of Play</span></h1>
      <p class="hero-subtitle">
        Shuo(硕) is Shun(顺)，is财，is砚，but Shuo not only this，Shuo is Little Fish and like Shui，so Shuo is DeShui. I'm Shuo，I'm Sure！
      </p>
      <div class="hero-buttons">
        <el-button type="primary" size="large" round class="hero-btn primary">Get Started</el-button>
        <el-button size="large" round class="hero-btn secondary">Learn More</el-button>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-grid">
      <div 
        v-for="item in features" 
        :key="item.title" 
        :class="['feature-card', 'glass-card', item.title.toLowerCase()]"
        @click="goToDetail(item.id)"
      >
        <!-- Special Background for POPMART / Wentongzi -->
        <div v-if="item.images" class="brand-images">
          <img v-for="img in item.images" :key="img" :src="img" :alt="item.title" class="brand-fig" />
        </div>

        <!-- Atmosphere Image for Brands like LEGO -->
        <div v-if="item.atmosphere" class="atmosphere-layer">
          <img :src="item.atmosphere" :alt="item.title" class="atmo-img" />
        </div>
        
        <div class="card-content">
          <div class="feature-icon text-icon">
            <span>{{ item.char }}</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <div class="explore-hint">点击探索系列 ✨</div>
        </div>
      </div>
    </section>
  </main>

  <!-- Background Decoration -->
  <div class="bg-glow blob-1"></div>
  <div class="bg-glow blob-2"></div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  {
    id: 'popmart',
    title: 'POPMART',
    char: '泡',
    desc: '探索盲盒的惊喜世界，每一款潮流玩具都是艺术与好奇心的完美结合。',
    images: [
      '/pic/ppmt/labbubu.jpg',
      '/pic/ppmt/MOLLE.jpg',
      '/pic/ppmt/demoo.jpg',
      '/pic/ppmt/sp.jpg',
      '/pic/ppmt/xiaoye.jpg'
    ]
  },
  {
    id: 'lego',
    title: 'LEGO',
    char: '乐',
    desc: '拼搭无限可能，从微小颗粒到宏大世界的跨维度创造力体验。',
    atmosphere: '/pic/lego/lego02.jpg'
  },
  {
    id: 'wentongzi',
    title: '问童子',
    char: '童',
    desc: '传统文化的潮流新生，用匠心和东方美学重新定义“玩偶”的生命力。',
    images: [
      '/pic/wentongzi/wtz01.jgp',
      '/pic/wentongzi/wtz02.jgp',
      '/pic/wentongzi/wtz03.jgp',
      '/pic/wentongzi/wtz04.jgp',
      '/pic/wentongzi/wtz05.jgp'
    ]
  }
]

const goToDetail = (id) => {
  router.push(`/list/${id}`)
}
</script>

<style scoped>
.main-content {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 8rem;
  z-index: 10;
}

.hero-section {
  text-align: center;
}

.hero-title {
  font-size: 5rem;
  line-height: 1.1;
  margin-bottom: 2rem;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--text-secondary);
  max-width: 800px;
  margin: 0 auto 3rem;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.hero-btn {
  padding: 1.5rem 3rem !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
}

.hero-btn.primary {
  background: var(--primary-gradient) !important;
  border: none !important;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.feature-card {
  padding: 3rem;
  text-align: left;
  position: relative;
  overflow: visible; 
  min-height: 440px;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-10px);
  z-index: 50;
}

.card-content {
  position: relative;
  z-index: 2;
  flex: 1;
}

.feature-card.popmart .card-content,
.feature-card.问童子 .card-content {
  margin-bottom: 120px; 
}

.explore-hint {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: var(--primary-color);
  opacity: 0;
  transition: opacity 0.3s;
}

.feature-card:hover .explore-hint {
  opacity: 1;
}

.brand-images {
  position: absolute;
  bottom: 0;
  top: -300px;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  pointer-events: none;
  z-index: 10;
  padding: 0 10px;
  clip-path: inset(0px 0px 0px 0px); 
  mask-image: linear-gradient(to top, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 20px, rgba(0,0,0,1) 100%);
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 20px, rgba(0,0,0,1) 100%);
}

.brand-fig {
  height: 140px;
  width: auto;
  object-fit: contain;
  margin-left: -45px;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.4));
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 1;
  position: relative;
  transform-origin: bottom center;
  will-change: transform;
}

.brand-fig:first-child {
  margin-left: 0;
}

.brand-fig:nth-child(1) { z-index: 1; transform: rotate(-4deg); }
.brand-fig:nth-child(2) { z-index: 3; height: 150px; } 
.brand-fig:nth-child(3) { z-index: 5; height: 165px; margin-left: -50px; }
.brand-fig:nth-child(4) { z-index: 4; height: 155px; margin-left: -50px; }
.brand-fig:nth-child(5) { z-index: 2; transform: rotate(4deg); margin-left: -50px; }

.atmosphere-layer {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 50%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
}

.atmo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1;
  transition: all 0.6s ease;
}

.feature-card.lego:hover .atmo-img {
  transform: scale(1.15) rotate(-2deg);
  opacity: 0.9;
}

.feature-card.popmart:hover .brand-fig,
.feature-card.问童子:hover .brand-fig {
  transform: translateY(-8px) scale(1.05);
  opacity: 1;
  filter: drop-shadow(0 15px 30px rgba(0,0,0,0.6));
}

.feature-card.popmart:hover .brand-fig:nth-child(3) {
  transform: translateY(-15px) scale(1.1);
}

.问童子 .brand-images {
  bottom: 0;
  justify-content: flex-start;
  padding-left: 20px;
}

.问童子 .brand-fig {
  height: 130px;
  margin-left: -35px;
}

.问童子 .brand-fig:nth-child(2) { z-index: 4; height: 145px; }
.问童子 .brand-fig:nth-child(4) { z-index: 5; height: 155px; } 

.feature-card.问童子:hover .brand-fig {
  transform: translateY(-12px) scale(1.08) rotate(-3deg);
}

.feature-icon.text-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  margin-bottom: 2rem;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-weight: 900;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.popmart .text-icon { background: #f61024; color: #ffffff; box-shadow: 0 8px 16px rgba(246, 16, 36, 0.3); }
.lego .text-icon { background: #ffce00; color: #ffffff; box-shadow: 0 8px 16px rgba(255, 206, 0, 0.3); }
.问童子 .text-icon { background: #087b37; color: #ffce00; box-shadow: 0 8px 16px rgba(8, 123, 55, 0.3); }

.feature-card:hover .feature-icon.text-icon {
  transform: rotate(12deg) scale(1.1);
  filter: brightness(1.1) saturate(1.2);
}

.bg-glow {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(120px);
  z-index: 1;
  opacity: 0.4;
}

.blob-1 { background: var(--primary-color); top: -200px; left: -200px; }
.blob-2 { background: var(--secondary-color); bottom: -200px; right: -200px; }

@media (max-width: 768px) {
  .hero-title { font-size: 3rem; }
}
</style>
