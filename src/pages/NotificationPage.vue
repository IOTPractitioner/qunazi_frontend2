<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3 z-40">
      <div class="flex items-center justify-between">
        <button 
          @click="$router.back()"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ArrowLeft :size="20" class="text-gray-600" />
        </button>
        
        <h1 class="text-lg font-bold text-gray-900">消息通知</h1>
        
        <button 
          @click="markAllAsRead"
          class="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
        >
          全部已读
        </button>
      </div>
    </div>

    <!-- Notification Tabs -->
    <div class="bg-white px-4 py-3 border-b border-gray-100">
      <div class="flex space-x-6">
        <button
          v-for="tab in notificationTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex items-center space-x-2 pb-2 text-sm font-medium transition-colors duration-200 border-b-2',
            activeTab === tab.id
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-900'
          ]"
        >
          <component :is="tab.icon" :size="16" />
          <span>{{ tab.name }}</span>
          <span v-if="getUnreadCount(tab.id) > 0" class="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {{ getUnreadCount(tab.id) > 99 ? '99+' : getUnreadCount(tab.id) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="pb-20">
      <div v-if="filteredNotifications.length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Bell :size="32" class="text-gray-400" />
        </div>
        <p class="text-gray-500 mb-2">暂无{{ getTabName(activeTab) }}通知</p>
        <p class="text-gray-400 text-sm">新的通知会显示在这里</p>
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          @click="handleNotificationClick(notification)"
          :class="[
            'p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer relative',
            !notification.read ? 'bg-blue-50/50' : 'bg-white'
          ]"
        >
          <!-- Unread indicator -->
          <div 
            v-if="!notification.read"
            class="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"
          ></div>

          <div class="flex items-start space-x-3 ml-4">
            <!-- Avatar/Icon -->
            <div class="flex-shrink-0">
              <img
                v-if="notification.avatar"
                :src="notification.avatar"
                :alt="notification.title"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div
                v-else
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  getNotificationColor(notification.type)
                ]"
              >
                <component :is="getNotificationIcon(notification.type)" :size="20" class="text-white" />
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 :class="[
                    'text-sm leading-tight mb-1',
                    !notification.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'
                  ]">
                    {{ notification.title }}
                  </h3>
                  <p class="text-sm text-gray-600 leading-relaxed mb-2">
                    {{ notification.content }}
                  </p>
                  
                  <!-- Action buttons for certain types -->
                  <div v-if="notification.type === 'follow' || notification.type === 'friend_request'" class="flex space-x-2 mt-2">
                    <button
                      @click.stop="handleAccept(notification)"
                      class="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors duration-200"
                    >
                      {{ notification.type === 'follow' ? '回关' : '接受' }}
                    </button>
                    <button
                      @click.stop="handleReject(notification)"
                      class="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors duration-200"
                    >
                      {{ notification.type === 'follow' ? '忽略' : '拒绝' }}
                    </button>
                  </div>
                </div>
                
                <div class="flex flex-col items-end ml-2">
                  <span class="text-xs text-gray-500 whitespace-nowrap">
                    {{ formatTime(notification.timestamp) }}
                  </span>
                  <button
                    v-if="!notification.read"
                    @click.stop="markAsRead(notification.id)"
                    class="mt-1 p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                  >
                    <X :size="12" class="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Bell, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  ShoppingBag,
  Gift,
  Star,
  Zap,
  X
} from 'lucide-vue-next'
import type { Notification } from '../types'

const router = useRouter()
const activeTab = ref('all')

const notificationTabs = [
  { id: 'all', name: '全部', icon: Bell },
  { id: 'like', name: '点赞', icon: Heart },
  { id: 'comment', name: '评论', icon: MessageCircle },
  { id: 'follow', name: '关注', icon: UserPlus },
  { id: 'system', name: '系统', icon: Zap }
]

// Mock notifications data
const notifications = ref<Notification[]>([
  {
    id: '1',
    type: 'like',
    title: '小明 点赞了你的动态',
    content: '你分享的街拍照片真的很棒！',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
    actionUrl: '/post/123'
  },
  {
    id: '2',
    type: 'comment',
    title: '小雨 评论了你的动态',
    content: '这个地方我也去过，风景确实很美！下次一起去吧～',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
    actionUrl: '/post/124'
  },
  {
    id: '3',
    type: 'follow',
    title: '阿强 关注了你',
    content: '开始关注你的动态，期待更多精彩内容！',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    read: false,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
    actionUrl: '/user/2'
  },
  {
    id: '4',
    type: 'system',
    title: '系统通知',
    content: '你的订单已发货，预计3-5个工作日内送达，请注意查收。',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    read: true,
    actionUrl: '/orders/456'
  },
  {
    id: '5',
    type: 'like',
    title: '小丽 点赞了你的评论',
    content: '在"今天不想不开心"圈子中',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    read: true,
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
    actionUrl: '/circle/1'
  },
  {
    id: '6',
    type: 'system',
    title: '活动提醒',
    content: '双十一大促活动即将开始，记得参与抢购哦！',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    read: true,
    actionUrl: '/promotion/double11'
  }
])

const filteredNotifications = computed(() => {
  if (activeTab.value === 'all') {
    return notifications.value
  }
  return notifications.value.filter(n => n.type === activeTab.value)
})

const getUnreadCount = (tabId: string): number => {
  if (tabId === 'all') {
    return notifications.value.filter(n => !n.read).length
  }
  return notifications.value.filter(n => n.type === tabId && !n.read).length
}

const getTabName = (tabId: string): string => {
  const tab = notificationTabs.find(t => t.id === tabId)
  return tab ? tab.name : ''
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'like': return Heart
    case 'comment': return MessageCircle
    case 'follow': return UserPlus
    case 'system': return Bell
    case 'order': return ShoppingBag
    case 'gift': return Gift
    case 'achievement': return Star
    default: return Bell
  }
}

const getNotificationColor = (type: string): string => {
  switch (type) {
    case 'like': return 'bg-red-500'
    case 'comment': return 'bg-blue-500'
    case 'follow': return 'bg-green-500'
    case 'system': return 'bg-gray-500'
    case 'order': return 'bg-purple-500'
    case 'gift': return 'bg-pink-500'
    case 'achievement': return 'bg-yellow-500'
    default: return 'bg-gray-500'
  }
}

const formatTime = (timestamp: Date): string => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return timestamp.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

const handleNotificationClick = (notification: Notification) => {
  // Mark as read when clicked
  if (!notification.read) {
    markAsRead(notification.id)
  }
  
  // Navigate to the related content
  if (notification.actionUrl) {
    console.log('Navigate to:', notification.actionUrl)
    // You can implement navigation logic here
    if (notification.actionUrl.startsWith('/user/')) {
      const userId = notification.actionUrl.split('/')[2]
      router.push({ name: 'user-profile', params: { id: userId } })
    } else {
      alert(`跳转到: ${notification.actionUrl}`)
    }
  }
}

const markAsRead = (notificationId: string) => {
  const notification = notifications.value.find(n => n.id === notificationId)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => {
    n.read = true
  })
}

const handleAccept = (notification: Notification) => {
  console.log('Accept:', notification.title)
  markAsRead(notification.id)
  alert(`已${notification.type === 'follow' ? '回关' : '接受'}: ${notification.title}`)
}

const handleReject = (notification: Notification) => {
  console.log('Reject:', notification.title)
  markAsRead(notification.id)
  alert(`已${notification.type === 'follow' ? '忽略' : '拒绝'}: ${notification.title}`)
}
</script>