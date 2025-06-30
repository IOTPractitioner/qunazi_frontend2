<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-40">
      <div class="flex items-center justify-between">
        <button 
          @click="handleCancel"
          class="text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          取消
        </button>
        
        <h1 class="text-lg font-bold text-gray-900">发布活动</h1>
        
        <button
          @click="handlePublish"
          :disabled="!canPublish"
          :class="[
            'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200',
            canPublish
              ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          ]"
        >
          发布
        </button>
      </div>
    </div>

    <!-- Form Content -->
    <div class="p-4 space-y-4">
      <!-- Activity Title -->
      <div class="bg-white rounded-2xl p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">活动标题</label>
        <input
          v-model="formData.title"
          type="text"
          placeholder="输入活动标题..."
          class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          maxlength="50"
        />
        <div class="text-right text-xs text-gray-500 mt-1">
          {{ formData.title.length }}/50
        </div>
      </div>

      <!-- Activity Description -->
      <div class="bg-white rounded-2xl p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">活动描述</label>
        <textarea
          v-model="formData.description"
          placeholder="详细描述活动内容、目的和亮点..."
          class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          rows="4"
          maxlength="500"
        ></textarea>
        <div class="text-right text-xs text-gray-500 mt-1">
          {{ formData.description.length }}/500
        </div>
      </div>

      <!-- Activity Image -->
      <div class="bg-white rounded-2xl p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">活动封面</label>
        <div v-if="formData.image" class="relative mb-3">
          <img
            :src="formData.image"
            alt="Activity cover"
            class="w-full h-48 object-cover rounded-xl"
          />
          <button
            @click="removeImage"
            class="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
          >
            <X :size="16" class="text-white" />
          </button>
        </div>
        <button
          v-else
          @click="selectImage"
          class="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
        >
          <Image :size="32" class="text-gray-400 mb-2" />
          <span class="text-gray-500 text-sm">点击上传活动封面</span>
        </button>
      </div>

      <!-- Time Settings -->
      <div class="bg-white rounded-2xl p-4">
        <label class="block text-sm font-medium text-gray-700 mb-3">活动时间</label>
        <div class="space-y-3">
          <div>
            <label class="block text-xs text-gray-500 mb-1">开始时间</label>
            <input
              v-model="formData.startTime"
              type="datetime-local"
              class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">结束时间</label>
            <input
              v-model="formData.endTime"
              type="datetime-local"
              class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <!-- Location -->
      <div class="bg-white rounded-2xl p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">活动地点</label>
        <div class="relative">
          <MapPin :size="18" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            v-model="formData.location"
            type="text"
            placeholder="输入活动地点（可选）"
            class="w-full pl-10 pr-4 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <!-- Participants Limit -->
      <div class="bg-white rounded-2xl p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">参与人数</label>
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-2">
            <input
              v-model="hasParticipantLimit"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">限制参与人数</span>
          </div>
          <input
            v-if="hasParticipantLimit"
            v-model.number="formData.maxParticipants"
            type="number"
            min="1"
            max="1000"
            placeholder="最大人数"
            class="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <!-- Tags -->
      <div class="bg-white rounded-2xl p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">活动标签</label>
        <div class="flex flex-wrap gap-2 mb-3">
          <span
            v-for="tag in formData.tags"
            :key="tag"
            class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
          >
            <span>{{ tag }}</span>
            <button
              @click="removeTag(tag)"
              class="hover:bg-blue-200 rounded-full p-0.5 transition-colors duration-200"
            >
              <X :size="12" />
            </button>
          </span>
        </div>
        <div class="flex space-x-2">
          <input
            v-model="newTag"
            type="text"
            placeholder="添加标签"
            class="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            @keyup.enter="addTag"
            maxlength="10"
          />
          <button
            @click="addTag"
            :disabled="!newTag.trim() || formData.tags.length >= 5"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            添加
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-1">最多添加5个标签</p>
      </div>

      <!-- Requirements -->
      <div class="bg-white rounded-2xl p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">参与要求</label>
        <div class="space-y-2 mb-3">
          <div
            v-for="(requirement, index) in formData.requirements"
            :key="index"
            class="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
          >
            <span class="flex-1 text-sm">{{ requirement }}</span>
            <button
              @click="removeRequirement(index)"
              class="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
            >
              <X :size="14" class="text-gray-500" />
            </button>
          </div>
        </div>
        <div class="flex space-x-2">
          <input
            v-model="newRequirement"
            type="text"
            placeholder="添加参与要求"
            class="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            @keyup.enter="addRequirement"
          />
          <button
            @click="addRequirement"
            :disabled="!newRequirement.trim()"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            添加
          </button>
        </div>
      </div>

      <!-- Rewards -->
      <div class="bg-white rounded-2xl p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">活动奖励</label>
        <div class="space-y-2 mb-3">
          <div
            v-for="(reward, index) in formData.rewards"
            :key="index"
            class="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg"
          >
            <span class="flex-1 text-sm">{{ reward }}</span>
            <button
              @click="removeReward(index)"
              class="p-1 hover:bg-yellow-200 rounded-full transition-colors duration-200"
            >
              <X :size="14" class="text-gray-500" />
            </button>
          </div>
        </div>
        <div class="flex space-x-2">
          <input
            v-model="newReward"
            type="text"
            placeholder="添加活动奖励"
            class="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            @keyup.enter="addReward"
          />
          <button
            @click="addReward"
            :disabled="!newReward.trim()"
            class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            添加
          </button>
        </div>
      </div>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleImageSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { X, Image, MapPin } from 'lucide-vue-next'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const fileInput = ref<HTMLInputElement>()

