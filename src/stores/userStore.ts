import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PurchaseRecord } from '../types'

interface User {
  id: string
  name: string
  avatar: string
  phone: string
  verified: boolean
  diamonds?: number
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = ref(false)
  const joinedCircles = ref<Set<string>>(new Set())
  const purchaseHistory = ref<PurchaseRecord[]>([])
  const purchasedPosts = ref<Set<string>>(new Set()) // 已购买的付费帖子

  const login = (userData: User) => {
    user.value = {
      ...userData,
      diamonds: userData.diamonds || 1000 // 默认给用户1000钻石
    }
    isLoggedIn.value = true
    // 可以在这里保存到 localStorage
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('joinedCircles', JSON.stringify(Array.from(joinedCircles.value)))
    localStorage.setItem('purchasedPosts', JSON.stringify(Array.from(purchasedPosts.value)))
  }

  const logout = () => {
    user.value = null
    isLoggedIn.value = false
    joinedCircles.value.clear()
    purchaseHistory.value = []
    purchasedPosts.value.clear()
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('joinedCircles')
    localStorage.removeItem('purchasedPosts')
  }

  const initializeAuth = () => {
    const savedUser = localStorage.getItem('user')
    const savedLoginStatus = localStorage.getItem('isLoggedIn')
    const savedJoinedCircles = localStorage.getItem('joinedCircles')
    const savedPurchasedPosts = localStorage.getItem('purchasedPosts')
    
    if (savedUser && savedLoginStatus === 'true') {
      user.value = JSON.parse(savedUser)
      isLoggedIn.value = true
      
      if (savedJoinedCircles) {
        joinedCircles.value = new Set(JSON.parse(savedJoinedCircles))
      }
      
      if (savedPurchasedPosts) {
        purchasedPosts.value = new Set(JSON.parse(savedPurchasedPosts))
      }
    }
  }

  const joinCircle = (circleId: string) => {
    joinedCircles.value.add(circleId)
    localStorage.setItem('joinedCircles', JSON.stringify(Array.from(joinedCircles.value)))
  }

  const leaveCircle = (circleId: string) => {
    joinedCircles.value.delete(circleId)
    localStorage.setItem('joinedCircles', JSON.stringify(Array.from(joinedCircles.value)))
  }

  const isCircleJoined = (circleId: string): boolean => {
    return joinedCircles.value.has(circleId)
  }

  const spendDiamonds = (amount: number): boolean => {
    if (!user.value || (user.value.diamonds || 0) < amount) {
      return false
    }
    
    user.value.diamonds = (user.value.diamonds || 0) - amount
    localStorage.setItem('user', JSON.stringify(user.value))
    return true
  }

  const addDiamonds = (amount: number) => {
    if (user.value) {
      user.value.diamonds = (user.value.diamonds || 0) + amount
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  const addPurchaseRecord = (record: PurchaseRecord) => {
    purchaseHistory.value.unshift(record)
  }

  const addPostPurchase = (postId: string) => {
    purchasedPosts.value.add(postId)
    localStorage.setItem('purchasedPosts', JSON.stringify(Array.from(purchasedPosts.value)))
  }

  const isPostPurchased = (postId: string): boolean => {
    return purchasedPosts.value.has(postId)
  }

  return {
    user,
    isLoggedIn,
    joinedCircles,
    purchaseHistory,
    purchasedPosts,
    login,
    logout,
    initializeAuth,
    joinCircle,
    leaveCircle,
    isCircleJoined,
    spendDiamonds,
    addDiamonds,
    addPurchaseRecord,
    addPostPurchase,
    isPostPurchased
  }
})