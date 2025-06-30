<template>
  <div
    ref="containerRef"
    class="h-full overflow-y-auto scrollbar-hide"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Pull to refresh indicator -->
    <div
      class="flex items-center justify-center transition-all duration-200 ease-out"
      :style="{
        height: `${pullDistance}px`,
        opacity: pullDistance > 0 ? 1 : 0,
      }"
    >
      <div class="flex flex-col items-center space-y-2">
        <div
          :class="[
            'p-2 rounded-full bg-blue-100 transition-all duration-200',
            isRefreshing ? 'animate-spin' : ''
          ]"
          :style="{
            transform: `rotate(${rotation}deg)`,
          }"
        >
          <RotateCcw
            :size="20"
            :class="[
              'transition-colors duration-200',
              refreshProgress >= 1 ? 'text-blue-600' : 'text-gray-500'
            ]"
          />
        </div>
        <span class="text-xs text-gray-500">
          {{ getRefreshText() }}
        </span>
      </div>
    </div>

    <div
      class="transition-transform duration-200 ease-out"
      :style="{
        transform: `translateY(${pullDistance > 0 ? pullDistance * 0.5 : 0}px)`,
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RotateCcw } from 'lucide-vue-next'

defineEmits<{
  refresh: []
}>()

const containerRef = ref<HTMLDivElement>()
const pullDistance = ref(0)
const isRefreshing = ref(false)
const startY = ref(0)

const threshold = 80
const maxPull = 120

const refreshProgress = computed(() => Math.min(pullDistance.value / threshold, 1))
const rotation = computed(() => refreshProgress.value * 180)

const getRefreshText = () => {
  if (isRefreshing.value) return '刷新中...'
  if (pullDistance.value >= threshold) return '松开刷新'
  return '下拉刷新'
}

const handleTouchStart = (e: TouchEvent) => {
  if (containerRef.value?.scrollTop === 0) {
    startY.value = e.touches[0].clientY
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (startY.value === 0 || containerRef.value?.scrollTop !== 0) return

  const currentY = e.touches[0].clientY
  const distance = Math.max(0, Math.min(currentY - startY.value, maxPull))
  pullDistance.value = distance

  if (distance > 0) {
    e.preventDefault()
  }
}

const handleTouchEnd = async () => {
  if (pullDistance.value >= threshold && !isRefreshing.value) {
    isRefreshing.value = true
    try {
      emit('refresh')
      await new Promise(resolve => setTimeout(resolve, 1500))
    } finally {
      isRefreshing.value = false
    }
  }
  pullDistance.value = 0
  startY.value = 0
}
</script>