export interface User {
  id: string
  name: string
  avatar: string
  verified: boolean
  diamonds?: number // 钻石余额
}

export interface Post {
  id: string
  user: User
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  timestamp: string
  liked: boolean
}

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  tags: string[]
  hot?: boolean
  new?: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface Circle {
  id: string
  name: string
  memberCount: number
  backgroundImage: string
  gradient: string
  description?: string
  isPaid?: boolean
  price?: number // 钻石价格
  isJoined?: boolean
}

export interface CircleRankingItem {
  id: string
  rank: number
  name: string
  description: string
  memberCount: number
  trend: 'up' | 'down' | 'stable'
  trendValue: number
}

export interface BannerItem {
  id: string
  type: 'ad' | 'product' | 'post'
  title: string
  subtitle?: string
  image: string
  gradient: string
  url?: string
  targetId?: string
}

export interface BroadcastMessage {
  id: string
  type: 'status' | 'promotion' | 'ad'
  title: string
  content: string
  url?: string
  priority: 'low' | 'medium' | 'high'
  startTime: Date
  endTime?: Date
  dismissible: boolean
}

export interface NavigationItem {
  id: string
  label: string
  icon: any
  color: string
  bgColor: string
  onClick?: () => void
}

export interface NearbyUser {
  id: string
  name: string
  avatar: string
  distance: string
  location: string
  verified: boolean
  followers: number
}

export interface UserProfile {
  id: string
  name: string
  avatar: string
  verified: boolean
  bio: string
  location: string
  joinDate: string
  followers: number
  following: number
  posts: number
  likes: number
  coverImage: string
  isFollowing: boolean
  badges: string[]
  level: number
  experience: number
  maxExperience: number
  honorBadges: string[]
  receivedGifts: any[]
  diamonds?: number // 钻石余额
}

export interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'system' | 'order' | 'gift' | 'achievement' | 'friend_request'
  title: string
  content: string
  timestamp: Date
  read: boolean
  avatar?: string
  actionUrl?: string
}

export interface Activity {
  id: string
  title: string
  description: string
  image?: string
  startTime: Date
  endTime: Date
  location?: string
  maxParticipants?: number
  currentParticipants: number
  organizer: User
  status: 'upcoming' | 'ongoing' | 'ended'
  tags: string[]
  requirements?: string[]
  rewards?: string[]
  isParticipating: boolean
  createdAt: Date
  circleId?: string
  circleName?: string
}

export interface PaymentMethod {
  id: string
  name: string
  icon: string
  type: 'wechat' | 'alipay' | 'card' | 'diamonds'
}

export interface PurchaseRecord {
  id: string
  circleId: string
  circleName: string
  amount: number
  paymentMethod: string
  timestamp: Date
  status: 'success' | 'pending' | 'failed'
}