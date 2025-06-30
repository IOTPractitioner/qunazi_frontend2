<template>
  <div class="relative mx-4 my-4 rounded-2xl overflow-hidden shadow-lg">
    <!-- Main Banner -->
    <div
      :class="[
        'relative h-48 cursor-pointer transition-all duration-500',
        currentItem.gradient
      ]"
      @click="$emit('item-click', currentItem)"
    >
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img
          :src="currentItem.image"
          :alt="currentItem.title"
          class="w-full h-full object-cover opacity-30"
        />
        <div class="absolute inset-0 bg-black/20"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 p-6 h-full flex flex-col justify-center text-white">
        <h2 class="text-2xl font-bold mb-2 drop-shadow-lg">
          {{ currentItem.title }}
        </h2>
        <p v-if="currentItem.subtitle" class="text-white/90 mb-4 text-sm drop-shadow">
          {{ currentItem.subtitle }}
        </p>
        
        <!-- Type Badge -->
        <div class="flex items-center space-x-2">
          <span class="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
            {{ getTypeLabel(currentItem.type) }}
          </span>
          <button class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition-colors duration-200">
            立即查看
          </button>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <template v-if="items.length > 1">
        <button
          @click.stop="goToPrevious"
          class="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors duration-200"
        >
          <ChevronLeft :size="20" />
        </button>
        <button
          @click.stop="goToNext"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors duration-200"
        >
          <ChevronRight :size="20" />
        </button>
      </template>

      <!-- Decorative Elements -->
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
      <div class="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full"></div>
    </div>

    <!-- Dots Indicator -->
    <div v-if="items.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
      <button
        v-for="(item, index) in items"
        :key="index"
        @click.stop="goToSlide(index)"
        :class="[
          'rounded-full transition-all duration-300',
          index === currentIndex
            ? 'bg-white w-6 h-2'
            : 'bg-white/50 hover:bg-white/70 w-2 h-2'
        ]"
      />
    </div>

    <!-- Auto-play Indicator -->
    <div v-if="items.length > 1 && isAutoPlaying" class="absolute top-2 right-2">
      <div class="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { BannerItem } from '../types'

interface Props {
  items: BannerItem[]
}

const props = defineProps<Props>()
defineEmits<{
  'item-click': [item: BannerItem]
}>()

const currentIndex = ref(0)
const isAutoPlaying = ref(true)
let autoPlayInterval: number | null = null

const currentItem = computed(() => props.items[currentIndex.value] || props.items[0])

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'ad': return '广告'
    case 'product': return '商品'
    case 'post': return '动态'
    default: return '内容'
  }
}

const goToSlide = (index: number) => {
  currentIndex.value = index
  resetAutoPlay()
}

const goToPrevious = () => {
  currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length
  resetAutoPlay()
}

const goToNext = () => {
  currentIndex.value = (currentIndex.value + 1) % props.items.length
  resetAutoPlay()
}

const resetAutoPlay = () => {
  isAutoPlaying.value = false
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
  setTimeout(() => {
    isAutoPlaying.value = true
    startAutoPlay()
  }, 10000)
}

const startAutoPlay = () => {
  if (props.items.length <= 1) return
  
  autoPlayInterval = setInterval(() => {
    if (isAutoPlaying.value) {
      currentIndex.value = (currentIndex.value + 1) % props.items.length
    }
  }, 4000)
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
})
</script>