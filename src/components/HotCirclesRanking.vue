<template>
  <div class="bg-white mx-4 my-4 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-100">
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
          <Flame :size="14" class="text-white" />
        </div>
        <h3 class="text-lg font-bold text-gray-900">热门圈子</h3>
      </div>
      <p class="text-sm text-gray-500">根据圈子热度实时排名</p>
    </div>

    <!-- Ranking List -->
    <div class="divide-y divide-gray-50">
      <div
        v-for="(item, index) in rankingData"
        :key="item.id"
        @click="$emit('circle-click', item)"
        class="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
      >
        <!-- Left: Rank + Info -->
        <div class="flex items-center space-x-4 flex-1">
          <!-- Rank Number -->
          <div class="flex-shrink-0 w-8 text-center">
            <span 
              :class="[
                'text-lg font-bold',
                getRankColor(item.rank)
              ]"
            >
              {{ item.rank }}
            </span>
          </div>

          <!-- Circle Info -->
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-gray-900 text-base leading-tight mb-1">
              {{ item.name }}
            </h4>
            <p class="text-sm text-gray-500 leading-relaxed line-clamp-1">
              {{ item.description }}
            </p>
          </div>
        </div>

        <!-- Right: Trend + Member Count -->
        <div class="flex items-center space-x-3 flex-shrink-0">
          <!-- Trend Indicator -->
          <div class="flex items-center space-x-1">
            <div :class="[
              'flex items-center justify-center w-5 h-5 rounded-full',
              getTrendColor(item.trend)
            ]">
              <component 
                :is="getTrendIcon(item.trend)" 
                :size="12" 
                class="text-white"
              />
            </div>
            <span class="text-sm font-medium text-gray-600">
              {{ item.trendValue }}
            </span>
          </div>

          <!-- Member Count -->
          <div class="text-right">
            <p class="text-lg font-bold text-gray-900">
              {{ formatMemberCount(item.memberCount) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- View More Button -->
    <div class="p-4 border-t border-gray-100">
      <button 
        @click="$emit('view-more-click')"
        class="w-full py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <span>查看完整排行榜</span>
        <ChevronRight :size="16" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Flame, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-vue-next'
import type { CircleRankingItem } from '../types'

interface Props {
  rankingData: CircleRankingItem[]
}

defineProps<Props>()
defineEmits<{
  'circle-click': [item: CircleRankingItem]
  'view-more-click': []
}>()

const getRankColor = (rank: number): string => {
  switch (rank) {
    case 1: return 'text-red-500'
    case 2: return 'text-orange-500' 
    case 3: return 'text-blue-500'
    default: return 'text-gray-600'
  }
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return TrendingUp
    case 'down': return TrendingDown
    default: return Minus
  }
}

const getTrendColor = (trend: string): string => {
  switch (trend) {
    case 'up': return 'bg-green-500'
    case 'down': return 'bg-red-500'
    default: return 'bg-gray-400'
  }
}

const formatMemberCount = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(0)}万`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}
</script>