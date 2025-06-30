<template>
  <div 
    v-if="isVisible && activeMessages.length > 0"
    :class="[
      'px-4 py-2 relative overflow-hidden',
      getColorScheme(currentMessage.type, currentMessage.priority)
    ]"
  >
    <!-- Background Animation -->
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
    
    <div class="relative flex items-center space-x-3">
      <!-- Icon -->
      <div class="flex-shrink-0 flex items-center space-x-2">
        <Volume2 :size="16" class="animate-pulse" />
        <component :is="getIcon(currentMessage.type)" :size="16" />
      </div>

      <!-- Content -->
      <div 
        class="flex-1 cursor-pointer"
        @click="$emit('message-click', currentMessage)"
      >
        <div class="flex items-center space-x-2">
          <span class="font-medium text-sm">{{ currentMessage.title }}</span>
          <ExternalLink v-if="currentMessage.url" :size="12" class="opacity-70" />
        </div>
        
        <!-- Scrolling text for long content -->
        <div class="overflow-hidden">
          <div :class="[
            'text-xs opacity-90',
            currentMessage.content.length > 50 ? 'animate-marquee' : ''
          ]">
            {{ currentMessage.content }}
          </div>
        </div>
      </div>

      <!-- Message Counter -->
      <div v-if="activeMessages.length > 1" class="flex-shrink-0 text-xs opacity-70">
        {{ currentIndex + 1 }}/{{ activeMessages.length }}
      </div>

      <!-- Dismiss Button -->
      <button
        v-if="currentMessage.dismissible"
        @click.stop="handleDismiss(currentMessage.id)"
        class="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
      >
        <X :size="14" />
      </button>
    </div>

    <!-- Progress Bar for multiple messages -->
    <div v-if="activeMessages.length > 1" class="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
      <div 
        class="h-full bg-white/60 transition-all duration-100 ease-linear"
        :style="{ width: `${((currentIndex + 1) / activeMessages.length) * 100}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Volume2, X, ExternalLink, Gift, AlertCircle, Megaphone } from 'lucide-vue-next'
import type { BroadcastMessage } from '../types'

interface Props {
  messages: BroadcastMessage[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'message-click': [message: BroadcastMessage]
  'message-dismiss': [messageId: string]
}>()

const currentIndex = ref(0)
const dismissedMessages = ref(new Set<string>())
const isVisible = ref(true)
let rotateInterval: number | null = null

const activeMessages = computed(() => {
  return props.messages.filter(message => {
    const now = new Date()
    const isActive = now >= message.startTime && (!message.endTime || now <= message.endTime)
    const isNotDismissed = !dismissedMessages.value.has(message.id)
    return isActive && isNotDismissed
  })
})

const currentMessage = computed(() => activeMessages.value[currentIndex.value])

const getIcon = (type: string) => {
  switch (type) {
    case 'status': return AlertCircle
    case 'promotion': return Gift
    case 'ad': return ExternalLink
    default: return Megaphone
  }
}

const getColorScheme = (type: string, priority: string) => {
  if (priority === 'high') {
    return 'bg-red-500 text-white'
  }
  
  switch (type) {
    case 'status': return 'bg-blue-500 text-white'
    case 'promotion': return 'bg-green-500 text-white'
    case 'ad': return 'bg-purple-500 text-white'
    default: return 'bg-gray-600 text-white'
  }
}

const handleDismiss = (messageId: string) => {
  dismissedMessages.value.add(messageId)
  emit('message-dismiss', messageId)
}

const startRotation = () => {
  if (activeMessages.value.length <= 1) return
  
  rotateInterval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % activeMessages.value.length
  }, 4000)
}

onMounted(() => {
  startRotation()
})

onUnmounted(() => {
  if (rotateInterval) {
    clearInterval(rotateInterval)
  }
})

// Reset index if out of bounds
watch(() => activeMessages.value.length, (newLength) => {
  if (currentIndex.value >= newLength) {
    currentIndex.value = 0
  }
  
  if (rotateInterval) {
    clearInterval(rotateInterval)
  }
  startRotation()
})
</script>