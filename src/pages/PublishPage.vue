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
        
        <h1 class="text-lg font-bold text-gray-900">发布动态</h1>
        
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

    <!-- Content -->
    <div class="p-4">
      <!-- User Info -->
      <div class="flex items-center space-x-3 mb-4">
        <img
          :src="userStore.user?.avatar"
          :alt="userStore.user?.name"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 class="font-semibold text-gray-900">{{ userStore.user?.name }}</h3>
          <div class="flex items-center space-x-2">
            <button
              @click="showVisibilityMenu = !showVisibilityMenu"
              class="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <component :is="visibilityOptions[selectedVisibility].icon" :size="14" />
              <span>{{ visibilityOptions[selectedVisibility].label }}</span>
              <ChevronDown :size="14" />
            </button>
          </div>
        </div>
      </div>

      <!-- Visibility Menu -->
      <div v-if="showVisibilityMenu" class="mb-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          v-for="(option, key) in visibilityOptions"
          :key="key"
          @click="selectVisibility(key)"
          class="flex items-center space-x-3 w-full p-3 hover:bg-gray-50 transition-colors duration-200"
        >
          <component :is="option.icon" :size="18" :class="option.color" />
          <div class="text-left">
            <p class="font-medium text-gray-900">{{ option.label }}</p>
            <p class="text-sm text-gray-500">{{ option.description }}</p>
          </div>
          <div v-if="selectedVisibility === key" class="ml-auto">
            <Check :size="18" class="text-blue-500" />
          </div>
        </button>
      </div>

      <!-- Text Input -->
      <div class="mb-4">
        <textarea
          v-model="content"
          placeholder="分享你的想法..."
          class="w-full p-4 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          rows="6"
          maxlength="500"
        ></textarea>
        <div class="flex justify-between items-center mt-2 px-2">
          <span class="text-sm text-gray-500">{{ content.length }}/500</span>
        </div>
      </div>

      <!-- Media Upload -->
      <div class="mb-4">
        <!-- Image Grid -->
        <div v-if="images.length > 0" class="grid grid-cols-3 gap-2 mb-3">
          <div
            v-for="(image, index) in images"
            :key="index"
            class="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
          >
            <img
              :src="image.url"
              :alt="`Image ${index + 1}`"
              class="w-full h-full object-cover"
            />
            <button
              @click="removeImage(index)"
              class="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
            >
              <X :size="14" class="text-white" />
            </button>
          </div>
          
          <!-- Add More Button -->
          <button
            v-if="images.length < 9"
            @click="selectImages"
            class="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            <Plus :size="24" class="text-gray-400" />
          </button>
        </div>

        <!-- Upload Options -->
        <div v-if="images.length === 0" class="grid grid-cols-4 gap-3">
          <button
            @click="selectImages"
            class="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <Image :size="24" class="text-gray-500 mb-2" />
            <span class="text-xs text-gray-600">照片</span>
          </button>
          
          <button
            @click="selectVideo"
            class="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <Video :size="24" class="text-gray-500 mb-2" />
            <span class="text-xs text-gray-600">视频</span>
          </button>
          
          <button
            @click="openCamera"
            class="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <Camera :size="24" class="text-gray-500 mb-2" />
            <span class="text-xs text-gray-600">拍摄</span>
          </button>
          
          <button
            @click="addLocation"
            class="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <MapPin :size="24" class="text-gray-500 mb-2" />
            <span class="text-xs text-gray-600">位置</span>
          </button>
        </div>
      </div>

      <!-- Location -->
      <div v-if="location" class="mb-4 p-3 bg-white rounded-xl border border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <MapPin :size="16" class="text-blue-500" />
            <span class="text-sm text-gray-700">{{ location }}</span>
          </div>
          <button
            @click="location = ''"
            class="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X :size="14" class="text-gray-400" />
          </button>
        </div>
      </div>

      <!-- Additional Options -->
      <div class="space-y-3">
        <!-- Topic -->
        <button
          @click="addTopic"
          class="flex items-center justify-between w-full p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
        >
          <div class="flex items-center space-x-3">
            <Hash :size="20" class="text-blue-500" />
            <span class="text-gray-700">添加话题</span>
          </div>
          <ChevronRight :size="16" class="text-gray-400" />
        </button>

        <!-- Mention -->
        <button
          @click="mentionFriend"
          class="flex items-center justify-between w-full p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
        >
          <div class="flex items-center space-x-3">
            <AtSign :size="20" class="text-green-500" />
            <span class="text-gray-700">@提醒朋友</span>
          </div>
          <ChevronRight :size="16" class="text-gray-400" />
        </button>

        <!-- Circle -->
        <button
          @click="selectCircle"
          class="flex items-center justify-between w-full p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
        >
          <div class="flex items-center space-x-3">
            <Users :size="20" class="text-purple-500" />
            <span class="text-gray-700">选择圈子</span>
          </div>
          <ChevronRight :size="16" class="text-gray-400" />
        </button>
      </div>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ChevronDown, 
  ChevronRight,
  Check,
  Globe,
  Users,
  Lock,
  Eye,
  Plus,
  X,
  Image,
  Video,
  Camera,
  MapPin,
  Hash,
  AtSign
} from 'lucide-vue-next'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const userStore = useUserStore()
const fileInput = ref<HTMLInputElement>()

