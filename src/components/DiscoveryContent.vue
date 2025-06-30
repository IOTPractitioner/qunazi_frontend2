<template>
  <div>
    <!-- Stories Section -->
    <div class="bg-white p-4 border-b border-gray-100">
      <div class="flex space-x-4 overflow-x-auto scrollbar-hide">
        <div class="flex-shrink-0 text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-2">
            <Plus :size="24" class="text-white" />
          </div>
          <p class="text-xs text-gray-600">发布</p>
        </div>
        
        <div v-for="i in 5" :key="i" class="flex-shrink-0 text-center">
          <div class="w-16 h-16 rounded-full p-0.5 bg-gradient-to-r from-pink-500 to-yellow-500">
            <img
              :src="`https://images.pexels.com/photos/${774909 + i}/pexels-photo-${774909 + i}.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop`"
              alt="Story"
              class="w-full h-full rounded-full object-cover border-2 border-white"
            />
          </div>
          <p class="text-xs text-gray-600 mt-1">用户{{ i }}</p>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
      <div class="flex space-x-4">
        <button class="text-blue-600 text-sm font-semibold border-b-2 border-blue-600 pb-1">
          推荐
        </button>
        <button class="text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors duration-200">
          关注
        </button>
        <button class="text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors duration-200">
          热门
        </button>
      </div>
      
      <button class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
        <Filter :size="18" class="text-gray-600" />
      </button>
    </div>

    <!-- Posts -->
    <div class="p-4">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @like="handleLike"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Filter } from 'lucide-vue-next'
import PostCard from './PostCard.vue'
import { mockPosts } from '../data/mockData'
import type { Post } from '../types'

const posts = ref<Post[]>(mockPosts)

const handleLike = (postId: string) => {
  const postIndex = posts.value.findIndex(post => post.id === postId)
  if (postIndex !== -1) {
    const post = posts.value[postIndex]
    post.liked = !post.liked
    post.likes = post.liked ? post.likes + 1 : post.likes - 1
  }
}
</script>