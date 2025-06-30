<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3 hover:shadow-md transition-all duration-300 break-inside-avoid animate-fadeInUp">
    <div v-if="post.image" class="relative overflow-hidden">
      <div 
        v-if="!imageLoaded"
        :style="{ height: `${imageHeight}px` }"
        class="w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
      >
        <!-- Skeleton loading animation -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
      </div>
      <img
        :src="post.image"
        alt="Post content"
        :class="[
          'w-full object-cover transition-all duration-500',
          imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 absolute inset-0 scale-105'
        ]"
        :style="{ height: imageLoaded ? 'auto' : `${imageHeight}px` }"
        @load="handleImageLoad"
        loading="lazy"
      />
      
      <!-- Image overlay gradient for better text readability -->
      <div 
        v-if="imageLoaded"
        class="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
      ></div>
    </div>

    <div class="p-3">
      <p class="text-gray-800 text-sm leading-relaxed mb-3 line-clamp-3">{{ post.content }}</p>

      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-2">
          <div class="relative">
            <img
              :src="post.user.avatar"
              :alt="post.user.name"
              class="w-6 h-6 rounded-full object-cover ring-1 ring-gray-200"
              loading="lazy"
            />
            <div 
              v-if="post.user.verified"
              class="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
          <div class="flex items-center space-x-1">
            <span class="text-xs font-medium text-gray-700">{{ post.user.name }}</span>
          </div>
        </div>
        <button class="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200">
          <MoreHorizontal :size="14" class="text-gray-500" />
        </button>
      </div>

      <div class="flex items-center justify-between text-xs">
        <button
          @click="$emit('like', post.id)"
          :class="[
            'flex items-center space-x-1 px-2 py-1 rounded-full transition-all duration-200',
            post.liked
              ? 'text-red-500 bg-red-50 scale-105'
              : 'text-gray-600 hover:bg-gray-100 hover:text-red-500 hover:scale-105'
          ]"
        >
          <Heart
            :size="14"
            :class="[
              'transition-all duration-200',
              post.liked ? 'fill-current scale-110' : ''
            ]"
          />
          <span class="font-medium">{{ post.likes }}</span>
        </button>

        <button class="flex items-center space-x-1 px-2 py-1 rounded-full text-gray-600 hover:bg-gray-100 hover:text-blue-500 hover:scale-105 transition-all duration-200">
          <MessageCircle :size="14" />
          <span class="font-medium">{{ post.comments }}</span>
        </button>

        <button class="flex items-center space-x-1 px-2 py-1 rounded-full text-gray-600 hover:bg-gray-100 hover:text-green-500 hover:scale-105 transition-all duration-200">
          <Share2 :size="14" />
          <span class="font-medium">{{ post.shares }}</span>
        </button>
      </div>

      <div class="mt-2 text-xs text-gray-500">
        {{ post.timestamp }}
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
const imageHeight = ref(200)

const handleImageLoad = (e: Event) => {
  const img = e.target as HTMLImageElement
  const aspectRatio = img.naturalHeight / img.naturalWidth
  const containerWidth = 160 // Approximate width of container
  imageHeight.value = Math.min(containerWidth * aspectRatio, 300)
  imageLoaded.value = true
}
</script>