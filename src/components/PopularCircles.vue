<template>
  <div class="bg-white px-4 py-6 border-b border-gray-100">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-gray-900">精选圈子</h3>
      <button 
        @click="$emit('view-all-click')"
        class="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
      >
        <span class="text-sm">全部</span>
        <span class="text-sm">{{ circles.length }}</span>
        <ChevronRight :size="16" />
      </button>
    </div>

    <!-- Circles Grid -->
    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="circle in circles"
        :key="circle.id"
        @click="$emit('circle-click', circle)"
        class="relative h-24 rounded-2xl overflow-hidden group transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
      >
        <!-- Background Image -->
        <div class="absolute inset-0">
          <img
            :src="circle.backgroundImage"
            :alt="circle.name"
            class="w-full h-full object-cover"
          />
          <!-- Gradient Overlay -->
          <div :class="[circle.gradient, 'absolute inset-0 opacity-80']"></div>
          <!-- Dark overlay for better text readability -->
          <div class="absolute inset-0 bg-black/20"></div>
        </div>

        <!-- Paid Badge -->
        <div v-if="circle.isPaid" class="absolute top-2 left-2">
          <div class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full flex items-center space-x-1">
            <Gem :size="10" />
            <span class="text-xs font-bold">{{ circle.price }}</span>
          </div>
        </div>

        <!-- Joined Badge -->
        <div v-if="userStore.isCircleJoined(circle.id)" class="absolute top-2 right-2">
          <div class="bg-green-500 text-white px-2 py-1 rounded-full flex items-center space-x-1">
            <Check :size="10" />
            <span class="text-xs font-medium">已加入</span>
          </div>
        </div>

        <!-- Content -->
        <div class="relative z-10 p-3 h-full flex flex-col justify-between text-white">
          <div class="flex items-center space-x-1">
            <Users :size="12" class="opacity-80" />
            <span class="text-xs opacity-90">
              {{ formatMemberCount(circle.memberCount) }}
            </span>
          </div>
          
          <div class="text-left">
            <h4 class="font-semibold text-sm leading-tight drop-shadow-sm">
              {{ circle.name }}
            </h4>
            <p v-if="circle.description" class="text-xs opacity-80 mt-1 line-clamp-1">
              {{ circle.description }}
            </p>
          </div>
        </div>

        <!-- Hover Effect -->
        <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users, ChevronRight, Gem, Check } from 'lucide-vue-next'
import { useUserStore } from '../stores/userStore'
import type { Circle } from '../types'

interface Props {
  circles: Circle[]
}

defineProps<Props>()
defineEmits<{
  'circle-click': [circle: Circle]
  'view-all-click': []
}>()

const userStore = useUserStore()

const formatMemberCount = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}
</script>