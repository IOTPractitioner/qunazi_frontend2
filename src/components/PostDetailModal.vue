<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 class="text-lg font-bold text-gray-900">帖子详情</h3>
        <button 
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <X :size="20" class="text-gray-600" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 overflow-y-auto max-h-96">
        <!-- User Info -->
        <div class="flex items-center space-x-3 mb-4">
          <img
            :src="post.user.avatar"
            :alt="post.user.name"
            class="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div class="flex items-center space-x-1">
              <h4 class="font-semibold text-gray-900">{{ post.user.name }}</h4>
              <div 
                v-if="post.user.verified"
                class="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <p class="text-sm text-gray-500">{{ post.timestamp }}</p>
          </div>
        </div>

        <!-- Paid Post Info -->
        <div v-if="post.isPaid" class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-4 border border-yellow-200">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Gem :size="16" class="text-white" />
              </div>
              <div>
                <h4 class="font-bold text-gray-900">付费内容</h4>
                <p class="text-sm text-gray-600">解锁后可查看完整内容</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-gray-900">{{ post.price }}</p>
              <p class="text-sm text-gray-600">💎 钻石</p>
            </div>
          </div>

          <!-- User Balance -->
          <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div class="flex items-center space-x-1">
              <Wallet :size="16" />
              <span>我的余额: {{ userStore.user?.diamonds || 0 }} 💎</span>
            </div>
            <span :class="canPurchase ? 'text-green-600' : 'text-red-600'">
              {{ canPurchase ? '余额充足' : '余额不足' }}
            </span>
          </div>

          <!-- Benefits -->
          <div class="space-y-2 mb-4">
            <h5 class="font-semibold text-gray-900">购买后可享受:</h5>
            <div class="flex items-center space-x-2 text-sm text-gray-700">
              <Check :size="16" class="text-green-500" />
              <span>查看完整帖子内容</span>
            </div>
            <div class="flex items-center space-x-2 text-sm text-gray-700">
              <Check :size="16" class="text-green-500" />
              <span>参与评论和互动</span>
            </div>
            <div class="flex items-center space-x-2 text-sm text-gray-700">
              <Check :size="16" class="text-green-500" />
              <span>永久访问权限</span>
            </div>
          </div>

          <!-- Purchase Button -->
          <button
            @click="handlePurchase"
            :disabled="!canPurchase"
            :class="[
              'w-full py-3 px-4 rounded-xl font-bold transition-all duration-200',
              canPurchase
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            {{ canPurchase ? '立即购买' : '钻石不足' }}
          </button>

          <!-- Recharge Button -->
          <button
            v-if="!canPurchase"
            @click="handleRecharge"
            class="w-full mt-3 py-2 px-4 border border-blue-500 text-blue-500 rounded-xl hover:bg-blue-50 transition-colors duration-200"
          >
            充值钻石
          </button>
        </div>

        <!-- Content Preview -->
        <div class="bg-gray-50 rounded-xl p-4">
          <h5 class="font-semibold text-gray-900 mb-3">内容预览</h5>
          <div class="relative">
            <!-- Blurred Preview -->
            <div class="filter blur-sm select-none">
              <p class="text-gray-700 leading-relaxed mb-3">
                {{ post.content.substring(0, 50) }}...
              </p>
              <div v-if="post.image" class="w-full h-32 bg-gray-200 rounded-lg"></div>
            </div>
            
            <!-- Overlay -->
            <div class="absolute inset-0 bg-white/60 flex items-center justify-center">
              <div class="text-center">
                <Lock :size="24" class="text-gray-400 mx-auto mb-2" />
                <p class="text-sm text-gray-600">购买后查看完整内容</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { X, Gem, Wallet, Check, Lock } from 'lucide-vue-next'
import { useUserStore } from '../stores/userStore'
import type { Post } from '../types'

interface Props {
  post: Post
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  'purchase-success': [post: Post]
}>()

const router = useRouter()
const userStore = useUserStore()

const canPurchase = computed(() => {
  return (userStore.user?.diamonds || 0) >= (props.post.price || 0)
})

const handlePurchase = async () => {
  if (!canPurchase.value || !props.post.price) return

  try {
    // 扣除钻石
    const success = userStore.spendDiamonds(props.post.price)
    
    if (success) {
      // 添加购买记录
      userStore.addPostPurchase(props.post.id)
      
      // 触发购买成功事件
      emit('purchase-success', props.post)
      emit('close')
      
      console.log('Successfully purchased post:', props.post.id)
    } else {
      alert('钻石不足，请先充值')
    }
  } catch (error) {
    console.error('Purchase failed:', error)
    alert('购买失败，请重试')
  }
}

const handleRecharge = () => {
  emit('close')
  router.push({ name: 'recharge' })
}
</script>