<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-3">
        <button @click="router.back()" class="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </button>
        <h1 v-if="circleDetail" class="text-lg font-semibold truncate mx-4">{{ circleDetail.name }}</h1>
        <h1 v-else class="text-lg font-semibold truncate mx-4">Loading...</h1>
        <button class="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="!circleDetail" class="bg-white p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      <p class="text-gray-500 mt-2">Loading circle details...</p>
    </div>

    <!-- Circle Info Section -->
    <div v-else class="bg-white">
      <div class="px-4 py-6">
        <!-- Circle Avatar and Basic Info -->
        <div class="flex items-start space-x-4 mb-4">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <span class="text-white text-xl font-bold">{{ circleDetail.name.charAt(0) }}</span>
          </div>
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <h2 class="text-xl font-bold text-gray-900">{{ circleDetail.name }}</h2>
              <!-- Paid Badge -->
              <div v-if="circleDetail.isPaid" class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full flex items-center space-x-1">
                <Gem :size="12" />
                <span class="text-xs font-bold">{{ circleDetail.price }}</span>
              </div>
            </div>
            <p class="text-gray-600 text-sm mt-1">{{ circleDetail.description }}</p>
            <div class="flex items-center space-x-4 mt-2">
              <div class="flex items-center space-x-1">
                <Users class="w-4 h-4 text-gray-500" />
                <span class="text-sm text-gray-600">{{ formatNumber(circleDetail.memberCount) }} 成员</span>
              </div>
              <div class="flex items-center space-x-1">
                <MessageCircle class="w-4 h-4 text-gray-500" />
                <span class="text-sm text-gray-600">{{ mockPostCount }} 帖子</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3">
          <button 
            v-if="!userStore.isCircleJoined(circleDetail.id)"
            @click="handleJoinCircle"
            :disabled="circleDetail.isPaid && !canPurchase"
            :class="[
              'flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2',
              circleDetail.isPaid
                ? canPurchase
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            ]"
          >
            <UserPlus class="w-4 h-4" />
            <span v-if="circleDetail.isPaid">
              {{ canPurchase ? `加入圈子 (${circleDetail.price} 💎)` : '钻石不足' }}
            </span>
            <span v-else>加入圈子</span>
          </button>
          <button 
            v-else
            class="flex-1 bg-green-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
          >
            <Check class="w-4 h-4" />
            <span>已加入</span>
          </button>
          <button class="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            <Share2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Paid Circle Purchase Screen -->
    <div v-if="circleDetail && circleDetail.isPaid && !userStore.isCircleJoined(circleDetail.id)" class="flex-1 bg-gray-50">
      <div class="p-6 text-center">
        <!-- Lock Icon -->
        <div class="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Lock :size="32" class="text-white" />
        </div>

        <!-- Title -->
        <h3 class="text-2xl font-bold text-gray-900 mb-2">付费圈子</h3>
        <p class="text-gray-600 mb-6 leading-relaxed">
          这是一个付费圈子，加入后可以查看所有内容并参与讨论
        </p>

        <!-- Price Card -->
        <div class="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
          <div class="flex items-center justify-center space-x-2 mb-4">
            <Gem :size="24" class="text-yellow-500" />
            <span class="text-3xl font-bold text-gray-900">{{ circleDetail.price }}</span>
            <span class="text-lg text-gray-600">钻石</span>
          </div>
          
          <!-- User Balance -->
          <div class="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
            <Wallet :size="16" />
            <span>我的余额: {{ userStore.user?.diamonds || 0 }} 💎</span>
          </div>

          <!-- Benefits -->
          <div class="space-y-2 mb-6">
            <h4 class="font-semibold text-gray-900 mb-3">加入后可享受:</h4>
            <div class="flex items-center space-x-2 text-sm text-gray-700">
              <Check :size="16" class="text-green-500" />
              <span>查看所有圈子内容</span>
            </div>
            <div class="flex items-center space-x-2 text-sm text-gray-700">
              <Check :size="16" class="text-green-500" />
              <span>参与圈子讨论</span>
            </div>
            <div class="flex items-center space-x-2 text-sm text-gray-700">
              <Check :size="16" class="text-green-500" />
              <span>发布动态和活动</span>
            </div>
            <div class="flex items-center space-x-2 text-sm text-gray-700">
              <Check :size="16" class="text-green-500" />
              <span>专属会员标识</span>
            </div>
          </div>

          <!-- Purchase Button -->
          <button
            @click="handlePurchase"
            :disabled="!canPurchase"
            :class="[
              'w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200',
              canPurchase
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            {{ canPurchase ? '立即购买' : '钻石不足' }}
          </button>

          <!-- Recharge Button -->
          <button
            v-if="!canPurchase"
            @click="handleRecharge"
            class="w-full mt-3 py-2 px-4 border border-blue-500 text-blue-500 rounded-xl hover:bg-blue-50 transition-colors duration-200"
          >
            充值钻石
          </button>
        </div>

        <!-- Preview Content -->
        <div class="bg-white rounded-2xl p-4 border border-gray-200">
          <h4 class="font-semibold text-gray-900 mb-3">圈子预览</h4>
          <div class="space-y-3">
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div class="flex-1">
                <div class="h-3 bg-gray-300 rounded mb-1"></div>
                <div class="h-2 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div class="flex-1">
                <div class="h-3 bg-gray-300 rounded mb-1"></div>
                <div class="h-2 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
          <div class="mt-4 text-center">
            <p class="text-sm text-gray-500">加入圈子后查看更多精彩内容</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Tabs (Only show if user has joined or circle is free) -->
    <div v-if="circleDetail && (!circleDetail.isPaid || userStore.isCircleJoined(circleDetail.id))" class="bg-white border-b border-gray-200 sticky top-[60px] z-40">
      <div class="flex">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors',
            activeTab === tab.id 
              ? 'text-blue-600 border-blue-600' 
              : 'text-gray-500 border-transparent hover:text-gray-700'
          ]"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- Tab Content (Only show if user has joined or circle is free) -->
    <div v-if="circleDetail && (!circleDetail.isPaid || userStore.isCircleJoined(circleDetail.id))" class="flex-1">
      <!-- Posts Tab -->
      <div v-if="activeTab === 'posts'" class="p-4">
        <div class="columns-2 gap-3 space-y-0">
          <WaterfallPost 
            v-for="post in posts" 
            :key="post.id" 
            :post="post"
            @like="handleLike"
          />
        </div>
      </div>

      <!-- Activities Tab -->
      <div v-if="activeTab === 'activities'" class="p-4 space-y-4">
        <ActivityCard 
          v-for="activity in activities" 
          :key="activity.id" 
          :activity="activity"
          @participate="handleParticipate"
          @view-detail="handleViewActivityDetail"
        />
      </div>

      <!-- Members Tab -->
      <div v-if="activeTab === 'members'" class="p-4">
        <div class="space-y-3">
          <div v-for="member in members" :key="member.id" class="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-bold">{{ member.name.charAt(0) }}</span>
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">{{ member.name }}</h3>
              <p class="text-sm text-gray-500">{{ member.role }}</p>
            </div>
            <Crown v-if="member.role === 'Owner'" class="w-4 h-4 text-yellow-500" />
            <Shield v-else-if="member.role === 'Admin'" class="w-4 h-4 text-blue-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- Purchase Success Modal -->
    <div v-if="showPurchaseSuccess" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Check :size="24" class="text-white" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">购买成功！</h3>
          <p class="text-gray-600 mb-6">欢迎加入 {{ circleDetail?.name }}，开始探索精彩内容吧！</p>
          <button
            @click="showPurchaseSuccess = false"
            class="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            开始探索
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ArrowLeft, 
  MoreHorizontal,
  Check,
  Users,
  MessageCircle,
  UserPlus,
  Share2,
  Shield,
  Crown,
  Lock,
  Gem,
  Wallet
} from 'lucide-vue-next'
import WaterfallPost from '../components/WaterfallPost.vue'
import ActivityCard from '../components/ActivityCard.vue'
import { mockPosts } from '../data/mockData'
import { mockActivities } from '../data/activitiesData'
import { mockCircles } from '../data/circlesData'
import { useUserStore } from '../stores/userStore'
import type { Post, Activity, PurchaseRecord } from '../types'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// Get circle ID from route params
const circleId = computed(() => route.params.id as string)

