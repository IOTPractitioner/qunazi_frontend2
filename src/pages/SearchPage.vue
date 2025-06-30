<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-40">
      <div class="flex items-center space-x-3">
        <button 
          @click="$router.back()"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ArrowLeft :size="20" class="text-gray-600" />
        </button>
        
        <div class="flex-1 relative">
          <Search :size="18" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="搜索商品、圈子、用户..."
            class="w-full pl-10 pr-12 py-2.5 bg-gray-100 rounded-full border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-sm"
            @input="handleSearch"
            @keyup.enter="handleSearchSubmit"
          />
          <button 
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
          >
            <X :size="16" class="text-gray-500" />
          </button>
        </div>
        
        <button 
          @click="handleSearchSubmit"
          class="px-4 py-2.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
        >
          搜索
        </button>
      </div>
    </div>

    <!-- Search Content -->
    <div class="pb-20">
      <!-- Search Suggestions (when no query) -->
      <div v-if="!searchQuery && !hasSearched" class="p-4">
        <!-- Hot Searches -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-base font-semibold text-gray-900">热门搜索</h3>
            <button class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
              换一批
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(keyword, index) in hotKeywords"
              :key="index"
              @click="selectKeyword(keyword)"
              class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200"
            >
              {{ keyword }}
            </button>
          </div>
        </div>

        <!-- Search History -->
        <div v-if="searchHistory.length > 0" class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-base font-semibold text-gray-900">搜索历史</h3>
            <button 
              @click="clearHistory"
              class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              清空
            </button>
          </div>
          <div class="space-y-2">
            <button
              v-for="(item, index) in searchHistory"
              :key="index"
              @click="selectKeyword(item)"
              class="flex items-center justify-between w-full p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div class="flex items-center space-x-3">
                <Clock :size="16" class="text-gray-400" />
                <span class="text-gray-700">{{ item }}</span>
              </div>
              <button 
                @click.stop="removeFromHistory(index)"
                class="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
              >
                <X :size="14" class="text-gray-400" />
              </button>
            </button>
          </div>
        </div>

        <!-- Categories -->
        <div>
          <h3 class="text-base font-semibold text-gray-900 mb-3">分类搜索</h3>
          <div class="grid grid-cols-4 gap-4">
            <button
              v-for="category in searchCategories"
              :key="category.id"
              @click="selectCategory(category)"
              class="flex flex-col items-center p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-2', category.color]">
                {{ category.icon }}
              </div>
              <span class="text-sm font-medium text-gray-700">{{ category.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="hasSearched" class="p-4">
        <!-- Search Tabs -->
        <div class="flex items-center space-x-6 mb-4 border-b border-gray-200">
          <button
            v-for="tab in searchTabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'pb-3 text-sm font-medium transition-colors duration-200 border-b-2',
              activeTab === tab.id
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            ]"
          >
            {{ tab.name }}
            <span v-if="tab.count > 0" class="ml-1 text-xs text-gray-400">({{ tab.count }})</span>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-8">
          <div class="flex items-center space-x-2 text-gray-500">
            <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm">搜索中...</span>
          </div>
        </div>

        <!-- Search Results Content -->
        <div v-else>
          <!-- Products Tab -->
          <div v-if="activeTab === 'products'" class="space-y-4">
            <div v-if="searchResults.products.length === 0" class="text-center py-8">
              <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Search :size="24" class="text-gray-400" />
              </div>
              <p class="text-gray-500">没有找到相关商品</p>
            </div>
            <div v-else class="grid grid-cols-2 gap-4">
              <ProductCard 
                v-for="product in searchResults.products" 
                :key="product.id" 
                :product="product" 
              />
            </div>
          </div>

          <!-- Posts Tab -->
          <div v-if="activeTab === 'posts'" class="space-y-4">
            <div v-if="searchResults.posts.length === 0" class="text-center py-8">
              <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <MessageCircle :size="24" class="text-gray-400" />
              </div>
              <p class="text-gray-500">没有找到相关动态</p>
            </div>
            <div v-else class="columns-2 gap-3 space-y-0">
              <WaterfallPost
                v-for="post in searchResults.posts"
                :key="post.id"
                :post="post"
                @like="handleLike"
              />
            </div>
          </div>

          <!-- Users Tab -->
          <div v-if="activeTab === 'users'" class="space-y-3">
            <div v-if="searchResults.users.length === 0" class="text-center py-8">
              <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Users :size="24" class="text-gray-400" />
              </div>
              <p class="text-gray-500">没有找到相关用户</p>
            </div>
            <div v-else>
              <button
                v-for="user in searchResults.users"
                :key="user.id"
                @click="goToUserProfile(user.id)"
                class="flex items-center space-x-3 w-full p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <img
                  :src="user.avatar"
                  :alt="user.name"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div class="flex-1 text-left">
                  <div class="flex items-center space-x-1">
                    <h4 class="font-medium text-gray-900">{{ user.name }}</h4>
                    <div 
                      v-if="user.verified"
                      class="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <div class="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <p class="text-sm text-gray-500">{{ user.followers }} 粉丝</p>
                </div>
                <ChevronRight :size="16" class="text-gray-400" />
              </button>
            </div>
          </div>

          <!-- Circles Tab -->
          <div v-if="activeTab === 'circles'" class="space-y-3">
            <div v-if="searchResults.circles.length === 0" class="text-center py-8">
              <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Users :size="24" class="text-gray-400" />
              </div>
              <p class="text-gray-500">没有找到相关圈子</p>
            </div>
            <div v-else class="grid grid-cols-2 gap-3">
              <button
                v-for="circle in searchResults.circles"
                :key="circle.id"
                @click="goToCircle(circle.id)"
                class="relative h-24 rounded-2xl overflow-hidden group transform transition-all duration-200 hover:scale-105"
              >
                <div class="absolute inset-0">
                  <img
                    :src="circle.backgroundImage"
                    :alt="circle.name"
                    class="w-full h-full object-cover"
                  />
                  <div :class="[circle.gradient, 'absolute inset-0 opacity-80']"></div>
                  <div class="absolute inset-0 bg-black/20"></div>
                </div>
                <div class="relative z-10 p-3 h-full flex flex-col justify-between text-white">
                  <div class="flex items-center space-x-1">
                    <Users :size="12" class="opacity-80" />
                    <span class="text-xs opacity-90">
                      {{ formatMemberCount(circle.memberCount) }}
                    </span>
                  </div>
                  <div class="text-left">
                    <h4 class="font-semibold text-sm leading-tight">{{ circle.name }}</h4>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Search, 
  X, 
  Clock, 
  MessageCircle, 
  Users, 
  ChevronRight 
} from 'lucide-vue-next'
import ProductCard from '../components/ProductCard.vue'
import WaterfallPost from '../components/WaterfallPost.vue'
import { mockProducts, mockPosts, mockUsers } from '../data/mockData'
import { mockCircles } from '../data/circlesData'
import type { Product, Post, User, Circle } from '../types'

