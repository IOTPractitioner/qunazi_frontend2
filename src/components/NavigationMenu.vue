<template>
  <div class="bg-white px-4 py-6 border-b border-gray-100">
    <div class="grid grid-cols-4 gap-6">
      <button
        v-for="item in items"
        :key="item.id"
        @click="handleItemClick(item)"
        class="flex flex-col items-center space-y-2 group"
      >
        <div :class="[
          'w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-200 group-hover:scale-110 group-hover:shadow-xl group-active:scale-95',
          item.bgColor
        ]">
          <component 
            :is="item.icon" 
            :size="20" 
            :class="[item.color, 'transition-transform duration-200']"
          />
        </div>
        
        <span class="text-xs font-medium text-gray-700 text-center leading-tight">
          {{ item.label }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ShoppingBag, 
  Zap, 
  Gift, 
  MapPin, 
  Flame, 
  Crown, 
  Users, 
  Heart 
} from 'lucide-vue-next'
import type { NavigationItem } from '../types'

const emit = defineEmits<{
  'item-click': [item: NavigationItem]
}>()

const defaultNavigationItems: NavigationItem[] = [
  {
    id: 'mall',
    label: '商城',
    icon: ShoppingBag,
    color: 'text-white',
    bgColor: 'bg-gradient-to-br from-pink-500 to-purple-600'
  },
  {
    id: 'all-circles',
    label: '全部圈子',
    icon: Zap,
    color: 'text-white',
    bgColor: 'bg-gradient-to-br from-orange-500 to-red-500'
  },
  {
    id: 'wallet',
    label: '钱包',
    icon: Gift,
    color: 'text-white',
    bgColor: 'bg-gradient-to-br from-pink-500 to-rose-500',
    onClick: () => {
      // Navigate to recharge page
      window.location.href = '#/recharge'
    }
  },
  {
    id: 'activity-zone',
    label: '活动专区',
    icon: MapPin,
    color: 'text-white',
    bgColor: 'bg-gradient-to-br from-green-500 to-emerald-500'
  },
  {
    id: 'trending',
    label: '短视频',
    icon: Flame,
    color: 'text-white',
    bgColor: 'bg-gradient-to-br from-pink-500 to-red-500'
  },
  {
    id: 'vip',
    label: 'VIP会员',
    icon: Crown,
    color: 'text-white',
    bgColor: 'bg-gradient-to-br from-yellow-500 to-orange-500'
  },
  {
    id: 'ranking',
    label: '排行榜',
    icon: Users,
    color: 'text-white',
    bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500'
  },
  {
    id: 'social',
    label: '交友圈圈',
    icon: Heart,
    color: 'text-white',
    bgColor: 'bg-gradient-to-br from-red-500 to-pink-500'
  }
]

const items = defaultNavigationItems

const handleItemClick = (item: NavigationItem) => {
  if (item.onClick) {
    item.onClick()
  } else {
    emit('item-click', item)
  }
}
</script>