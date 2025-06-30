<template>
  <div class="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3 z-40">
    <div class="flex items-center justify-between max-w-md mx-auto">
      <h1 class="text-xl font-bold text-gray-900">{{ title }}</h1>
      
      <div class="flex items-center space-x-3">
        <button 
          v-if="showSearch"
          @click="$emit('search-click')"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <Search :size="20" class="text-gray-600" />
        </button>
        <button 
          @click="handleNotificationClick"
          class="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <Bell :size="20" class="text-gray-600" />
          <div 
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center animate-pulse"
          >
            <span class="text-white text-xs font-bold leading-none">
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Bell } from 'lucide-vue-next'

interface Props {
  title: string
  showSearch?: boolean
}

withDefaults(defineProps<Props>(), {
  showSearch: false
})

defineEmits<{
  'search-click': []
}>()

const router = useRouter()
const unreadCount = ref(3) // 模拟未读通知数量

const handleNotificationClick = () => {
  router.push({ name: 'notifications' })
}

// 模拟获取未读通知数量
onMounted(() => {
  // 这里可以调用API获取真实的未读通知数量
  // fetchUnreadNotificationCount()
})
</script>