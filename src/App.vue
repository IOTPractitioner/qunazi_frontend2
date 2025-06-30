<template>
  <div class="min-h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden">
    <div class="h-screen overflow-y-auto scrollbar-hide">
      <Header 
        :title="getHeaderTitle()" 
        :showSearch="shouldShowSearch" 
        @search-click="handleSearchClick"
      />
      
      <main class="flex-1">
        <router-view />
      </main>
      
      <BottomNavigation 
        v-if="shouldShowBottomNav"
        :activeTab="activeTab" 
        @tab-change="handleTabChange"
        @publish-click="handlePublishClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from './components/Header.vue'
import BottomNavigation from './components/BottomNavigation.vue'
import { useUserStore } from './stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('home')

const getHeaderTitle = () => {
  switch (route.name) {
    case 'home': return '圈子商城'
    case 'community': return '广场'
    case 'mall': return '商城'
    case 'profile': return '我的'
    case 'circles': return '圈子'
    case 'user-profile': return '用户主页'
    case 'search': return '搜索'
    case 'notifications': return '消息通知'
    case 'login': return '登录'
    case 'publish': return '发布动态'
    default: return '圈子商城'
  }
}

const shouldShowSearch = computed(() => {
  return ['home', 'mall', 'community', 'circles'].includes(route.name as string)
})

const shouldShowBottomNav = computed(() => {
  return !['search', 'notifications', 'login', 'publish'].includes(route.name as string)
})

const handleTabChange = (tab: string) => {
  activeTab.value = tab
  router.push({ name: tab })
}

const handleSearchClick = () => {
  router.push({ name: 'search' })
}

const handlePublishClick = () => {
  // 检查用户是否登录
  if (!userStore.isLoggedIn) {
    // 未登录，跳转到登录页面
    router.push({ name: 'login', query: { from: 'publish' } })
  } else {
    // 已登录，跳转到发布页面
    router.push({ name: 'publish' })
  }
}

// Prevent scroll bounce on iOS
onMounted(() => {
  // 初始化用户认证状态
  userStore.initializeAuth()
  
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
  document.body.style.height = '100%'
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.width = ''
  document.body.style.height = ''
})

// Update active tab based on route
router.afterEach((to) => {
  if (['home', 'community', 'mall', 'profile'].includes(to.name as string)) {
    activeTab.value = to.name as string
  }
})
</script>