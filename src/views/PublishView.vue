<template>
  <div class="publish-page animate-fade-in">
    <header class="header-nav">
      <el-button @click="router.back()" class="back-btn" link>
        <ArrowLeft :size="20" /> <span>取消{{ isStoryMode ? '写故事' : '发布' }}</span>
      </el-button>
    </header>

    <main class="publish-container glass-card">
      <div class="form-header">
        <h1 class="gradient-text">{{ isStoryMode ? '记录故事' : '发布新品' }}</h1>
        <p>{{ isStoryMode ? '每一个潮玩背后，都藏着一段动人的心路历程。' : '每一款潮玩都有它的故事，让世界看到你的新藏品。' }}</p>
      </div>

      <el-form :model="form" label-position="top" class="custom-form">
        <el-form-item :label="isStoryMode ? '故事标题' : '藏品名称'">
          <el-input v-model="form.title" :placeholder="isStoryMode ? '起一个动人的标题' : '请输入名称'" class="glass-input" />
        </el-form-item>

        <el-form-item v-if="!isStoryMode" label="上传展示图">
          <div class="upload-area glass-card" @click="handleFileClick">
            <input 
              type="file" 
              ref="fileInput" 
              class="hidden-input" 
              accept="image/*" 
              @change="handleFileChange" 
            />
            
            <div v-if="!previewUrl" class="upload-hint">
              <Plus :size="32" />
              <span>拖拽图片或点击上传</span>
            </div>

            <div v-else class="preview-container animate-fade-in">
              <img :src="previewUrl" class="upload-preview" />
              <div class="re-upload-overlay">
                <Plus :size="24" /> <span>更换图片</span>
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item :label="isStoryMode ? '正文内容' : '藏品描述'">
          <el-input v-model="form.content" type="textarea" :rows="isStoryMode ? 10 : 4" :placeholder="isStoryMode ? '在这里分享你的故事细节...' : '讲述一下这款藏品的独特魅力...'" class="glass-input" />
        </el-form-item>

        <div class="form-actions">
          <el-button type="primary" size="large" round class="submit-btn" @click="handlePublish">
            确认{{ isStoryMode ? '发布故事' : '发布' }} ✨
          </el-button>
        </div>
      </el-form>
    </main>

    <!-- Background Decoration -->
    <div class="bg-glow blob-publish"></div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Plus } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

import { useToyStore } from '../store/toyStore'

const router = useRouter()
const route = useRoute()
const toyStore = useToyStore()

const isStoryMode = computed(() => route.query.mode === 'story')
const fileInput = ref(null)
const selectedFile = ref(null) // 存储真实文件对象
const previewUrl = ref(null)

const form = reactive({
  title: '',
  content: ''
})

const handleFileClick = () => {
  fileInput.value.click()
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file // 保存文件
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = URL.createObjectURL(file)
  }
}

const handlePublish = async () => {
  if (!form.title || (!isStoryMode.value && !selectedFile.value)) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (isStoryMode.value) {
    await toyStore.addStory({
      title: form.title,
      excerpt: form.content
    })
  } else {
    // 传入文件对象
    await toyStore.addToy({
      name: form.title,
      imageFile: selectedFile.value,
      desc: form.content,
      brand: route.params.brandId,
      series: route.query.series
    })
  }

  ElMessage.success(isStoryMode.value ? '故事发布成功！' : '新品发布成功！')
  setTimeout(() => router.back(), 1500)
}
</script>

<style scoped>
.publish-page { width: 100%; max-width: 800px; padding: 2rem 0; margin: 0 auto; }
.header-nav { margin-bottom: 2rem; }
.back-btn { color: var(--text-secondary) !important; }

.publish-container { padding: 3rem; position: relative; z-index: 10; }
.form-header { margin-bottom: 3rem; text-align: center; }
.form-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
.form-header p { color: var(--text-secondary); }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }

.upload-area {
  width: 100%;
  height: 240px;
  border: 2px dashed rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.hidden-input { display: none; }

.upload-area:hover { border-color: var(--primary-color); background: rgba(255, 255, 255, 0.05); }
.upload-hint { display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--text-secondary); }

.preview-container { width: 100%; height: 100%; position: relative; }
.upload-preview { width: 100%; height: 100%; object-fit: contain; padding: 20px; }

.re-upload-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  gap: 10px; color: #fff; opacity: 0;
  transition: opacity 0.3s;
}

.preview-container:hover .re-upload-overlay { opacity: 1; }

.submit-btn {
  width: 100%;
  margin-top: 2rem;
  padding: 1.5rem !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
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

.bg-glow.blob-publish {
  background: var(--primary-color);
  bottom: -20%;
  right: -10%;
  width: 600px;
  height: 600px;
  opacity: 0.15;
}

/* 深色输入框覆盖 */
:deep(.el-input__wrapper), :deep(.el-textarea__inner), :deep(.el-select__wrapper) {
  background-color: rgba(255, 255, 255, 0.05) !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 0.1rem 1rem !important;
}

:deep(.el-form-item__label) {
  color: var(--text-primary) !important;
  font-weight: 600 !important;
  margin-bottom: 8px !important;
}
</style>
