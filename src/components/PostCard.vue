<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4 hover:shadow-md transition-shadow duration-300">
    <div class="p-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-3">
          <img
            :src="post.user.avatar"
            :alt="post.user.name"
            class="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <div>
            <div class="flex items-center space-x-1">
              <h3 class="font-semibold text-gray-900">{{ post.user.name }}</h3>
              <div 
                v-if="post.user.verified"
                class="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <p class="text-sm text-gray-500">{{ post.timestamp }}</p>
          </div>
        </div>
        <button class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
          <MoreHorizontal :size="16" class="text-gray-500" />
        </button>
      </div>

      <p class="text-gray-800 leading-relaxed mb-3">{{ post.content }}</p>

      <div v-if="post.image" class="relative mb-3 rounded-lg overflow-hidden bg-gray-100">
        <div v-if="!imageLoaded" class="w-full h-48 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
        <img
          :src="post.image"
          alt="Post content"
          :class="[
            'w-full h-48 object-cover transition-opacity duration-300',
            imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
          ]"
          @load="imageLoaded = true"
        />
      </div>

      <div class="flex items-center justify-between pt-3 border-t border-gray-100">
        <button
          @click="$emit('like', post.id)"
          :class="[
            'flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200',
            post.liked
              ? 'text-red-500 bg-red-50 hover:bg-red-100'
              : 'text-gray-600 hover:bg-gray-100 hover:text-red-500'
          ]"
        >
          <Heart
            :size="18"
            :class="[
              'transition-transform duration-200',
              post.liked ? 'fill-current scale-110' : 'hover:scale-110'
            ]"
          />
          <span class="text-sm font-medium">{{ post.likes }}</span>
        </button>

        <button class="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-blue-500 transition-all duration-200">
          <MessageCircle :size="18" />
          <span class="text-sm font-medium">{{ post.comments }}</span>
        </button>

        <button class="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-green-500 transition-all duration-200">
          <Share2 :size="18" />
          <span class="text-sm font-medium">{{ post.shares }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-vue-next'
import type { Post } from '../types'

interface Props {
  post: Post
}

defineProps<Props>()
defineEmits<{
  like: [postId: string]
}>()

const imageLoaded = ref(false)
</script>