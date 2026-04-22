<template>
  <Transition name="fade">
    <div v-if="visible" class="auth-overlay">
      <div class="auth-modal glass-card animate-scale-in">
        <div class="glow-edge"></div>
        <div class="auth-content">
          <div class="auth-icon-wrapper">
            <Lock :size="32" class="lock-icon" />
          </div>
          <h2>身份校验</h2>
          <p>请输入 6 位授权密码以进入发布模式</p>
          
          <div class="passcode-container">
            <input 
              v-model="password" 
              type="password" 
              maxlength="6" 
              placeholder="••••••"
              class="passcode-input"
              @keyup.enter="verify"
              autofocus
            />
          </div>

          <div class="auth-actions">
            <el-button @click="close" class="cancel-btn" link>取消</el-button>
            <el-button type="primary" round class="verify-btn" @click="verify" :loading="loading">
              验证并进入
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { Lock } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const props = defineProps(['visible'])
const emit = defineEmits(['update:visible', 'success'])

const password = ref('')
const loading = ref(false)

const verify = () => {
  if (password.value === '112026') {
    loading.value = true
    setTimeout(() => {
      emit('success')
      close()
      loading.value = false
    }, 800)
  } else {
    ElMessage.error('授权密码错误')
    password.value = ''
  }
}

const close = () => {
  emit('update:visible', false)
  password.value = ''
}
</script>

<style scoped>
.auth-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-modal {
  width: 100%;
  max-width: 420px;
  padding: 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glow-edge {
  position: absolute;
  top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
  animation: scanning 3s linear infinite;
}

.auth-icon-wrapper {
  width: 64px;
  height: 64px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.lock-icon { color: var(--primary-color); }

h2 { font-size: 1.8rem; margin-bottom: 0.5rem; color: #fff; }
p { color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.9rem; }

.passcode-container { margin-bottom: 2.5rem; }

.passcode-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  color: #fff;
  font-size: 2rem;
  text-align: center;
  letter-spacing: 1.2rem;
  outline: none;
  transition: all 0.3s;
}

.passcode-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
  background: rgba(255, 255, 255, 0.1);
}

.auth-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.verify-btn {
  padding: 1.2rem 2.5rem !important;
  background: var(--primary-gradient) !important;
  border: none !important;
}

.cancel-btn { color: var(--text-secondary) !important; }

@keyframes scanning {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-scale-in {
  animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
