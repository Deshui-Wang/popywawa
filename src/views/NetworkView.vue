<template>
  <div class="network-page full-screen-mode">
    <!-- 全屏网络画布 -->
    <main 
      class="network-canvas" 
      ref="canvasRef" 
      @wheel="handleWheel"
      @pointerdown="startPan"
    >
      <svg width="100%" height="100%" :viewBox="`0 0 ${viewBox.w} ${viewBox.h}`">
        <!-- 定义渐变、网格和箭头 -->
        <defs>
          <pattern id="grid" :width="60 * viewState.k" :height="60 * viewState.k" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.05)" />
          </pattern>
          <linearGradient id="card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color: rgba(255,255,255,0.12)" />
            <stop offset="100%" style="stop-color: rgba(255,255,255,0.05)" />
          </linearGradient>
          <!-- 连线流动的小球 -->
          <radialGradient id="flow-dot-grad">
            <stop offset="0%" stop-color="#fff" />
            <stop offset="100%" stop-color="rgba(99, 102, 241, 0)" />
          </radialGradient>
        </defs>

        <!-- 背景点阵 (固定在背景) -->
        <rect width="100%" height="100%" fill="url(#grid)" />

        <!-- 所有的图表元素都在这个平移缩放组内 -->
        <g :transform="`translate(${viewState.x}, ${viewState.y}) scale(${viewState.k})`">
          <!-- 连线层 -->
          <g class="links">
            <g v-for="(link, i) in links" :key="'link-group-'+i">
              <path
                :id="'path-'+i"
                :d="getSmoothPath(link)"
                :stroke="link.color || 'rgba(255,255,255,0.1)'"
                stroke-width="1.5"
                fill="none"
                class="link-path"
              />
              <circle r="3" fill="url(#flow-dot-grad)" class="flow-dot">
                <animateMotion :dur="link.speed || '3s'" repeatCount="indefinite">
                  <mpath :xlink:href="'#path-'+i" />
                </animateMotion>
              </circle>
              <text class="link-label" dy="-8">
                <textPath :xlink:href="'#path-'+i" startOffset="50%" text-anchor="middle">
                  {{ link.label }}
                </textPath>
              </text>
            </g>
          </g>

          <!-- 节点层 -->
          <g class="nodes">
            <g
              v-for="node in nodes"
              :key="node.id"
              :transform="`translate(${node.x}, ${node.y})`"
              class="node-group"
              @pointerdown.stop="startDrag($event, node)"
            >
              <!-- 容器型节点 (Radis-Master) -->
              <template v-if="node.type === 'container'">
                <rect :width="node.w" :height="node.h" rx="20" class="node-card-bg" />
                <rect width="40" height="40" rx="10" x="10" y="10" class="node-icon-box" :class="node.status" />
                <text x="30" y="30" class="node-icon-text" text-anchor="middle">{{ node.status === 'minus' ? '-' : '+' }}</text>
                <text x="65" y="36" class="node-title">{{ node.name }}</text>
                
                <g v-for="(item, idx) in node.items" :key="idx" :transform="`translate(20, ${60 + idx * 80})`">
                  <rect width="200" height="60" rx="12" class="node-item-bg" />
                  <rect width="24" height="24" rx="6" x="10" y="18" fill="#3b82f6" />
                  <text x="22" y="34" class="item-icon-plus" text-anchor="middle">+</text>
                  <text x="45" y="32" class="item-name">{{ item.name }}</text>
                  <text x="45" y="50" class="item-value">{{ item.value }} ↗</text>
                </g>
              </template>

              <!-- 服务型节点 -->
              <template v-else-if="node.type === 'service'">
                <rect :width="node.w" :height="node.h" rx="12" class="node-service-bg" />
                <rect width="24" height="24" rx="6" x="8" y="8" :fill="node.color || '#10b981'" />
                <text x="20" y="24" class="item-icon-plus" text-anchor="middle">+</text>
                <text x="40" y="24" class="service-name">{{ node.name }}</text>
                <text x="40" y="45" class="service-value">{{ node.value }} ↗</text>
              </template>

              <!-- 图标型节点 -->
              <template v-else-if="node.type === 'icon'">
                <path d="M25 5 L45 15 L45 35 Q45 45 25 55 Q5 45 5 35 L5 15 Z" fill="#3b82f6" opacity="0.8" />
                <circle cx="25" cy="30" r="8" fill="none" stroke="#fff" stroke-width="2" />
                <circle cx="25" cy="30" r="2" fill="#fff" />
              </template>
            </g>
          </g>
        </g>
      </svg>
    </main>

    <!-- 控制台面板 -->
    <aside class="floating-panel glass-card" v-if="isPanelOpen">
      <div class="panel-header">
        <h2 class="gradient-text">网络拓扑推演</h2>
        <p>系统流量实时监控模拟</p>
      </div>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="label">活跃节点</span>
          <span class="value">{{ nodes.length }}</span>
        </div>
        <div class="stat-item">
          <span class="label">当前缩放</span>
          <span class="value">{{ Math.round(viewState.k * 100) }}%</span>
        </div>
      </div>
      <div class="instruction-tips">
        💡 鼠标拖拽背景平移，滚轮缩放
      </div>
      <el-button type="primary" size="small" class="reset-btn" @click="resetView">
        复位视图
      </el-button>
    </aside>

    <div class="bg-glow blob-1"></div>
    <div class="bg-glow blob-2"></div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'