// Find circle detail based on ID
const circleDetail = computed(() => {
  return mockCircles.find(circle => circle.id === circleId.value)
})

const canPurchase = computed(() => {
  if (!circleDetail.value?.isPaid) {
    return true
  }
  return (userStore.user?.diamonds || 0) >= (circleDetail.value.price || 0)
})

// Tab management
const activeTab = ref('posts')
const tabs = [
  { id: 'posts', name: '帖子' },
  { id: 'activities', name: '活动' },
  { id: 'members', name: '成员' }
]

// Mock data for different tabs
const posts = ref<Post[]>(mockPosts.slice(0, 10))
const activities = ref<Activity[]>(mockActivities.slice(0, 5))
const members = ref([
  { id: 1, name: '小美', role: 'Owner' },
  { id: 2, name: '阿强', role: 'Admin' },
  { id: 3, name: '小雨', role: 'Member' },
  { id: 4, name: '小明', role: 'Member' },
  { id: 5, name: '小丽', role: 'Member' }
])

const mockPostCount = 2340
const showPurchaseSuccess = ref(false)

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

// Actions
const handleJoinCircle = () => {
  if (!userStore.isLoggedIn) {
    router.push({ name: 'login', query: { from: 'circle-join' } })
    return
  }

  if (circleDetail.value?.isPaid) {
    handlePurchase()
  } else {
    userStore.joinCircle(circleDetail.value?.id || '')
    console.log('Joined free circle:', circleDetail.value?.name)
  }
}

