<template>
  <div class="pb-20">
    <PullToRefresh @refresh="handleRefresh">
      <!-- Carousel Banner -->
      <CarouselBanner 
        :items="bannerItems" 
        @item-click="handleBannerClick"
      />

      <!-- Broadcast Bar -->
      <BroadcastBar 
        :messages="broadcastMessages"
        @message-click="handleBroadcastClick"
        @message-dismiss="handleBroadcastDismiss"
      />

      <!-- Navigation Menu -->
      <NavigationMenu @item-click="handleNavigationClick" />

      <!-- Popular Circles -->
      <PopularCircles 
        :circles="circles"
        @circle-click="handleCircleClick"
        @view-all-click="handleViewAllCircles"
      />

      <!-- Featured Products -->
      <div class="px-4 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">精选推荐</h3>
          <button 
            @click="handleViewMoreProducts"
            class="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors duration-200"
          >
            查看更多
          </button>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id" 
            :product="product" 
          />
        </div>
      </div>

      <!-- Community Posts -->
      <div class="px-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">圈子动态</h3>
          <button class="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors duration-200">
            查看更多
          </button>
        </div>
        
        <!-- Post Filter Menu -->
        <PostFilterMenu 
          :selectedFilter="selectedFilter"
          @filter-change="handleFilterChange"
        />
        
        <!-- Refreshing indicator -->
        <div v-if="refreshing" class="flex justify-center py-4 mb-4">
          <div class="flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
            <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm font-medium">正在刷新...</span>
          </div>
        </div>
        
        <!-- Masonry/Waterfall Layout -->
        <div class="columns-2 gap-3 space-y-0">
          <WaterfallPost
            v-for="post in posts"
            :key="post.id"
            :post="post"
            @like="handleLike"
          />
        </div>

        <!-- Loading indicator -->
        <div v-if="loading && hasMorePosts" class="flex justify-center py-8">
          <div class="flex items-center space-x-2 text-gray-500">
            <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm">正在加载...</span>
          </div>
        </div>

        <!-- No more posts indicator -->
        <div v-if="!hasMorePosts && posts.length > 0" class="flex flex-col items-center py-8 text-gray-500">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <div class="w-8 h-8 border-2 border-gray-300 rounded-full"></div>
          </div>
          <p class="text-sm font-medium mb-1">没有更多了</p>
          <p class="text-xs text-gray-400">已经到底啦，去看看其他内容吧</p>
        </div>
      </div>
    </PullToRefresh>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import PullToRefresh from '../components/PullToRefresh.vue'
import CarouselBanner from '../components/CarouselBanner.vue'
import BroadcastBar from '../components/BroadcastBar.vue'
import NavigationMenu from '../components/NavigationMenu.vue'
import PopularCircles from '../components/PopularCircles.vue'
import ProductCard from '../components/ProductCard.vue'
import PostFilterMenu from '../components/PostFilterMenu.vue'
import WaterfallPost from '../components/WaterfallPost.vue'
import { mockProducts, mockPosts, generateMorePosts, mockBannerItems } from '../data/mockData'
import { mockCircles } from '../data/circlesData'
import { mockBroadcastMessages } from '../data/broadcastData'
import type { Post, BannerItem, BroadcastMessage, Circle, NavigationItem } from '../types'

const router = useRouter()

const posts = ref<Post[]>(mockPosts)
const loading = ref(false)
const refreshing = ref(false)
const hasMorePosts = ref(true)
const selectedFilter = ref('latest')
const postIdCounter = ref(100)

const featuredProducts = mockProducts.slice(0, 4)
const bannerItems = mockBannerItems
const broadcastMessages = mockBroadcastMessages
const circles = mockCircles

const handleLike = (postId: string) => {
  const postIndex = posts.value.findIndex(post => post.id === postId)
  if (postIndex !== -1) {
    const post = posts.value[postIndex]
    post.liked = !post.liked
    post.likes = post.liked ? post.likes + 1 : post.likes - 1
  }
}

const handleRefresh = async () => {
  refreshing.value = true
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const newPosts = generateMorePosts(Date.now())
  posts.value = [...newPosts.slice(0, 5), ...posts.value]
  hasMorePosts.value = true
  refreshing.value = false
}

const loadMorePosts = () => {
  if (loading.value || !hasMorePosts.value) return
  
  loading.value = true
  setTimeout(() => {
    const morePosts = generateMorePosts(postIdCounter.value)
    
    if (posts.value.length >= 50) {
      hasMorePosts.value = false
    } else {
      posts.value = [...posts.value, ...morePosts]
      postIdCounter.value += morePosts.length
    }
    
    loading.value = false
  }, 1000)
}

const handleBannerClick = (item: BannerItem) => {
  console.log('Banner clicked:', item.title)
  alert(`查看横幅: ${item.title}`)
}

const handleNavigationClick = (item: NavigationItem) => {
  console.log('Navigation clicked:', item.label)
  
  switch (item.id) {
    case 'mall':
      router.push({ name: 'mall' })
      break
    case 'all-circles':
      router.push({ name: 'circles' })
      break
    case 'activity-zone':
      router.push({ name: 'activity-zone' })
      break
    default:
      alert(`点击了: ${item.label}`)
  }
}

const handleCircleClick = (circle: Circle) => {
  console.log('Circle clicked:', circle.name)
  // 导航到圈子详情页
  router.push({ name: 'circle-detail', params: { id: circle.id } })
}

const handleViewAllCircles = () => {
  router.push({ name: 'circles' })
}

const handleViewMoreProducts = () => {
  router.push({ name: 'mall' })
}

const handleBroadcastClick = (message: BroadcastMessage) => {
  console.log('Broadcast clicked:', message.title)
  alert(`查看广播: ${message.title}`)
}

const handleBroadcastDismiss = (messageId: string) => {
  console.log('Broadcast dismissed:', messageId)
}

const handleFilterChange = (filterId: string) => {
  selectedFilter.value = filterId
  console.log('Filter changed to:', filterId)
}

// Infinite scroll
const handleScroll = () => {
  if (window.innerHeight + document.documentElement.scrollTop 
      >= document.documentElement.offsetHeight - 1000) {
    loadMorePosts()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>