const isPanelOpen = ref(true)
const viewBox = reactive({ w: 1400, h: 800 })

// 画布视图状态
const viewState = reactive({
  x: 0,
  y: 0,
  k: 1
})

// 模拟节点数据 (保持不变)
const nodes = ref([
  { id: 'master-1', name: 'Radis-Master', type: 'container', status: 'minus', x: 100, y: 200, w: 240, h: 220, items: [{ name: 'US-east-1b', value: '150 kbps' }, { name: 'US-east-1b', value: '150 kbps' }] },
  { id: 'shield-1', name: 'Security', type: 'icon', x: 500, y: 50, w: 50, h: 60 },
  { id: 'service-1', name: 'sdkclient.eng...', type: 'service', color: '#10b981', x: 450, y: 250, w: 160, h: 60, value: '150 kbps' },
  { id: 'service-2', name: 'aws-ssm.co...', type: 'service', color: '#3b82f6', x: 450, y: 450, w: 160, h: 60, value: '150 kbps' },
  { id: 'master-2', name: 'Radis-Master', type: 'container', status: 'minus', x: 800, y: 200, w: 240, h: 220, items: [{ name: 'US-east-1b', value: '150 kbps' }, { name: 'US-east-1b', value: '150 kbps' }] },
  { id: 'master-3', name: 'Radis-Master', type: 'container', status: 'minus', x: 1150, y: 200, w: 240, h: 220, items: [{ name: 'US-east-1b', value: '150 kbps' }, { name: 'US-east-1b', value: '150 kbps' }] }
])

const links = ref([
  { source: 'master-1', target: 'service-1', label: '23 kbps', color: 'rgba(255,255,255,0.2)' },
  { source: 'master-1', target: 'service-2', label: '23 kbps', color: 'rgba(255,255,255,0.2)' },
  { source: 'shield-1', target: 'service-1', label: '0 kbps', color: '#10b981', speed: '5s' },
  { source: 'service-1', target: 'master-2', label: '23 kbps', color: 'rgba(255,255,255,0.2)' },
  { source: 'service-2', target: 'master-2', label: '23 kbps', color: '#f472b6', speed: '2s' },
  { source: 'master-2', target: 'master-3', label: '77 kbps', color: 'rgba(255,255,255,0.2)' },
  { source: 'master-2', target: 'master-3', label: '5 kbps', color: 'rgba(255,255,255,0.2)' },
  { source: 'master-2', target: 'master-3', label: '37 kbps', color: 'rgba(255,255,255,0.2)' },
  { source: 'shield-1', target: 'master-3', label: '13 kbps', color: 'rgba(255,255,255,0.1)', speed: '8s' }
])

const canvasRef = ref(null)
let draggingNode = null

const getNodeById = (id) => nodes.value.find(n => n.id === id)

const getSmoothPath = (link) => {
  const s = getNodeById(link.source)
  const t = getNodeById(link.target)
  if (!s || !t) return ''
  const x1 = s.x + (s.w || 50); const y1 = s.y + (s.h || 60) / 2
  const x2 = t.x; const y2 = t.y + (t.h || 60) / 2
  const dx = Math.abs(x2 - x1) / 2
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
}

