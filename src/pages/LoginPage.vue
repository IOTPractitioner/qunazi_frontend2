<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between p-4">
      <button 
        @click="$router.back()"
        class="p-2 hover:bg-white/50 rounded-full transition-colors duration-200"
      >
        <ArrowLeft :size="20" class="text-gray-600" />
      </button>
      
      <h1 class="text-lg font-bold text-gray-900">登录</h1>
      
      <div class="w-10"></div>
    </div>

    <!-- Logo and Welcome -->
    <div class="flex-1 flex flex-col justify-center px-6">
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
          <Users :size="32" class="text-white" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">欢迎回来</h2>
        <p class="text-gray-600">登录后即可发布动态和购买商品</p>
      </div>

      <!-- Login Form -->
      <div class="space-y-4 mb-6">
        <!-- Phone Input -->
        <div class="relative">
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <Phone :size="18" class="text-gray-400" />
            <span class="text-gray-400">+86</span>
          </div>
          <input
            v-model="phoneNumber"
            type="tel"
            placeholder="请输入手机号"
            class="w-full pl-20 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
            maxlength="11"
          />
        </div>

        <!-- Verification Code -->
        <div class="flex space-x-3">
          <div class="flex-1 relative">
            <Shield :size="18" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              v-model="verificationCode"
              type="text"
              placeholder="验证码"
              class="w-full pl-10 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
              maxlength="6"
            />
          </div>
          <button
            @click="sendVerificationCode"
            :disabled="!isPhoneValid || countdown > 0"
            :class="[
              'px-6 py-4 rounded-xl font-medium transition-all duration-200',
              !isPhoneValid || countdown > 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
            ]"
          >
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </button>
        </div>
      </div>

      <!-- Login Button -->
      <button
        @click="handleLogin"
        :disabled="!canLogin"
        :class="[
          'w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 mb-4',
          canLogin
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 active:scale-95 shadow-lg'
            : 'bg-gray-300 cursor-not-allowed'
        ]"
      >
        <div class="flex items-center justify-center space-x-2">
          <LogIn :size="20" />
          <span>登录</span>
        </div>
      </button>

      <!-- Quick Login Options -->
      <div class="text-center mb-6">
        <p class="text-gray-500 text-sm mb-4">或使用以下方式快速登录</p>
        <div class="flex justify-center space-x-4">
          <button class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-200">
            <MessageCircle :size="20" class="text-white" />
          </button>
          <button class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200">
            <Zap :size="20" class="text-white" />
          </button>
          <button class="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors duration-200">
            <Apple :size="20" class="text-white" />
          </button>
        </div>
      </div>

      <!-- Terms -->
      <div class="text-center">
        <p class="text-xs text-gray-500 leading-relaxed">
          登录即表示同意
          <button class="text-blue-600 hover:text-blue-700">《用户协议》</button>
          和
          <button class="text-blue-600 hover:text-blue-700">《隐私政策》</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Users, 
  Phone, 
  Shield, 
  LogIn, 
  MessageCircle, 
  Zap, 
  Apple 
} from 'lucide-vue-next'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const phoneNumber = ref('')
const verificationCode = ref('')
const countdown = ref(0)

const isPhoneValid = computed(() => {
  return /^1[3-9]\d{9}$/.test(phoneNumber.value)
})

const canLogin = computed(() => {
  return isPhoneValid.value && verificationCode.value.length === 6
})

const sendVerificationCode = () => {
  if (!isPhoneValid.value || countdown.value > 0) return
  
  // 模拟发送验证码
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  
  // 模拟验证码（实际应用中不应该这样做）
  setTimeout(() => {
    verificationCode.value = '123456'
  }, 1000)
  
  console.log('发送验证码到:', phoneNumber.value)
}

const handleLogin = async () => {
  if (!canLogin.value) return
  
  try {
    // 模拟登录API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 登录成功，更新用户状态
    userStore.login({
      id: '1',
      name: '小美',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      phone: phoneNumber.value,
      verified: true
    })
    
    // 返回上一页或跳转到发布页面
    const from = router.currentRoute.value.query.from as string
    if (from === 'publish') {
      router.push({ name: 'publish' })
    } else {
      router.back()
    }
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败，请重试')
  }
}
</script>