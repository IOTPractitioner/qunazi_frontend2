<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4 hover:shadow-md transition-shadow duration-300">
    <div class="p-4">
      <!-- User Info -->
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

      <!-- Paid Post Badge -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-2">
          <div class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
            <Gem :size="12" />
            <span class="text-xs font-bold">付费帖子</span>
          </div>
          <span class="text-sm text-gray-600">{{ post.price }} 💎</span>
        </div>
        <div v-if="post.isPurchased" class="bg-green-100 text-green-700 px-2 py-1 rounded-full">
          <div class="flex items-center space-x-1">
            <Check :size="12" />
            <span class="text-xs font-medium">已购买</span>
          </div>
        </div>
      </div>

      <!-- Content (Blurred if not purchased) -->
      <div 
        :class="[
          'relative mb-3',
          !post.isPurchased && 'cursor-pointer'
        ]"
        @click="!post.isPurchased && handlePurchaseClick()"
      >
        <!-- Blurred Content -->
        <div 
          v-if="!post.isPurchased"
          :class="[
            'filter blur-sm select-none pointer-events-none',
            'transition-all duration-300'
          ]"
        >
          <p class="text-gray-800 leading-relaxed mb-3">{{ post.content }}</p>
          <div v-if="post.image" class="relative mb-3 rounded-lg overflow-hidden bg-gray-100">
            <img
              :src="post.image"
              alt="Post content"
              class="w-full h-48 object-cover"
            />
          </div>
        </div>

        <!-- Clear Content (if purchased) -->
        <div v-else>
          <p class="text-gray-800 leading-relaxed mb-3">{{ post.content }}</p>
          <div v-if="post.image" class="relative mb-3 rounded-lg overflow-hidden bg-gray-100">
            <img
              :src="post.image"
              alt="Post content"
              class="w-full h-48 object-cover"
            />
          </div>
        </div>

        <!-- Purchase Overlay -->
        <div 
          v-if="!post.isPurchased"
          class="absolute inset-0 bg-black/10 flex items-center justify-center backdrop-blur-[1px]"
        >
          <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-gray-200">
            <div class="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Lock :size="20" class="text-white" />
            </div>
            <h4 class="font-bold text-gray-900 mb-2">付费内容</h4>
            <p class="text-sm text-gray-600 mb-3">支付 {{ post.price }} 💎 解锁完整内容</p>
            <button
              @click.stop="handlePurchaseClick"
              class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              立即购买
            </button>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between pt-3 border-t border-gray-100">
        <button
          @click="$emit('like', post.id)"
          :disabled="!post.isPurchased"
          :class="[
            'flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200',
            !post.isPurchased 
              ? 'text-gray-400 cursor-not-allowed'
              : post.liked
                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                : 'text-gray-600 hover:bg-gray-100 hover:text-red-500'
          ]"
        >
          <Heart
            :size="18"
            :class="[
              'transition-transform duration-200',
              post.liked && post.isPurchased ? 'fill-current scale-110' : 'hover:scale-110'
            ]"
          />
          <span class="text-sm font-medium">{{ post.likes }}</span>
        </button>

        <button 
          :disabled="!post.isPurchased"
          :class="[
            'flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200',
            !post.isPurchased 
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100 hover:text-blue-500'
          ]"
        >
          <MessageCircle :size="18" />
          <span class="text-sm font-medium">{{ post.comments }}</span>
        </button>

        <button 
          :disabled="!post.isPurchased"
          :class="[
            'flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200',
            !post.isPurchased 
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100 hover:text-green-500'
          ]"
        >
          <Share2 :size="18" />
          <span class="text-sm font-medium">{{ post.shares }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Heart, MessageCircle, Share2, MoreHorizontal, Gem, Lock, Check } from 'lucide-vue-next'
import type { Post } from '../types'

interface Props {
  post: Post
}

defineProps<Props>()
defineEmits<{
  like: [postId: string]
  'purchase-click': [post: Post]
}>()

const handlePurchaseClick = () => {
  emit('purchase-click', props.post)
}
</script>