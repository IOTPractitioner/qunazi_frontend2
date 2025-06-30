<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 mb-4">
    <!-- Activity Image -->
    <div v-if="activity.image" class="relative h-48 overflow-hidden">
      <img
        :src="activity.image"
        :alt="activity.title"
        class="w-full h-full object-cover"
      />
      <!-- Status Badge -->
      <div class="absolute top-3 left-3">
        <span :class="[
          'px-3 py-1 rounded-full text-xs font-medium',
          getStatusColor(activity.status)
        ]">
          {{ getStatusText(activity.status) }}
        </span>
      </div>
      
      <!-- Participants Badge -->
      <div class="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
        <div class="flex items-center space-x-1 text-white text-xs">
          <Users :size="12" />
          <span>{{ activity.currentParticipants }}/{{ activity.maxParticipants || '∞' }}</span>
        </div>
      </div>
    </div>

    <!-- Activity Content -->
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="font-bold text-gray-900 text-lg leading-tight mb-2">
            {{ activity.title }}
          </h3>
          
          <!-- Organizer -->
          <div class="flex items-center space-x-2 mb-2">
            <img
              :src="activity.organizer.avatar"
              :alt="activity.organizer.name"
              class="w-6 h-6 rounded-full object-cover"
            />
            <span class="text-sm text-gray-600">{{ activity.organizer.name }}</span>
            <div 
              v-if="activity.organizer.verified"
              class="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Description -->
      <p class="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-2">
        {{ activity.description }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1 mb-3">
        <span
          v-for="tag in activity.tags"
          :key="tag"
          class="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs font-medium"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Time and Location -->
      <div class="space-y-2 mb-4">
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <Clock :size="14" />
          <span>{{ formatDateTime(activity.startTime) }}</span>
        </div>
        <div v-if="activity.location" class="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin :size="14" />
          <span>{{ activity.location }}</span>
        </div>
      </div>

      <!-- Action Button -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar :size="14" />
          <span>{{ formatRelativeTime(activity.createdAt) }}</span>
        </div>
        
        <button
          @click="handleParticipate"
          :disabled="!canParticipate"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
            getButtonStyle()
          ]"
        >
          {{ getButtonText() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Users, Clock, MapPin, Calendar } from 'lucide-vue-next'
import type { Activity } from '../types'

interface Props {
  activity: Activity
}

const props = defineProps<Props>()
const emit = defineEmits<{
  participate: [activityId: string]
  'view-detail': [activity: Activity]
}>()

const canParticipate = computed(() => {
  if (props.activity.status === 'ended') return false
  if (props.activity.isParticipating) return false
  if (props.activity.maxParticipants && 
      props.activity.currentParticipants >= props.activity.maxParticipants) return false
  return true
})

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'upcoming': return 'bg-blue-500 text-white'
    case 'ongoing': return 'bg-green-500 text-white'
    case 'ended': return 'bg-gray-500 text-white'
    default: return 'bg-gray-500 text-white'
  }
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'upcoming': return '即将开始'
    case 'ongoing': return '进行中'
    case 'ended': return '已结束'
    default: return '未知'
  }
}

const getButtonStyle = (): string => {
  if (props.activity.status === 'ended') {
    return 'bg-gray-100 text-gray-400 cursor-not-allowed'
  }
  if (props.activity.isParticipating) {
    return 'bg-green-100 text-green-700'
  }
  if (!canParticipate.value) {
    return 'bg-gray-100 text-gray-400 cursor-not-allowed'
  }
  return 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
}

const getButtonText = (): string => {
  if (props.activity.status === 'ended') return '已结束'
  if (props.activity.isParticipating) return '已参加'
  if (props.activity.maxParticipants && 
      props.activity.currentParticipants >= props.activity.maxParticipants) return '已满员'
  return '参加活动'
}

const formatDateTime = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (days > 0) return `${days}天前发布`
  if (hours > 0) return `${hours}小时前发布`
  return '刚刚发布'
}

const handleParticipate = () => {
  if (canParticipate.value) {
    emit('participate', props.activity.id)
  } else {
    emit('view-detail', props.activity)
  }
}
</script>