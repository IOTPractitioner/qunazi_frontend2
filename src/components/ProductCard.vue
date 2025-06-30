<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
    <div class="relative">
      <div v-if="!imageLoaded" class="w-full h-48 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
      <img
        :src="product.image"
        :alt="product.name"
        :class="[
          'w-full h-48 object-cover transition-opacity duration-300',
          imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
        ]"
        @load="imageLoaded = true"
      />
      
      <div class="absolute top-2 left-2 flex flex-col space-y-1">
        <span v-if="product.hot" class="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
          热销
        </span>
        <span v-if="product.new" class="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
          新品
        </span>
      </div>

      <button class="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors duration-200">
        <ShoppingCart :size="16" class="text-gray-600" />
      </button>
    </div>

    <div class="p-4">
      <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
        {{ product.name }}
      </h3>

      <div class="flex items-center space-x-1 mb-2">
        <div class="flex items-center">
          <Star
            v-for="i in 5"
            :key="i"
            :size="12"
            :class="[
              i <= Math.floor(product.rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            ]"
          />
        </div>
        <span class="text-xs text-gray-500">({{ product.reviews }})</span>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-lg font-bold text-red-500">
            ¥{{ product.price }}
          </span>
          <span v-if="product.originalPrice" class="text-sm text-gray-400 line-through">
            ¥{{ product.originalPrice }}
          </span>
        </div>
      </div>

      <div class="flex flex-wrap gap-1 mt-2">
        <span
          v-for="(tag, index) in product.tags"
          :key="index"
          class="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Star, ShoppingCart } from 'lucide-vue-next'
import type { Product } from '../types'

interface Props {
  product: Product
}

defineProps<Props>()

const imageLoaded = ref(false)
</script>