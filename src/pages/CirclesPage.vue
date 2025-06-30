<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Hot Circles Ranking -->
    <HotCirclesRanking 
      :rankingData="hotCirclesRanking"
      @circle-click="handleRankingCircleClick"
      @view-more-click="handleViewMoreRanking"
    />

    <!-- Search Bar -->
    <div class="p-4 bg-white border-b border-gray-100">
      <div class="relative">
        <Search :size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索圈子..."
          class="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
        />
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="bg-white px-4 py-3 border-b border-gray-100">
      <div class="flex space-x-6 overflow-x-auto scrollbar-hide">
        <button
          v-for="category in circleCategories"
          :key="category.id"
          @click="selectedCategory = category.id"
          :class="[
            'flex items-center space-x-2 px-3 py-2 rounded-full whitespace-nowrap transition-all duration-200',
            selectedCategory === category.id
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          <component :is="category.icon" :size="16" :class="selectedCategory === category.id ? 'text-blue-600' : category.color" />
          <span class="text-sm font-medium">{{ category.name }}</span>
        </button>
      </div>
    </div>

    <!-- Results Count -->
    <div class="px-4 py-3 bg-white border-b border-gray-100">
      <p class="text-sm text-gray-500">
        找到 <span class="font-semibold text-gray-900">{{ filteredCircles.length }}</span> 个圈子
      </p>
    </div>

    <!-- Circles Grid -->
    <div class="p-4">
      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="circle in filteredCircles"
          :key="circle.id"
          @click="handleCircleClick(circle)"
          class="relative h-32 rounded-2xl overflow-hidden group transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
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
            <div class="absolute inset-0 bg-black/30"></div>
          </div>

          <!-- Paid Badge -->
          <div v-if="circle.isPaid" class="absolute top-3 left-3">
            <div class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full flex items-center space-x-1">
              <Gem :size="10" />
              <span class="text-xs font-bold">{{ circle.price }}</span>
            </div>
          </div>

          <!-- Joined Badge -->
          <div v-if="userStore.isCircleJoined(circle.id)" class="absolute top-3 right-3">
            <div class="bg-green-500 text-white px-2 py-1 rounded-full flex items-center space-x-1">
              <Check :size="10" />
              <span class="text-xs font-medium">已加入</span>
            </div>
          </div>

          <!-- Content -->
          <div class="relative z-10 p-4 h-full flex flex-col justify-between text-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-1">
                <Users :size="14" class="opacity-80" />
                <span class="text-xs opacity-90">
                  {{ formatMemberCount(circle.memberCount) }}
                </span>
              </div>
              
              <!-- Join Button -->
              <button 
                @click.stop="handleJoinCircle(circle)"
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200',
                  userStore.isCircleJoined(circle.id)
                    ? 'bg-green-500/20 text-green-100 border border-green-400'
                    : circle.isPaid
                      ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-400'
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                ]"
              >
                {{ userStore.isCircleJoined(circle.id) ? '已加入' : circle.isPaid ? `${circle.price}💎` : '加入' }}
              </button>
            </div>
            
            <div class="text-left">
              <h4 class="font-bold text-base leading-tight drop-shadow-sm mb-1">
                {{ circle.name }}
              </h4>
              <p v-if="circle.description" class="text-xs opacity-80 line-clamp-2 leading-relaxed">
                {{ circle.description }}
              </p>
            </div>
          </div>

          <!-- Hover Effect -->
          <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="filteredCircles.length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Users :size="32" class="text-gray-400" />
        </div>
        <p class="text-gray-500 mb-2">没有找到相关圈子</p>
        <button 
          @click="clearFilters"
          class="text-blue-600 text-sm hover:text-blue-700 transition-colors duration-200"
        >
          清除筛选条件
        </button>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="filteredCircles.length > 0" class="px-4 pb-4">
      <button class="w-full py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors duration-200">
        加载更多圈子
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Users, TrendingUp, Star, Clock, Gem, Check } from 'lucide-vue-next'
import HotCirclesRanking from '../components/HotCirclesRanking.vue'
import { mockCircles, mockCircleRanking } from '../data/circlesData'
import { useUserStore } from '../stores/userStore'
import type { Circle, CircleRankingItem } from '../types'

const router = useRouter()
const userStore = useUserStore()
const searchQuery = ref('')
const selectedCategory = ref('all')

const circleCategories = [
  { id: 'all', name: '全部', icon: Users, color: 'text-gray-600' },
  { id: 'hot', name: '热门', icon: TrendingUp, color: 'text-red-500' },
  { id: 'recommend', name: '推荐', icon: Star, color: 'text-yellow-500' },
  { id: 'new', name: '最新', icon: Clock, color: 'text-blue-500' },
  { id: 'paid', name: '付费', icon: Gem, color: 'text-purple-500' }
]

const circles = mockCircles
const hotCirclesRanking = mockCircleRanking.slice(0, 4) // 显示前4个

const filteredCircles = computed(() => {
  return circles.filter(circle => {
    const matchesSearch = circle.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         (circle.description && circle.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    let matchesCategory = true
    if (selectedCategory.value === 'hot') {
      matchesCategory = circle.memberCount > 20000
    } else if (selectedCategory.value === 'recommend') {
      matchesCategory = circle.memberCount > 15000 && circle.memberCount < 30000
    } else if (selectedCategory.value === 'new') {
      matchesCategory = circle.memberCount < 15000
    } else if (selectedCategory.value === 'paid') {
      matchesCategory = circle.isPaid === true
    }
    
    return matchesSearch && matchesCategory
  })
})

const formatMemberCount = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万人`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k人`
  }
  return `${count}人`
}

const handleCircleClick = (circle: Circle) => {
  console.log('Circle clicked:', circle.name)
  router.push({ name: 'circle-detail', params: { id: circle.id } })
}

const handleJoinCircle = (circle: Circle) => {
  if (!userStore.isLoggedIn) {
    router.push({ name: 'login', query: { from: 'circle-join' } })
    return
  }

  if (userStore.isCircleJoined(circle.id)) {
    userStore.leaveCircle(circle.id)
    console.log('Left circle:', circle.name)
  } else {
    if (circle.isPaid) {
      // 付费圈子跳转到详情页进行购买
      router.push({ name: 'circle-detail', params: { id: circle.id } })
    } else {
      // 免费圈子直接加入
      userStore.joinCircle(circle.id)
      console.log('Joined circle:', circle.name)
    }
  }
}

const handleRankingCircleClick = (item: CircleRankingItem) => {
  console.log('Ranking circle clicked:', item.name)
  router.push({ name: 'circle-detail', params: { id: item.id } })
}

const handleViewMoreRanking = () => {
  console.log('View more ranking clicked')
  alert('查看完整排行榜')
}

const clearFilters = () => {
  selectedCategory.value = 'all'
  searchQuery.value = ''
}
</script>