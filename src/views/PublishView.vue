<template>
  <div class="publish-page animate-fade-in">
    <header class="header-nav">
      <el-button @click="router.push('/')" class="back-btn" link>
        <ArrowLeft :size="20" /> <span>取消发布</span>
      </el-button>
    </header>

    <main class="publish-container glass-card">
      <div class="form-header">
        <h1 class="gradient-text">发布新品</h1>
        <p>每一款潮玩都有它的故事，让世界看到你的新藏品。</p>
      </div>

      <el-form :model="form" label-position="top" class="custom-form">
        <div class="form-row">
          <el-form-item label="藏品名称">
            <el-input v-model="form.name" placeholder="请输入玩偶名称" class="glass-input" />
          </el-form-item>
          <el-form-item label="所属品牌">
            <el-select v-model="form.brand" placeholder="选择品牌" class="glass-select">
              <el-option label="POPMART" value="popmart" />
              <el-option label="LEGO" value="lego" />
              <el-option label="问童子" value="wentongzi" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="所属系列">
          <el-input v-model="form.series" placeholder="例如：The Monsters / Space Molly" class="glass-input" />
        </el-form-item>

        <el-form-item label="上传展示图">
          <div class="upload-area glass-card">
            <div class="upload-hint">
              <Plus :size="32" />
              <span>拖拽图片或点击上传</span>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="藏品描述">
          <el-input v-model="form.desc" type="textarea" :rows="4" placeholder="讲述一下这款藏品的独特魅力..." class="glass-input" />
        </el-form-item>

        <div class="form-actions">
          <el-button type="primary" size="large" round class="submit-btn" @click="handlePublish">
            确认发布 ✨
          </el-button>
        </div>
      </el-form>
    </main>

    <!-- Background Decoration -->
    <div class="bg-glow blob-publish"></div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Plus } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const router = useRouter()

const form = reactive({
  name: '',
  brand: '',
  series: '',
  desc: ''
})

const handlePublish = () => {
  ElMessage.success('发布功能已模拟成功！数据已进入云端预览。')
  setTimeout(() => router.push('/'), 1500)
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
  height: 200px;
  border: 2px dashed rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover { border-color: var(--primary-color); background: rgba(255, 255, 255, 0.05); }
.upload-hint { display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--text-secondary); }

.submit-btn {
  width: 100%;
  margin-top: 2rem;
  padding: 1.5rem !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  background: var(--primary-gradient) !important;
  border: none !important;
}

.bg-glow.blob-publish {
  background: var(--primary-color);
  top: 50%;
  right: -20%;
  width: 500px;
  height: 500px;
  opacity: 0.1;
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
