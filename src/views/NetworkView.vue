<template>
  <div class="network-page full-screen-mode">
    <!-- 全屏推演画布 -->
    <main class="network-canvas" ref="canvasRef">
      <svg width="100%" height="100%" :viewBox="`0 0 ${viewBox.w} ${viewBox.h}`">
        <!-- 网格背景纹理 -->
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
          </pattern>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="24" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="rgba(99, 102, 241, 0.6)" />
          </marker>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <!-- 连线层 -->
        <g class="links">
          <line
            v-for="(link, i) in links"
            :key="'link-'+i"
            :x1="getNodeById(link.source).x"
            :y1="getNodeById(link.source).y"
            :x2="getNodeById(link.target).x"
            :y2="getNodeById(link.target).y"
            stroke="rgba(99, 102, 241, 0.5)"
            stroke-width="2"
            marker-end="url(#arrowhead)"
          />
        </g>

        <!-- 证据节点层 -->
        <g class="nodes">
          <g
            v-for="node in nodes"
            :key="node.id"
            :transform="`translate(${node.x}, ${node.y})`"
            class="node-group"
            @pointerdown="startDrag($event, node)"
            @click="handleNodeClick(node)"
          >
            <circle
              r="24"
              :class="['node-circle', node.type, { active: selectedNode === node }]"
            />
            <text dy="45" text-anchor="middle" class="node-label">
              {{ node.name }}
            </text>
          </g>
        </g>
      </svg>
    </main>

    <!-- 悬浮展开按钮 -->
    <Transition name="fade">
      <el-button 
        v-if="!isPanelOpen"
        type="primary" 
        circle 
        class="floating-expand-btn"
        @click="isPanelOpen = true"
      >
        <Plus :size="24" />
      </el-button>
    </Transition>

    <!-- 悬浮侧边控制面板 (浮窗) -->
    <Transition name="slide">
      <aside v-if="isPanelOpen" class="floating-panel glass-card">
        <div class="panel-header">
          <div class="header-main">
            <h2 class="gradient-text">证据推演</h2>
            <el-button link @click="isPanelOpen = false">
              <ChevronLeft :size="20" />
            </el-button>
          </div>
          <p>真相拼图模式</p>
        </div>

        <el-form :model="nodeForm" label-position="top">
          <el-form-item label="证据名称">
            <el-input v-model="nodeForm.name" placeholder="发现了什么？" class="glass-input" />
          </el-form-item>
          
          <el-form-item label="证据类型">
            <el-select v-model="nodeForm.type" class="glass-select">
              <el-option label="🔑 核心物证" value="physical" />
              <el-option label="🎙️ 证人证言" value="testimony" />
              <el-option label="💾 电子数据" value="digital" />
              <el-option label="🧠 逻辑推论" value="logic" />
            </el-select>
          </el-form-item>

          <el-button type="primary" class="add-btn" @click="addNode">
            记录存档
          </el-button>
        </el-form>

        <div class="relation-divider"></div>
        <div class="stats-box">
          {{ nodes.length }} 证据 / {{ links.length }} 关联
        </div>

        <div class="instruction-mini">
          💡 点击两个节点建立逻辑指向
        </div>
      </aside>
    </Transition>

    <div class="bg-glow blob-network"></div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { Plus, ChevronLeft } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const isPanelOpen = ref(true)
const viewBox = reactive({ w: 1200, h: 800 })

const nodes = ref([
  { id: 'ev-1', name: '核心事件', type: 'logic', x: 600, y: 400 },
  { id: 'ev-2', name: '监控录像', type: 'digital', x: 450, y: 300 },
  { id: 'ev-3', name: '染血的衬衫', type: 'physical', x: 750, y: 300 }
])

const links = ref([
  { source: 'ev-2', target: 'ev-1' },
  { source: 'ev-3', target: 'ev-1' }
])

const nodeForm = reactive({ name: '', type: 'physical' })
const selectedNode = ref(null)
const canvasRef = ref(null)
let draggingNode = null
let hasMoved = false
let startX = 0, startY = 0

const getNodeById = (id) => nodes.value.find(n => n.id === id) || { x: 0, y: 0 }

const addNode = () => {
  if (!nodeForm.name) return ElMessage.warning('请输入证据名称')
  nodes.value.push({
    id: 'ev-' + Date.now(),
    name: nodeForm.name,
    type: nodeForm.type,
    x: 400 + Math.random() * 400,
    y: 300 + Math.random() * 200
  })
  nodeForm.name = ''
  ElMessage.success('证据已存入档案')
}

const handleNodeClick = (node) => {
  if (hasMoved) return
  if (selectedNode.value && selectedNode.value.id !== node.id) {
    const sId = selectedNode.value.id
    const tId = node.id
    if (!links.value.find(l => (l.source === sId && l.target === tId))) {
      links.value.push({ source: sId, target: tId })
    }
    selectedNode.value = null
  } else {
    selectedNode.value = node === selectedNode.value ? null : node
  }
}