const content = ref('')
const images = ref<Array<{ url: string, file: File }>>([])
const location = ref('')
const selectedVisibility = ref('public')
const showVisibilityMenu = ref(false)

const visibilityOptions = {
  public: {
    label: '公开',
    description: '所有人可见',
    icon: Globe,
    color: 'text-blue-500'
  },
  friends: {
    label: '朋友圈',
    description: '仅朋友可见',
    icon: Users,
    color: 'text-green-500'
  },
  private: {
    label: '私密',
    description: '仅自己可见',
    icon: Lock,
    color: 'text-gray-500'
  },
  followers: {
    label: '粉丝可见',
    description: '关注我的人可见',
    icon: Eye,
    color: 'text-purple-500'
  }
}

const canPublish = computed(() => {
  return content.value.trim().length > 0 || images.value.length > 0
})

const selectVisibility = (key: string) => {
  selectedVisibility.value = key
  showVisibilityMenu.value = false
}

const selectImages = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (files) {
    Array.from(files).forEach(file => {
      if (images.value.length < 9) {
        const url = URL.createObjectURL(file)
        images.value.push({ url, file })
      }
    })
  }
  
  // Reset input
  if (target) target.value = ''
}

const removeImage = (index: number) => {
  const image = images.value[index]
  URL.revokeObjectURL(image.url)
  images.value.splice(index, 1)
}

const selectVideo = () => {
  alert('选择视频功能')
}

const openCamera = () => {
  alert('打开相机功能')
}

const addLocation = () => {
  // 模拟获取位置
  location.value = '北京市朝阳区'
}

const addTopic = () => {
  alert('添加话题功能')
}

const mentionFriend = () => {
  alert('@提醒朋友功能')
}

const selectCircle = () => {
  alert('选择圈子功能')
}

const handleCancel = () => {
  if (content.value.trim() || images.value.length > 0) {
    if (confirm('确定要放弃编辑吗？')) {
      // Clean up image URLs
      images.value.forEach(image => {
        URL.revokeObjectURL(image.url)
      })
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
    const publishData = {
      content: content.value,
      images: images.value.map(img => img.file),
      location: location.value,
      visibility: selectedVisibility.value
    }
    
    console.log('发布内容:', publishData)
    
    // 模拟上传
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('发布成功！')
    
    // Clean up and navigate
    images.value.forEach(image => {
      URL.revokeObjectURL(image.url)
    })
    
    router.push({ name: 'home' })
  } catch (error) {
    console.error('发布失败:', error)
    alert('发布失败，请重试')
  }
}
</script>