const formData = ref({
  title: '',
  description: '',
  image: '',
  startTime: '',
  endTime: '',
  location: '',
  maxParticipants: 20,
  tags: [] as string[],
  requirements: [] as string[],
  rewards: [] as string[]
})

const hasParticipantLimit = ref(true)
const newTag = ref('')
const newRequirement = ref('')
const newReward = ref('')

const canPublish = computed(() => {
  return formData.value.title.trim().length > 0 &&
         formData.value.description.trim().length > 0 &&
         formData.value.startTime &&
         formData.value.endTime &&
         new Date(formData.value.startTime) < new Date(formData.value.endTime)
})

const selectImage = () => {
  fileInput.value?.click()
}

const handleImageSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const url = URL.createObjectURL(file)
    formData.value.image = url
  }
  
  // Reset input
  if (target) target.value = ''
}

const removeImage = () => {
  if (formData.value.image) {
    URL.revokeObjectURL(formData.value.image)
    formData.value.image = ''
  }
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !formData.value.tags.includes(tag) && formData.value.tags.length < 5) {
    formData.value.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (tag: string) => {
  const index = formData.value.tags.indexOf(tag)
  if (index > -1) {
    formData.value.tags.splice(index, 1)
  }
}

const addRequirement = () => {
  const requirement = newRequirement.value.trim()
  if (requirement) {
    formData.value.requirements.push(requirement)
    newRequirement.value = ''
  }
}

const removeRequirement = (index: number) => {
  formData.value.requirements.splice(index, 1)
}

const addReward = () => {
  const reward = newReward.value.trim()
  if (reward) {
    formData.value.rewards.push(reward)
    newReward.value = ''
  }
}

const removeReward = (index: number) => {
  formData.value.rewards.splice(index, 1)
}

const handleCancel = () => {
  if (Object.values(formData.value).some(value => 
    typeof value === 'string' ? value.trim() : 
    Array.isArray(value) ? value.length > 0 : false
  )) {
    if (confirm('确定要放弃编辑吗？')) {
      if (formData.value.image) {
        URL.revokeObjectURL(formData.value.image)
      }
      router.back()
    }
  } else {
    router.back()
  }
}

const handlePublish = async () => {
  if (!canPublish.value) return
  
  try {
    // 模拟发布API调用
    const activityData = {
      ...formData.value,
      maxParticipants: hasParticipantLimit.value ? formData.value.maxParticipants : undefined,
      circleId: route.query.circleId,
      organizer: userStore.user
    }
    
    console.log('发布活动:', activityData)
    
    // 模拟上传
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('活动发布成功！')
    
    // Clean up and navigate
    if (formData.value.image) {
      URL.revokeObjectURL(formData.value.image)
    }
    
    router.back()
  } catch (error) {
    console.error('发布失败:', error)
    alert('发布失败，请重试')
  }
}
</script>