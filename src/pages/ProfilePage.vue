<template>
  <div class="pb-20 bg-gray-50">
    <!-- Profile Header -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-4 pt-8 pb-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <img
            :src="userStore.user?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop'"
            :alt="userStore.user?.name || 'Profile'"
            class="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
          />
          <div>
            <h2 class="text-xl font-bold text-white">{{ userStore.user?.name || '游客' }}</h2>
            <p class="text-blue-100 text-sm">ID: {{ userStore.user?.id || '未登录' }}</p>
          </div>
        </div>
        <button 
          @click="handleSettings"
          class="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-200"
        >
          <Settings :size="20" class="text-white" />
        </button>
      </div>

      <!-- Diamond Balance -->
      <div v-if="userStore.isLoggedIn" class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <Gem :size="20" class="text-white" />
            </div>
            <div>
              <p class="text-white font-semibold">钻石余额</p>
              <p class="text-blue-100 text-sm">可用于购买付费圈子</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-white">{{ userStore.user?.diamonds || 0 }}</p>
            <button 
              @click="handleRecharge"
              class="text-yellow-200 text-sm hover:text-yellow-100 transition-colors duration-200"
            >
              充值 →
            </button>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center">
          <p class="text-2xl font-bold text-white">156</p>
          <p class="text-blue-100 text-sm">动态</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-white">892</p>
          <p class="text-blue-100 text-sm">关注</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-white">1.2k</p>
          <p class="text-blue-100 text-sm">粉丝</p>
        </div>
      </div>
    </div>

    <!-- Login Prompt for Guests -->
    <div v-if="!userStore.isLoggedIn" class="mx-4 -mt-4 bg-white rounded-2xl shadow-sm p-6 mb-4 text-center">
      <div class="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
        <User :size="24" class="text-blue-600" />
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2">登录后享受更多功能</h3>
      <p class="text-gray-600 mb-4 text-sm">发布动态、加入圈子、参与活动</p>
      <button
        @click="handleLogin"
        class="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-200"
      >
        立即登录
      </button>
    </div>

    <!-- Menu Items -->
    <div v-else class="bg-white mx-4 -mt-4 rounded-2xl shadow-sm p-4 mb-4">
      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="(item, index) in menuItems"
          :key="index"
          @click="handleMenuClick(item)"
          class="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
        >
          <div :class="['p-2 rounded-lg bg-gray-50', item.color]">
            <component :is="item.icon" :size="20" />
          </div>
          <div class="flex-1 text-left">
            <p class="font-medium text-gray-900">{{ item.label }}</p>
            <p v-if="item.count > 0" class="text-sm text-gray-500">{{ item.count }}条</p>
          </div>
          <ChevronRight :size="16" class="text-gray-400" />
        </button>
      </div>
    </div>

    <!-- Service Menu -->
    <div class="bg-white mx-4 rounded-2xl shadow-sm p-1 mb-4">
      <button
        v-for="(item, index) in serviceItems"
        :key="index"
        @click="handleServiceClick(item)"
        class="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors duration-200 first:rounded-t-2xl last:rounded-b-2xl"
      >
        <span :class="['font-medium', item.color]">{{ item.label }}</span>
        <ChevronRight :size="16" class="text-gray-400" />
      </button>
    </div>

    <!-- Logout Button for Logged In Users -->
    <div v-if="userStore.isLoggedIn" class="px-4 mb-4">
      <button
        @click="handleLogout"
        class="w-full bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors duration-200"
      >
        退出登录
      </button>
    </div>

    <!-- Version Info -->
    <div class="text-center px-4">
      <p class="text-gray-400 text-sm">版本 1.0.0</p>
      <p class="text-gray-400 text-xs mt-1">© 2024 圈子商城</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Settings, Heart, ShoppingBag, MessageCircle, Star, ChevronRight, Gem, User } from 'lucide-vue-next'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const menuItems = [
  { icon: ShoppingBag, label: '我的订单', color: 'text-blue-600', count: 3, action: 'orders' },
  { icon: Heart, label: '我的收藏', color: 'text-red-600', count: 12, action: 'favorites' },
  { icon: MessageCircle, label: '我的评论', color: 'text-green-600', count: 8, action: 'comments' },
  { icon: Star, label: '我的评价', color: 'text-yellow-600', count: 5, action: 'reviews' }
]

const serviceItems = [
  { label: '客服中心', color: 'text-purple-600', action: 'support' },
  { label: '意见反馈', color: 'text-orange-600', action: 'feedback' },
  { label: '关于我们', color: 'text-gray-600', action: 'about' },
  { label: '隐私政策', color: 'text-gray-600', action: 'privacy' }
]

const handleLogin = () => {
  router.push({ name: 'login' })
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    alert('已退出登录')
  }
}

const handleRecharge = () => {
  router.push({ name: 'recharge' })
}

const handleSettings = () => {
  alert('设置功能')
}

const handleMenuClick = (item: any) => {
  switch (item.action) {
    case 'orders':
      alert('我的订单')
      break
    case 'favorites':
      alert('我的收藏')
      break
    case 'comments':
      alert('我的评论')
      break
    case 'reviews':
      alert('我的评价')
      break
    default:
      alert(`点击了: ${item.label}`)
  }
}

const handleServiceClick = (item: any) => {
  switch (item.action) {
    case 'support':
      alert('客服中心')
      break
    case 'feedback':
      alert('意见反馈')
      break
    case 'about':
      alert('关于我们')
      break
    case 'privacy':
      alert('隐私政策')
      break
    default:
      alert(`点击了: ${item.label}`)
  }
}
</script>