const startDrag = (event, node) => {
  event.preventDefault()
  draggingNode = node
  hasMoved = false
  startX = event.clientX; startY = event.clientY
  const onMove = (e) => {
    if (!draggingNode) return
    if (Math.abs(e.clientX - startX) > 3 || Math.abs(e.clientY - startY) > 3) hasMoved = true
    const rect = canvasRef.value.getBoundingClientRect()
    draggingNode.x += e.movementX * (viewBox.w / rect.width)
    draggingNode.y += e.movementY * (viewBox.h / rect.height)
  }
  const onUp = () => {
    draggingNode = null
    window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp)
  }
  window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp)
}

onMounted(() => {
  const rect = canvasRef.value.getBoundingClientRect()
  viewBox.w = rect.width
  viewBox.h = rect.height
})
</script>

<style scoped>
.network-page {
  position: fixed; top: 80px; left: 0; right: 0; bottom: 0;
  overflow: hidden; background: #0a0a0c;
}

.network-canvas { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }

.floating-panel {
  position: absolute; top: 2rem; left: 2rem;
  width: 300px; padding: 1.5rem; z-index: 100;
  border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
}

.panel-header { margin-bottom: 1.5rem; }
.header-main { display: flex; justify-content: space-between; align-items: center; }
.panel-header h2 { font-size: 1.4rem; }
.panel-header p { color: var(--text-secondary); font-size: 0.8rem; margin-top: 0.2rem; }

.floating-expand-btn {
  position: absolute; top: 2rem; left: 2rem;
  width: 56px !important; height: 56px !important;
  z-index: 100; background: var(--primary-gradient) !important;
  border: none !important; box-shadow: 0 4px 20px rgba(99,102,241,0.4);
}

.add-btn { width: 100%; margin-top: 1rem; }
.stats-box { font-size: 0.8rem; color: var(--text-secondary); text-align: center; }
.instruction-mini { font-size: 0.75rem; color: var(--primary-color); margin-top: 1rem; text-align: center; }

.node-group { cursor: grab; }
.node-circle { transition: all 0.3s; stroke-width: 2; stroke: rgba(255,255,255,0.1); }
.node-circle.physical { fill: #ef4444; filter: drop-shadow(0 0 8px #ef4444); }
.node-circle.testimony { fill: #f59e0b; }
.node-circle.digital { fill: #10b981; }
.node-circle.logic { fill: #3b82f6; }
.node-circle.active { stroke: #fff; stroke-width: 4; r: 28; }
.node-label { fill: #ccc; font-size: 13px; pointer-events: none; }

.bg-glow.blob-network {
  background: var(--primary-gradient); 
  bottom: -30%; right: -20%; width: 800px; height: 800px; 
  opacity: 0.05; position: absolute; filter: blur(140px); z-index: 1;
}

/* 动画效果 */
.slide-enter-active, .slide-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateX(-30px); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

<style scoped>
.network-page {
  display: flex;
  width: 100%;
  height: calc(100vh - 120px);
  max-width: 1400px;
  gap: 2rem;
  padding: 1rem;
  overflow: hidden;
}

.control-panel {
  width: 320px;
  flex-shrink: 0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.panel-header { margin-bottom: 2rem; }
.panel-header h2 { font-size: 1.8rem; margin-bottom: 0.5rem; }
.panel-header p { color: var(--text-secondary); font-size: 0.9rem; }

.add-btn { width: 100%; margin-top: 1rem; height: 45px !important; }

.relation-divider {
  margin: 2rem 0;
  height: 1px;
  background: rgba(255,255,255,0.05);
}

.instructions { color: var(--text-secondary); font-size: 0.85rem; }
.instructions ul { padding-left: 1.2rem; margin-top: 0.5rem; line-height: 1.6; }

.network-canvas {
  flex-grow: 1;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: crosshair;
  position: relative;
  overflow: hidden;
}

.node-group { cursor: grab; transition: transform 0.1s; }
.node-group:active { cursor: grabbing; }

.node-circle {
  transition: all 0.3s cubic-bezier(1,0,0,1);
  stroke-width: 3;
  stroke: rgba(255,255,255,0.1);
}

.node-circle.childhood { fill: #f87171; box-shadow: 0 0 20px #f87171; }
.node-circle.school { fill: #facc15; }
.node-circle.college { fill: #4ade80; }
.node-circle.work { fill: #6366f1; }

.node-circle.active {
  stroke: #fff;
  stroke-width: 5;
  r: 28;
}

.node-label { fill: #fff; font-size: 14px; font-weight: 500; pointer-events: none; }
.node-period-tag { fill: var(--primary-color); font-size: 12px; font-weight: 700; pointer-events: none; }

.bg-glow.blob-network {
  background: var(--primary-gradient);
  bottom: -20%;
  right: -10%;
  width: 800px;
  height: 800px;
  opacity: 0.1;
  position: absolute;
  filter: blur(140px);
  border-radius: 50%;
  z-index: 1;
}

/* 连接线动效 */
.links line {
  stroke-dashoffset: 100;
  animation: dash 10s linear infinite;
}

@keyframes dash {
  to { stroke-dashoffset: 0; }
}
</style>
