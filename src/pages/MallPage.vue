<template>
  <div class="pb-20">
    <!-- Search Bar -->
    <div class="p-4 bg-white">
      <div class="relative">
        <Search :size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索商品..."
          class="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
        />
      </div>
    </div>

    <!-- Banner -->
    <div class="mx-4 mb-4">
      <div class="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div class="relative z-10">
          <h2 class="text-xl font-bold mb-1">限时特惠</h2>
          <p class="text-orange-100 text-sm mb-3">精选商品最高立减50%</p>
          <button class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors duration-200">
            立即抢购
          </button>
        </div>
        <div class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
      </div>
    </div>

    <!-- Categories -->
    <div class="bg-white mb-4">
      <div class="px-4 py-3 border-b border-gray-100">
        <h3 class="font-semibold text-gray-900">商品分类</h3>
      </div>
      <CategoryGrid
        :categories="categories"
        @category-select="selectedCategory = $event"
      />
    </div>

    <!-- Filter Chips -->
    <div v-if="selectedCategory" class="px-4 mb-4">
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">已选择:</span>
        <div class="flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
          <span>{{ selectedCategory.name }}</span>
          <button
            @click="selectedCategory = null"
            class="ml-1 text-blue-500 hover:text-blue-700"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="px-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-900">
          {{ selectedCategory ? `${selectedCategory.name}商品` : '热门商品' }}
        </h3>
        <span class="text-sm text-gray-500">
          共{{ filteredProducts.length }}件商品
        </span>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product" 
        />
      </div>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Search :size="32" class="text-gray-400" />
        </div>
        <p class="text-gray-500 mb-2">没有找到相关商品</p>
        <button 
          @click="clearFilters"
          class="text-blue-600 text-sm hover:text-blue-700 transition-colors duration-200"
        >
          清除筛选条件
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from 'lucide-vue-next'
import ProductCard from '../components/ProductCard.vue'
import CategoryGrid from '../components/CategoryGrid.vue'
import { mockProducts, mockCategories } from '../data/mockData'
import type { Category } from '../types'

const selectedCategory = ref<Category | null>(null)
const searchQuery = ref('')

const categories = mockCategories
const products = mockProducts

const filteredProducts = computed(() => {
  return products.filter(product => {
    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value.name
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

const clearFilters = () => {
  selectedCategory.value = null
  searchQuery.value = ''
}
</script>