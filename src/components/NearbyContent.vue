<template>
  <div class="p-4">
    <div class="mb-4">
      <h3 class="text-lg font-bold text-gray-900 mb-2">附近博主</h3>
      <p class="text-sm text-gray-500">基于您的位置推荐附近的优质博主</p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="user in nearbyUsers"
        :key="user.id"
        @click="handleUserClick(user)"
        class="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transform hover:scale-105 transition-all duration-200"
      >
        <!-- Distance Badge -->
        <div class="absolute top-3 left-3 z-10">
          <span class="bg-yellow-400 text-black text-xs font-medium px-2 py-1 rounded-full">
            {{ user.distance }}
          </span>
        </div>

        <!-- User Avatar -->
        <div class="relative h-32 bg-gradient-to-br from-blue-400 to-purple-500">
          <img
            :src="user.avatar"
            :alt="user.name"
            class="absolute bottom-0 right-0 w-20 h-20 object-cover rounded-tl-2xl"
          />
          
          <!-- Location Badge -->
          <div class="absolute bottom-3 left-3">
            <div class="flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
              <span class="text-white text-xs font-medium">{{ user.location }}</span>
              <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>

        <!-- User Info -->
        <div class="p-3">
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center space-x-1">
              <h4 class="font-semibold text-gray-900 text-sm truncate">
                {{ user.name }}
              </h4>
              <div 
                v-if="user.verified"
                class="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div class="flex items-center justify-between text-xs text-gray-500">
            <div class="flex items-center space-x-1">
              <Users :size="12" />
              <span>{{ formatFollowers(user.followers) }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <MapPin :size="12" />
              <span>附近</span>
            </div>
          </div>
        </div>
      </button>
    </div>

    <!-- Load More -->
    <div class="mt-6">
      <button class="w-full py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors duration-200">
        查看更多附近博主
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users, MapPin } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import type { NearbyUser } from '../types'

const router = useRouter()

const nearbyUsers: NearbyUser[] = [
  {
    id: '1',
    name: '武汉小美',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    distance: '3392.68km',
    location: '武汉',
    verified: true,
    followers: 23424
  },
  {
    id: '2',
    name: '郑州阿强',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    distance: '3952.9km',
    location: '郑州',
    verified: false,
    followers: 23424
  }
]

const formatFollowers = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}

const handleUserClick = (user: NearbyUser) => {
  console.log('User clicked:', user.name)
  router.push({ name: 'user-profile', params: { id: user.id } })
}
</script>