const router = useRouter()
const searchInput = ref<HTMLInputElement>()
const searchQuery = ref('')
const hasSearched = ref(false)
const loading = ref(false)
const activeTab = ref('products')

const searchHistory = ref<string[]>([
  'iPhone 15',
  '连衣裙',
  '护肤品'
])

const hotKeywords = [
  'iPhone 15', '连衣裙', '护肤品', '运动鞋', 
  '化妆品', '数码产品', '家居用品', '美食'
]

const searchCategories = [
  { id: '1', name: '商品', icon: '🛍️', color: 'bg-pink-100 text-pink-600' },
  { id: '2', name: '圈子', icon: '👥', color: 'bg-blue-100 text-blue-600' },
  { id: '3', name: '用户', icon: '👤', color: 'bg-green-100 text-green-600' },
  { id: '4', name: '动态', icon: '📝', color: 'bg-purple-100 text-purple-600' }
]

const searchTabs = ref([
  { id: 'products', name: '商品', count: 0 },
  { id: 'posts', name: '动态', count: 0 },
  { id: 'users', name: '用户', count: 0 },
  { id: 'circles', name: '圈子', count: 0 }
])

const searchResults = ref<{
  products: Product[]
  posts: Post[]
  users: User[]
  circles: Circle[]
}>({
  products: [],
  posts: [],
  users: [],
  circles: []
})

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    hasSearched.value = false
    return
  }
  
  // Debounce search
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    performSearch()
  }, 300)
}

let searchTimeout: number

const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  loading.value = true
  hasSearched.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const query = searchQuery.value.toLowerCase()
  
  // Filter results
  searchResults.value.products = mockProducts.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query) ||
    product.tags.some(tag => tag.toLowerCase().includes(query))
  )
  
  searchResults.value.posts = mockPosts.filter(post =>
    post.content.toLowerCase().includes(query) ||
    post.user.name.toLowerCase().includes(query)
  )
  
  searchResults.value.users = mockUsers.filter(user =>
    user.name.toLowerCase().includes(query)
  )
  
  searchResults.value.circles = mockCircles.filter(circle =>
    circle.name.toLowerCase().includes(query) ||
    (circle.description && circle.description.toLowerCase().includes(query))
  )
  
  // Update tab counts
  searchTabs.value[0].count = searchResults.value.products.length
  searchTabs.value[1].count = searchResults.value.posts.length
  searchTabs.value[2].count = searchResults.value.users.length
  searchTabs.value[3].count = searchResults.value.circles.length
  
  loading.value = false
}

const handleSearchSubmit = () => {
  if (!searchQuery.value.trim()) return
  
  // Add to search history
  const query = searchQuery.value.trim()
  if (!searchHistory.value.includes(query)) {
    searchHistory.value.unshift(query)
    if (searchHistory.value.length > 10) {
      searchHistory.value = searchHistory.value.slice(0, 10)
    }
  }
  
  performSearch()
}

const selectKeyword = (keyword: string) => {
  searchQuery.value = keyword
  performSearch()
}

const selectCategory = (category: any) => {
  // Set search query based on category
  const categoryQueries = {
    '1': '商品',
    '2': '圈子',
    '3': '用户',
    '4': '动态'
  }
  searchQuery.value = categoryQueries[category.id as keyof typeof categoryQueries] || ''
  activeTab.value = category.id === '1' ? 'products' : 
                   category.id === '2' ? 'circles' :
                   category.id === '3' ? 'users' : 'posts'
  performSearch()
}

const clearSearch = () => {
  searchQuery.value = ''
  hasSearched.value = false
  searchResults.value = {
    products: [],
    posts: [],
    users: [],
    circles: []
  }
}

const clearHistory = () => {
  searchHistory.value = []
}

const removeFromHistory = (index: number) => {
  searchHistory.value.splice(index, 1)
}

const handleLike = (postId: string) => {
  const postIndex = searchResults.value.posts.findIndex(post => post.id === postId)
  if (postIndex !== -1) {
    const post = searchResults.value.posts[postIndex]
    post.liked = !post.liked
    post.likes = post.liked ? post.likes + 1 : post.likes - 1
  }
}

const goToUserProfile = (userId: string) => {
  router.push({ name: 'user-profile', params: { id: userId } })
}

const goToCircle = (circleId: string) => {
  console.log('Go to circle:', circleId)
  alert(`进入圈子: ${circleId}`)
}

const formatMemberCount = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}

onMounted(() => {
  nextTick(() => {
    searchInput.value?.focus()
  })
})
</script>