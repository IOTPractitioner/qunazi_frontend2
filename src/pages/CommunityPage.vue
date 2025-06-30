<template>
  <div class="pb-20">
    <PullToRefresh @refresh="handleRefresh">
      <!-- Tab Header -->
      <div class="bg-white px-4 py-3 border-b border-gray-100">
        <div class="flex items-center justify-center space-x-1">
          <button
            @click="activeTab = 'discovery'"
            :class="[
              'px-6 py-2 rounded-full text-sm font-medium transition-all duration-200',
              activeTab === 'discovery'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            发现
          </button>
          <button
            @click="activeTab = 'nearby'"
            :class="[
              'px-6 py-2 rounded-full text-sm font-medium transition-all duration-200',
              activeTab === 'nearby'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            附近
          </button>
        </div>
      </div>

      <!-- Content -->
      <component :is="activeTab === 'discovery' ? DiscoveryContent : NearbyContent" />

      <!-- Floating Action Button -->
      <button class="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transform transition-all duration-200 z-40">
        <Plus :size="24" class="text-white" />
      </button>
    </PullToRefresh>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import PullToRefresh from '../components/PullToRefresh.vue'
import DiscoveryContent from '../components/DiscoveryContent.vue'
import NearbyContent from '../components/NearbyContent.vue'

const activeTab = ref<'discovery' | 'nearby'>('discovery')

const handleRefresh = async () => {
  await new Promise(resolve => setTimeout(resolve, 1500))
  console.log('Community page refreshed')
}
</script>