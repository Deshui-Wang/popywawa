<template>
  <div class="list-page">
    <header class="list-header">
      <el-button @click="router.back()" class="back-btn" link>
        <ArrowLeft :size="20" /> <span>返回上一级</span>
      </el-button>
      
      <div class="header-info">
        <div class="header-top">
          <h1 class="gradient-text">{{ seriesConfig.name }}</h1>
          <!-- 顶部按钮，增加强力点击保证 -->
          <div class="publish-button-container">
             <button 
              @click.stop="triggerAuth" 
              class="premium-publish-btn"
            >
              <Plus :size="18" /> <span>发布新品</span>
            </button>
          </div>
        </div>
        <p>{{ seriesConfig.fullName }} • 全系列陈列</p>
      </div>
    </header>

    <!-- 高级身份验证浮层 -->
    <AuthOverlay v-model:visible="showAuth" @success="handleAuthSuccess" />

    <!-- 方案 B：永久悬浮发布球 (确保 100% 能点到) -->
    <div class="floating-publish-ball" @click="triggerAuth">
      <Plus :size="28" />
    </div>

    <section class="toy-grid">
      <!-- 先显示用户发布的 -->
      <div 
        v-for="(toy, index) in mergedToys" 
        :key="'new-' + index" 
        class="toy-card glass-card clickable"
        @click="goToDetail(toy)"
      >
        <div class="toy-image">
          <img :src="toy.image" :alt="toy.name" />
        </div>
        <div class="toy-info">
          <h3>{{ toy.name }}</h3>
          <p class="tag">{{ toy.isUserAdded ? '新发布' : 'Edition ' + (index + 1) }}</p>
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
import { ArrowLeft, Plus } from 'lucide-vue-next'
import AuthOverlay from '../components/AuthOverlay.vue'
import { useToyStore } from '../store/toyStore'

const route = useRoute()
const router = useRouter()
const toyStore = useToyStore()
const showAuth = ref(false)

// 确保响应式 ID 变化
const seriesId = computed(() => route.params.seriesId)

const seriesData = {
  labubu: { name: 'Labubu', fullName: 'THE MONSTERS 系列', toys: [{ name: '春天野餐', image: '/pic/ppmt/labbubu.jpg' }, { name: '夏日海滩', image: '/pic/ppmt/labbubu.jpg' }, { name: '秋日私语', image: '/pic/ppmt/labbubu.jpg' }, { name: '冬日暖阳', image: '/pic/ppmt/labbubu.jpg' }] },
  sp: { name: 'Skullpanda', fullName: '温度系列 / 密林系列', toys: [{ name: '食梦兽', image: '/pic/ppmt/sp.jpg' }, { name: '夜之眷属', image: '/pic/ppmt/sp.jpg' }, { name: '林中秘境', image: '/pic/ppmt/sp.jpg' }] },
  demoo: { name: 'Dimoo', fullName: '迷幻空间系列', toys: [{ name: '宇航员', image: '/pic/ppmt/demoo.jpg' }, { name: '潜水员', image: '/pic/ppmt/demoo.jpg' }, { name: '探险家', image: '/pic/ppmt/demoo.jpg' }] },
  molly: { name: 'Molly', fullName: 'SPACE MOLLY 系列', toys: [{ name: '宇航员 红', image: '/pic/ppmt/MOLLE.jpg' }, { name: '宇航员 蓝', image: '/pic/ppmt/MOLLE.jpg' }] },
  xiaoye: { name: 'Xiaoye', fullName: '小野系列', toys: [{ name: '小野 01', image: '/pic/ppmt/xiaoye.jpg' }] },
  'wtz-all': { name: '问童子', fullName: '问童子全系列陈列', toys: [{ name: '问童子 01', image: '/pic/wentongzi/wtz01.jpg' }, { name: '问童子 02', image: '/pic/wentongzi/wtz02.jpg' }, { name: '问童子 03', image: '/pic/wentongzi/wtz03.jpg' }, { name: '问童子 04', image: '/pic/wentongzi/wtz04.jpg' }, { name: '问童子 05', image: '/pic/wentongzi/wtz05.jpg' }] },
  lego02: { name: '积木世界', fullName: 'LEGO Architecture', toys: [{ name: '巴黎铁塔', image: '/pic/lego/lego02.jpg' }, { name: '悉尼歌剧院', image: '/pic/lego/lego02.jpg' }] }
}

const seriesConfig = computed(() => {
  return seriesData[seriesId.value] || { name: '未知系列', toys: [] }
})

const mergedToys = computed(() => {
  const baseToys = seriesConfig.value.toys.map(t => ({ ...t, isUserAdded: false }))
  const addedToys = toyStore.userAddedToys
    .filter(t => t.series === seriesConfig.value.name)
    .map(t => ({ ...t, isUserAdded: true }))
  
  return [...addedToys, ...baseToys]
})

const triggerAuth = () => {
  showAuth.value = true
}

const goToDetail = (toy) => {
  router.push({
    name: 'detail',
    params: { brandId: route.params.brandId, seriesId: route.params.seriesId },
    query: { name: toy.name, image: toy.image, desc: toy.desc }
  })
}

const handleAuthSuccess = () => {
  router.push({
    name: 'publish',
    query: { 
      brand: route.params.brandId, 
      series: seriesConfig.value.name 
    }
  })
}
</script>

<style scoped>
.list-page { width: 100%; max-width: 1200px; padding: 2rem 0; min-height: 100vh; position: relative; }
.back-btn { color: var(--text-secondary) !important; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.5rem; position: relative; z-index: 10; }

.header-top { 
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;
  position: relative; z-index: 999; /* 极高层级，绝对不会被阻挡 */
}

.publish-button-container {
  pointer-events: auto !important;
}

.premium-publish-btn {
  background: var(--primary-gradient);
  border: none;
  color: #fff;
  padding: 0.8rem 1.8rem;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: auto !important;
}

.premium-publish-btn:hover {
  transform: translateY(-3px) scale(1.05);
  filter: brightness(1.1);
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.5);
}

.premium-publish-btn:active { transform: scale(0.95); }

/* 悬浮发布球样式 */
.floating-publish-ball {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 70px;
  height: 70px;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 15px 35px rgba(99, 102, 241, 0.5);
  cursor: pointer;
  z-index: 1000; /* 全局最顶层 */
  transition: all 0.3s;
}

.floating-publish-ball:hover { transform: scale(1.1) rotate(90deg); }

.header-info h1 { font-size: 3.5rem; margin-bottom: 0px; }
.header-info p { color: var(--text-secondary); font-size: 1.2rem; }
.toy-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2.5rem; margin-top: 3rem; }
.toy-card { padding: 1.5rem; transition: all 0.4s ease; text-align: center; }
.toy-card.clickable { cursor: pointer; }
.toy-image { width: 100%; aspect-ratio: 1; border-radius: 16px; overflow: hidden; background: rgba(255, 255, 255, 0.05); margin-bottom: 1.5rem; }
.toy-image img { width: 100%; height: 100%; object-fit: contain; }
.toy-card:hover { transform: translateY(-10px); border-color: var(--primary-color); }
.tag { color: var(--primary-color); font-size: 0.8rem; background: rgba(99, 102, 241, 0.1); padding: 0.2rem 0.8rem; border-radius: 20px; }
.bg-glow.blob-list { background: var(--primary-gradient); top: 10%; right: -10%; width: 500px; height: 500px; opacity: 0.2; position: absolute; filter: blur(120px); border-radius: 50%; z-index: 1; }
</style>