const handlePurchase = async () => {
  if (!circleDetail.value || !canPurchase.value) return

  try {
    // Simulate purchase process
    const success = userStore.spendDiamonds(circleDetail.value.price || 0)
    
    if (success) {
      // Add purchase record
      const purchaseRecord: PurchaseRecord = {
        id: Date.now().toString(),
        circleId: circleDetail.value.id,
        circleName: circleDetail.value.name,
        amount: circleDetail.value.price || 0,
        paymentMethod: 'diamonds',
        timestamp: new Date(),
        status: 'success'
      }
      userStore.addPurchaseRecord(purchaseRecord)
      
      // Join the circle
      userStore.joinCircle(circleDetail.value.id)
      
      // Show success modal
      showPurchaseSuccess.value = true
      
      console.log('Successfully purchased circle:', circleDetail.value.name)
    } else {
      alert('钻石不足，请先充值')
    }
  } catch (error) {
    console.error('Purchase failed:', error)
    alert('购买失败，请重试')
  }
}

const handleRecharge = () => {
  // Navigate to recharge page
  router.push({ name: 'recharge' })
}

const handleLike = (postId: string) => {
  const postIndex = posts.value.findIndex(post => post.id === postId)
  if (postIndex !== -1) {
    const post = posts.value[postIndex]
    post.liked = !post.liked
    post.likes = post.liked ? post.likes + 1 : post.likes - 1
  }
}

const handleParticipate = (activityId: string) => {
  if (!userStore.isLoggedIn) {
    router.push({ name: 'login', query: { from: 'activity' } })
    return
  }
  
  const activity = activities.value.find(a => a.id === activityId)
  if (activity) {
    activity.isParticipating = true
    activity.currentParticipants += 1
    console.log('Participated in activity:', activity.title)
    alert(`成功参加活动: ${activity.title}`)
  }
}

const handleViewActivityDetail = (activity: Activity) => {
  console.log('View activity detail:', activity.title)
  alert(`查看活动详情: ${activity.title}`)
}

onMounted(() => {
  // Initialize any required data
})
</script>