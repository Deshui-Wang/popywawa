<template>
  <div class="join-page">
    <main class="join-layout animate-fade-in">
      <!-- 左侧：禁闭岛来信 -->
      <section class="letter-side">
        <div class="letter-box glass-card">
          <h1 class="gradient-text title">禁闭岛的来信</h1>
          
          <div class="monologue-text">
            <p>很抱歉，暂时这里还不对外开放，所以您可能还无法 Join 我们...</p>
            <p>但是你可以留下你的联系方式，最好是小红书、抖音的账号，当然你放了我也不一定看，最好别放微信和手机号，因为我认识的人都经常删，陌生人我可能也不会加。</p>
            <p>那我们怎么才能认识呢？相信我，你不会想认识我的，因为我有很严重的性格缺陷，脾气也很古怪，出了胖脆和我妈几乎没人受得了我，我爸说我我都不听，谁也管不了我，但是如果你非要认识我也行，那就留点啥吧。</p>
          </div>

          <div class="input-section">
            <el-input
              v-model="contact"
              placeholder="小红书/抖音/或者你的代号..."
              class="custom-input"
            />
            
            <div class="emoji-picker">
              <span 
                v-for="e in emojiSlots" 
                :key="e"
                :class="['emoji-item', { active: selectedEmoji === e }]"
                @click="selectedEmoji = e"
              >
                {{ e }}
              </span>
            </div>

            <el-button type="primary" class="submit-btn" @click="handleSubmit">
              提交这段无用的留言
            </el-button>
          </div>
        </div>
      </section>

      <!-- 右侧：秘密存档 -->
      <section class="archives-side">
        <div class="wall-header">
          <h3>秘密存档 (Archives)</h3>
          <!-- 增加一个兜底按钮，双保险 -->
          <el-button 
            v-if="!isAuthorized" 
            link 
            class="backup-unlock-btn" 
            @click="handleOpenAuth"
          >
            解锁库
          </el-button>
          <span v-else class="unlocked-tag animate-fade-in">已进入档案</span>
        </div>

        <div class="messages-list">
          <div 
            v-for="msg in messages" 
            :key="msg.id" 
            class="message-item glass-card"
            @click="handleItemClick"
          >
            <!-- 恢复条目内的结构 -->
            <div class="msg-left">
              <span class="msg-emoji">{{ msg.emoji }}</span>
            </div>
            <div class="msg-main">
              <div class="msg-content-wrapper">
                <span v-if="isAuthorized" class="msg-contact visible pulse-text">{{ msg.contact }}</span>
                <span v-else class="msg-contact hidden">••••••••••</span>
              </div>
              <span class="msg-date">{{ formatDate(msg.created_at) }}</span>
            </div>
          </div>
          <div v-if="messages.length === 0" class="empty-hint">还没有任何存档记录</div>
        </div>
      </section>
    </main>

    <!-- 验证弹层 (修正属性名为 visible，并使用 v-model) -->
    <AuthOverlay 
      v-model:visible="showAuth" 
      @success="onAuthSuccess" 
    />

    <!-- 背景装饰 -->
    <div class="bg-glow blob-join"></div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { ElMessage } from 'element-plus'
import AuthOverlay from '../components/AuthOverlay.vue'

const contact = ref('')
const selectedEmoji = ref('👾')
const emojiSlots = ['😶‍🌫️', '👻', '👾', '👽', '🤖', '👹', '💀', '🤡', '🧶', '🥤', '🪩', '🛸']

const messages = ref([])
const showAuth = ref(false)
const isAuthorized = ref(false)

const fetchMessages = async () => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (!error) {
    messages.value = data
  }
}

const handleSubmit = async () => {
  if (!contact.value) {
    ElMessage.warning('好歹留个名字或者账号吧？')
    return
  }
  
  const { error } = await supabase
    .from('messages')
    .insert([{ contact: contact.value, emoji: selectedEmoji.value }])
  
  if (!error) {
    ElMessage.success('好了，我已经把它存入存档库了。')
    contact.value = ''
    fetchMessages()
  }
}

const handleItemClick = () => {
  if (isAuthorized.value) return
  handleOpenAuth()
}

const handleOpenAuth = () => {
  // 增加强制反馈，帮助定位问题
  ElMessage.info({
    message: '正在唤起权限验证...',
    duration: 1000,
    offset: 100
  })
  showAuth.value = true
}

const onAuthSuccess = () => {
  showAuth.value = false
  isAuthorized.value = true
}

const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toISOString().split('T')[0]
}

onMounted(() => {
  isAuthorized.value = false
  fetchMessages()
})
</script>

<style scoped>
.join-page { width: 100%; min-height: 100vh; padding: 4rem 2rem; position: relative; }
.join-layout {
  max-width: 1200px; margin: 0 auto;
  display: flex; gap: 3rem; align-items: flex-start;
  position: relative; z-index: 10;
}

/* 左侧样式 */
.letter-side { flex: 1; max-width: 700px; }
.letter-box { padding: 3rem; border-radius: 30px; }
.title { font-size: 2.2rem; margin-bottom: 2rem; }
.monologue-text { line-height: 1.8; color: #cbd5e1; font-size: 1.1rem; margin-bottom: 2rem; }
.monologue-text p { margin-bottom: 1rem; }

/* 右侧样式 */
.archives-side { 
  flex: 1; 
  min-width: 320px; 
  position: relative; 
  z-index: 50; 
}

.wall-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 2rem; 
}

.wall-header h3 { color: var(--text-secondary); }
.unlocked-tag { color: var(--primary-color); font-size: 0.8rem; font-weight: 600; }
.backup-unlock-btn { color: var(--primary-color) !important; font-size: 0.8rem !important; }

.messages-list { display: grid; gap: 1rem; position: relative; }

.message-item {
  padding: 1.2rem; 
  display: flex; 
  align-items: center; 
  gap: 1.2rem;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.message-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--primary-color) !important;
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.msg-emoji { font-size: 1.5rem; }
.msg-main { display: flex; flex-direction: column; gap: 0.3rem; }
.msg-date { color: var(--text-secondary); font-size: 0.75rem; }

.msg-contact.visible { color: var(--primary-color); font-weight: 600; font-size: 1rem; }
.msg-contact.hidden { color: rgba(255, 255, 255, 0.2); letter-spacing: 2px; font-size: 0.9rem; }

.empty-hint { text-align: center; color: var(--text-secondary); padding: 4rem 2rem; border: 1px dashed rgba(255,255,255,0.1); border-radius: 20px; }

.custom-input :deep(.el-input__wrapper) {
  background: rgba(0,0,0,0.3) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  border-radius: 12px;
}

.emoji-picker { display: flex; flex-wrap: wrap; gap: 0.8rem; margin: 1.5rem 0; }
.emoji-item { font-size: 1.6rem; cursor: pointer; transition: all 0.3s; padding: 5px; border-radius: 8px; }
.emoji-item:hover, .emoji-item.active { background: rgba(255,255,255,0.1); transform: scale(1.1); }

.submit-btn { width: 100%; height: 45px !important; border-radius: 12px !important; }

.bg-glow.blob-join {
  background: var(--primary-gradient);
  top: 50%; left: 50%; width: 1000px; height: 1000px; opacity: 0.05;
  position: absolute; filter: blur(150px); transform: translate(-50%, -50%);
  z-index: -1 !important; /* 彻底打入底层 */
  pointer-events: none !important; /* 彻底禁疗点击 */
}

@media (max-width: 1024px) {
  .join-layout { flex-direction: column; align-items: center; }
  .letter-side { width: 100%; }
  .archives-side { width: 100%; min-width: auto; }
}
</style>
