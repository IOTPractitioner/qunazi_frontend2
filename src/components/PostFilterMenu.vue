<template>
  <div class="bg-white rounded-xl p-1 mb-4 shadow-sm border border-gray-100">
    <div class="flex items-center justify-between">
      <button
        v-for="option in filterOptions"
        :key="option.id"
        @click="$emit('filter-change', option.id)"
        :class="[
          'flex-1 flex items-center justify-center space-x-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200',
          selectedFilter === option.id
            ? 'bg-blue-500 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        ]"
      >
        <component 
          v-if="option.icon"
          :is="option.icon" 
          :size="14" 
          :class="selectedFilter === option.id ? 'text-white' : 'text-gray-500'"
        />
        <span>{{ option.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock, Star, MessageCircle, Heart, TrendingUp } from 'lucide-vue-next'

interface Props {
  selectedFilter: string
}

defineProps<Props>()
defineEmits<{
  'filter-change': [filterId: string]
}>()

const filterOptions = [
  {
    id: 'latest',
    label: '最新',
    icon: Clock
  },
  {
    id: 'recommended',
    label: '推荐',
    icon: Star
  },
  {
    id: 'hot_comments',
    label: '热评',
    icon: MessageCircle
  },
  {
    id: 'most_liked',
    label: '点赞',
    icon: Heart
  },
  {
    id: 'popular',
    label: '人气',
    icon: TrendingUp
  }
]
</script>