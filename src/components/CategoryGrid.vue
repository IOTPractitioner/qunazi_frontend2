<template>
  <div class="grid grid-cols-4 gap-4 p-4">
    <button
      v-for="category in categories"
      :key="category.id"
      @click="$emit('category-select', category)"
      class="flex flex-col items-center p-3 rounded-xl hover:scale-105 transform transition-all duration-200"
    >
      <div :class="[
        'w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-2 shadow-sm',
        category.color
      ]">
        {{ category.icon }}
      </div>
      <span class="text-sm font-medium text-gray-700">{{ category.name }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '../types'

interface Props {
  categories: Category[]
}

defineProps<Props>()
defineEmits<{
  'category-select': [category: Category]
}>()
</script>