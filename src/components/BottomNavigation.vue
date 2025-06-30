<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
    <div class="flex justify-around items-center max-w-md mx-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="handleTabClick(tab)"
        :class="[
          'flex flex-col items-center py-2 px-4 transition-all duration-200',
          activeTab === tab.id 
            ? 'text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        <div :class="[
          'relative transition-all duration-200',
          activeTab === tab.id ? 'transform scale-110' : '',
          tab.id === 'publish' ? 'bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2' : ''
        ]">
          <component 
            :is="tab.icon" 
            :size="tab.id === 'publish' ? 24 : 22" 
            :class="[
              'transition-all duration-200',
              tab.id === 'publish' ? 'text-white' : 
              activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
            ]"
          />
          <!-- Active indicator dot -->
          <div 
            v-if="activeTab === tab.id && tab.id !== 'publish'"
            class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
          ></div>
        </div>
        <span :class="[
          'text-xs font-medium mt-1 transition-colors duration-200',
          tab.id === 'publish' ? 'text-transparent' : 
          activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
        ]">
          {{ tab.label }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Home, Users, ShoppingBag, User, Plus } from 'lucide-vue-next'

interface Props {
  activeTab: string
}

defineProps<Props>()
const emit = defineEmits<{
  'tab-change': [tab: string]
  'publish-click': []
}>()

const tabs = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'community', label: '广场', icon: Users },
  { id: 'publish', label: '发布', icon: Plus },
  { id: 'mall', label: '商城', icon: ShoppingBag },
  { id: 'profile', label: '我的', icon: User }
]

const handleTabClick = (tab: any) => {
  if (tab.id === 'publish') {
    emit('publish-click')
  } else {
    emit('tab-change', tab.id)
  }
}
</script>