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
        
        <div class="text-center">
          <h1 class="text-lg font-bold text-gray-900">{{ userProfile.name }}</h1>
          <p class="text-sm text-gray-500">@{{ id }}</p>
        </div>
        
        <button class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
          <MoreHorizontal :size="20" class="text-gray-600" />
        </button>
      </div>
    </div>

    <!-- Cover Image -->
    <div class="relative h-48 bg-gradient-to-r from-blue-400 to-purple-500">
      <img
        :src="userProfile.coverImage"
        alt="Cover"
        class="w-full h-full object-cover opacity-80"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
    </div>

    <!-- Profile Info -->
    <div class="relative px-4 pb-6">
      <!-- Avatar -->
      <div class="relative -mt-16 mb-4">
        <div class="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
          <img
            :src="userProfile.avatar"
            :alt="userProfile.name"
            class="w-full h-full object-cover"
          />
        </div>
        <div 
          v-if="userProfile.verified"
          class="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white"
        >
          <div class="w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>

      <!-- User Info -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <div>
            <h2 class="text-xl font-bold text-gray-900">{{ userProfile.name }}</h2>
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <MapPin :size="14" />
              <span>{{ userProfile.location }}</span>
              <span>•</span>
              <Calendar :size="14" />
              <span>加入于 {{ new Date(userProfile.joinDate).getFullYear() }}年</span>
            </div>
          </div>
        </div>

        <!-- Bio -->
        <p class="text-gray-700 leading-relaxed mb-3 whitespace-pre-line">
          {{ userProfile.bio }}
        </p>

        <!-- Badges -->
        <div class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="(badge, index) in userProfile.badges"
            :key="index"
            class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
          >
            {{ badge }}
          </span>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="text-center">
          <p class="text-xl font-bold text-gray-900">{{ formatNumber(userProfile.posts) }}</p>
          <p class="text-sm text-gray-500">动态</p>
        </div>
        <div class="text-center">
          <p class="text-xl font-bold text-gray-900">{{ formatNumber(userProfile.followers) }}</p>
          <p class="text-sm text-gray-500">粉丝</p>
        </div>
        <div class="text-center">
          <p class="text-xl font-bold text-gray-900">{{ formatNumber(userProfile.following) }}</p>
          <p class="text-sm text-gray-500">关注</p>
        </div>
        <div class="text-center">
          <p class="text-xl font-bold text-gray-900">{{ formatNumber(userProfile.likes) }}</p>
          <p class="text-sm text-gray-500">获赞</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-3 mb-6">
        <button
          @click="handleFollow"
          :class="[
            'flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200',
            isFollowing
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          ]"
        >
          <div class="flex items-center justify-center space-x-2">
            <UserPlus :size="18" />
            <span>{{ isFollowing ? '已关注' : '关注' }}</span>
          </div>
        </button>
        
        <button
          @click="handleMessage"
          class="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
        >
          <MessageSquare :size="18" />
        </button>
        
        <button
          @click="handleGift"
          class="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Gift :size="18" />
        </button>
      </div>
    </div>

    <!-- Content Tabs -->
    <div class="bg-white border-t border-gray-100">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex space-x-6">
          <button
            @click="activeTab = 'posts'"
            :class="[
              'text-sm font-medium transition-colors duration-200',
              activeTab === 'posts'
                ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            动态 {{ userProfile.posts }}
          </button>
          <button
            @click="activeTab = 'likes'"
            :class="[
              'text-sm font-medium transition-colors duration-200',
              activeTab === 'likes'
                ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            喜欢
          </button>
          <button
            @click="activeTab = 'collections'"
            :class="[
              'text-sm font-medium transition-colors duration-200',
              activeTab === 'collections'
                ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            收藏
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="bg-gray-50 min-h-screen">
      <div v-if="activeTab === 'posts'" class="p-8 text-center">
        <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Grid3X3 :size="32" class="text-gray-400" />
        </div>
        <p class="text-gray-500 mb-2">暂无动态内容</p>
        <p class="text-gray-400 text-sm">用户的动态会显示在这里</p>
      </div>
      
      <div v-if="activeTab === 'likes'" class="p-8 text-center">
        <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Heart :size="32" class="text-gray-400" />
        </div>
        <p class="text-gray-500 mb-2">暂无喜欢的内容</p>
        <p class="text-gray-400 text-sm">用户喜欢的动态会显示在这里</p>
      </div>
      
      <div v-if="activeTab === 'collections'" class="p-8 text-center">
        <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Star :size="32" class="text-gray-400" />
        </div>
        <p class="text-gray-500 mb-2">暂无收藏内容</p>
        <p class="text-gray-400 text-sm">用户收藏的内容会显示在这里</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  ArrowLeft, 
  MoreHorizontal, 
  MapPin, 
  Calendar, 
  UserPlus,
  MessageSquare,
  Gift,
  Star,
  Heart,
  Grid3X3
} from 'lucide-vue-next'
import type { UserProfile } from '../types'

interface Props {
  id: string
}

const props = defineProps<Props>()

const activeTab = ref<'posts' | 'likes' | 'collections'>('posts')
const isFollowing = ref(false)

const userProfile: UserProfile = {
  id: props.id,
  name: '小美',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  verified: true,
  bio: '热爱生活，喜欢分享美好时光 ✨\n📍 武汉 | 🎨 摄影爱好者 | 🍰 美食探索家',
  location: '武汉市',
  joinDate: '2022-03-15',
  followers: 23424,
  following: 892,
  posts: 156,
  likes: 45678,
  coverImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=300&fit=crop',
  isFollowing: false,
  badges: ['优质创作者', '活跃用户', '摄影达人'],
  level: 15,
  experience: 2340,
  maxExperience: 3000,
  honorBadges: [],
  receivedGifts: []
}

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

const handleFollow = () => {
  isFollowing.value = !isFollowing.value
  console.log(isFollowing.value ? 'Followed' : 'Unfollowed', userProfile.name)
}

const handleMessage = () => {
  console.log('Send message to', userProfile.name)
  alert(`发送私信给 ${userProfile.name}`)
}

const handleGift = () => {
  console.log('Open gift modal for', userProfile.name)
  alert(`送礼物给 ${userProfile.name}`)
}
</script>