// 节点拖拽
const startDrag = (event, node) => {
  event.preventDefault()
  draggingNode = node
  const onMove = (e) => {
    if (!draggingNode) return
    // 考虑当前缩放比例计算位移
    draggingNode.x += e.movementX / viewState.k
    draggingNode.y += e.movementY / viewState.k
  }
  const onUp = () => {
    draggingNode = null
    window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp)
  }
  window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp)
}

// 画布平移
const startPan = (event) => {
  if (draggingNode) return
  const onMove = (e) => {
    viewState.x += e.movementX
    viewState.y += e.movementY
  }
  const onUp = () => {
    window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp)
  }
  window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp)
}

// 画布缩放
const handleWheel = (event) => {
  event.preventDefault()
  const zoomFactor = 0.05
  const direction = event.deltaY > 0 ? -1 : 1
  const newScale = Math.max(0.2, Math.min(3, viewState.k + direction * zoomFactor))
  
  // 以鼠标位置为中心缩放
  const rect = canvasRef.value.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top
  
  const oldScale = viewState.k
  const ratio = newScale / oldScale
  
  viewState.x = mouseX - (mouseX - viewState.x) * ratio
  viewState.y = mouseY - (mouseY - viewState.y) * ratio
  viewState.k = newScale
}

const resetView = () => {
  viewState.x = 0; viewState.y = 0; viewState.k = 1
}

onMounted(() => {
  const rect = canvasRef.value.getBoundingClientRect()
  viewBox.w = rect.width; viewBox.h = rect.height
})
</script>

<style scoped>
.network-page {
  position: fixed; top: 80px; left: 0; right: 0; bottom: 0;
  background: #0d1117; overflow: hidden;
}

.network-canvas { width: 100%; height: 100%; cursor: grab; }
.network-canvas:active { cursor: grabbing; }

/* 节点卡片样式 (保持不变) */
.node-group { cursor: grab; }
.node-group:active { cursor: grabbing; }
.node-card-bg { fill: rgba(255, 255, 255, 0.03); stroke: rgba(255, 255, 255, 0.1); stroke-width: 1; backdrop-filter: blur(10px); }
.node-icon-box { fill: #3b82f6; }
.node-icon-text { fill: #fff; font-size: 24px; font-weight: bold; pointer-events: none; }
.node-title { fill: #fff; font-size: 16px; font-weight: 600; pointer-events: none; }
.node-item-bg { fill: rgba(255, 255, 255, 0.05); stroke: rgba(255, 255, 255, 0.05); }
.item-icon-plus { fill: #fff; font-size: 18px; pointer-events: none; }
.item-name { fill: #fff; font-size: 14px; pointer-events: none; }
.item-value { fill: #94a3b8; font-size: 12px; pointer-events: none; }
.node-service-bg { fill: rgba(255, 255, 255, 0.03); stroke: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); }
.service-name { fill: #fff; font-size: 13px; font-weight: 500; pointer-events: none; }
.service-value { fill: #94a3b8; font-size: 11px; pointer-events: none; }

/* 连线与动效 (保持不变) */
.link-path { transition: stroke 0.3s; }
.link-label { fill: #64748b; font-size: 11px; font-weight: 400; pointer-events: none; }

/* 控制面板优化 */
.floating-panel { position: absolute; top: 1.5rem; left: 1.5rem; width: 260px; padding: 1.5rem; z-index: 100; border-radius: 24px; }
.panel-header h2 { font-size: 1.2rem; margin-bottom: 0.2rem; }
.panel-header p { color: #64748b; font-size: 0.8rem; }
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; }
.stat-item { display: flex; flex-direction: column; }
.stat-item .label { color: #64748b; font-size: 0.75rem; }
.stat-item .value { color: #fff; font-size: 1.2rem; font-weight: 600; }
.instruction-tips { margin-top: 1rem; padding-top: 0.8rem; border-top: 1px solid rgba(255,255,255,0.05); color: #3b82f6; font-size: 0.75rem; }

.reset-btn { width: 100%; margin-top: 1rem; border-radius: 12px; }

/* 背景光晕 (保持不变) */
.bg-glow { position: absolute; border-radius: 50%; filter: blur(120px); z-index: 0; opacity: 0.15; }
.blob-1 { width: 600px; height: 600px; background: #6366f1; top: -10%; right: -5%; }
.blob-2 { width: 500px; height: 500px; background: #ec4899; bottom: -5%; left: 10%; }
</style>


