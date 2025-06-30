<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3 z-40">
      <div class="flex items-center justify-between">
        <button 
          @click="$router.back()"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ArrowLeft :size="20" class="text-gray-600" />
        </button>
        
        <h1 class="text-lg font-bold text-gray-900">活动专区</h1>
        
        <button 
          @click="handleCreateActivity"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <Plus :size="20" class="text-gray-600" />
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="p-4 bg-white border-b border-gray-100">
      <div class="relative">
        <Search :size="18" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索活动..."
          class="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- Featured Activities Carousel -->
    <div class="bg-white pb-4">
      <div class="px-4 py-3">
        <h3 class="text-lg font-bold text-gray-900 mb-3">精选活动</h3>
      </div>
      
      <div class="relative">
        <div 
          class="flex transition-transform duration-300 ease-in-out"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
            v-for="activity in featuredActivities"
            :key="activity.id"
            class="w-full flex-shrink-0 px-4"
          >
            <div 
              @click="handleActivityClick(activity)"
              class="relative h-48 rounded-2xl overflow-hidden cursor-pointer group"
            >
              <!-- Background Image -->
              <div class="absolute inset-0">
                <img
                  :src="activity.image"
                  :alt="activity.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </div>

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

              <!-- Content -->
              <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h4 class="font-bold text-lg mb-2 leading-tight">{{ activity.title }}</h4>
                <div class="flex items-center space-x-4 text-sm opacity-90">
                  <div class="flex items-center space-x-1">
                    <Calendar :size="14" />
                    <span>{{ formatDate(activity.startTime) }}</span>
                  </div>
                  <div v-if="activity.location" class="flex items-center space-x-1">
                    <MapPin :size="14" />
                    <span>{{ activity.location }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Carousel Indicators -->
        <div class="flex justify-center space-x-2 mt-4">
          <button
            v-for="(_, index) in featuredActivities"
            :key="index"
            @click="currentSlide = index"
            :class="[
              'w-2 h-2 rounded-full transition-all duration-200',
              index === currentSlide ? 'bg-blue-500 w-6' : 'bg-gray-300'
            ]"
          />
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="bg-white px-4 py-3 border-b border-gray-100">
      <div class="flex space-x-6 overflow-x-auto scrollbar-hide">
        <button
          v-for="filter in activityFilters"
          :key="filter.id"
          @click="selectedFilter = filter.id"
          :class="[
            'flex items-center space-x-2 px-3 py-2 rounded-full whitespace-nowrap transition-all duration-200',
            selectedFilter === filter.id
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          <component :is="filter.icon" :size="16" />
          <span class="text-sm font-medium">{{ filter.name }}</span>
        </button>
      </div>
    </div>

    <!-- Activities List -->
    <div class="p-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">
          {{ getFilterTitle() }}
        </h3>
        <span class="text-sm text-gray-500">
          共{{ filteredActivities.length }}个活动
        </span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="flex items-center space-x-2 text-gray-500">
          <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-sm">加载中...</span>
        </div>
      </div>

      <!-- Activities Grid -->
      <div v-else class="space-y-4">
        <ActivityCard
          v-for="activity in filteredActivities"
          :key="activity.id"
          :activity="activity"
          @participate="handleParticipate"
          @view-detail="handleActivityClick"
        />
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredActivities.length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Calendar :size="32" class="text-gray-400" />
        </div>
        <p class="text-gray-500 mb-2">暂无相关活动</p>
        <p class="text-gray-400 text-sm">试试其他筛选条件或创建新活动</p>
      </div>
    </div>

    <!-- Floating Action Button -->
    <button 
      @click="handleCreateActivity"
      class="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transform transition-all duration-200 z-40"
    >
      <Plus :size="24" class="text-white" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Users, 
  Calendar, 
  MapPin,
  Clock,
  TrendingUp,
  Star,
  Filter
} from 'lucide-vue-next'
import ActivityCard from '../components/ActivityCard.vue'
import { mockActivities } from '../data/activitiesData'
import { useUserStore } from '../stores/userStore'
import type { Activity } from '../types'

const router = useRouter()
const userStore = useUserStore()

const searchQuery = ref('')
const selectedFilter = ref('all')
const currentSlide = ref(0)
const loading = ref(false)

const activityFilters = [
  { id: 'all', name: '全部', icon: Calendar },
  { id: 'upcoming', name: '即将开始', icon: Clock },
  { id: 'ongoing', name: '进行中', icon: TrendingUp },
  { id: 'hot', name: '热门', icon: Star },
  { id: 'nearby', name: '附近', icon: MapPin }
]

// Mock activities data with circle association
const activities = ref<Activity[]>(mockActivities.map(activity => ({
  ...activity,
  circleId: Math.random() > 0.5 ? '1' : '2', // 随机关联圈子
  circleName: Math.random() > 0.5 ? '今天不想不开心' : '学习可爱鬼'
})))

const featuredActivities = computed(() => {
  return activities.value
    .filter(activity => activity.status !== 'ended')
    .slice(0, 3)
})

const filteredActivities = computed(() => {
  let filtered = activities.value

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(activity =>
      activity.title.toLowerCase().includes(query) ||
      activity.description.toLowerCase().includes(query) ||
      activity.tags.some(tag => tag.toLowerCase().includes(query)) ||
      (activity.location && activity.location.toLowerCase().includes(query))
    )
  }

  // Apply status filter
  switch (selectedFilter.value) {
    case 'upcoming':
      filtered = filtered.filter(activity => activity.status === 'upcoming')
      break
    case 'ongoing':
      filtered = filtered.filter(activity => activity.status === 'ongoing')
      break
    case 'hot':
      filtered = filtered.filter(activity => activity.currentParticipants > 15)
      break
    case 'nearby':
      filtered = filtered.filter(activity => activity.location)
      break
  }

  return filtered
})

const getFilterTitle = (): string => {
  const filter = activityFilters.find(f => f.id === selectedFilter.value)
  return filter ? `${filter.name}活动` : '全部活动'
}

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

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleSearch = () => {
  // Search is handled by computed property
}

const handleActivityClick = (activity: Activity) => {
  console.log('Activity clicked:', activity.title)
  // Navigate to activity detail page (to be implemented)
  alert(`查看活动详情: ${activity.title}`)
}

const handleParticipate = (activityId: string) => {
  if (!userStore.isLoggedIn) {
    router.push({ name: 'login', query: { from: 'activity' } })
    return
  }
  
  const activity = activities.value.find(a => a.id === activityId)
  if (activity && !activity.isParticipating) {
    activity.isParticipating = true
    activity.currentParticipants += 1
    console.log('Participated in activity:', activity.title)
    alert(`成功参加活动: ${activity.title}`)
  }
}

const handleCreateActivity = () => {
  if (!userStore.isLoggedIn) {
    router.push({ name: 'login', query: { from: 'create-activity' } })
    return
  }
  router.push({ name: 'create-activity' })
}

// Auto-slide carousel
let slideInterval: number | null = null

const startAutoSlide = () => {
  if (featuredActivities.value.length <= 1) return
  
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % featuredActivities.value.length
  }, 4000)
}

const stopAutoSlide = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
}

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>