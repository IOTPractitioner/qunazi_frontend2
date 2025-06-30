import type { Post, Product, Category, User, BannerItem } from '../types'

export const mockUsers: User[] = [
  {
    id: '1',
    name: '小美',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    verified: true,
    diamonds: 1500
  },
  {
    id: '2',
    name: '阿强',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    verified: false,
    diamonds: 800
  },
  {
    id: '3',
    name: '小雨',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    verified: true,
    diamonds: 2300
  },
  {
    id: '4',
    name: '小明',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    verified: false,
    diamonds: 650
  },
  {
    id: '5',
    name: '小丽',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    verified: true,
    diamonds: 1200
  }
]

export const mockPosts: Post[] = [
  {
    id: '1',
    user: mockUsers[0],
    content: '今天的天气真不错，和朋友一起去逛街啦！🌞 发现了好多好看的衣服，心情超级好～',
    image: 'https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    likes: 156,
    comments: 23,
    shares: 8,
    timestamp: '2小时前',
    liked: false,
    circleId: '1'
  },
  {
    id: '2',
    user: mockUsers[1],
    content: '刚刚完成了一个新项目，累但是很有成就感！💪 分享给大家一些工作心得，希望对大家有帮助。坚持就是胜利！',
    likes: 89,
    comments: 12,
    shares: 5,
    timestamp: '4小时前',
    liked: true,
    circleId: '2'
  },
  {
    id: '3',
    user: mockUsers[2],
    content: '周末的早晨，一杯咖啡配上好书，这就是完美的开始 ☕️📚',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    likes: 234,
    comments: 45,
    shares: 12,
    timestamp: '6小时前',
    liked: false,
    circleId: '1'
  },
  {
    id: '4',
    user: mockUsers[3],
    content: '今天尝试了新的烘焙食谱，第一次做蛋糕居然成功了！🎂 味道还不错呢，下次再试试别的口味。',
    image: 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
    likes: 67,
    comments: 18,
    shares: 3,
    timestamp: '8小时前',
    liked: false,
    circleId: '1'
  },
  {
    id: '5',
    user: mockUsers[4],
    content: '健身第30天打卡！坚持真的很重要，现在感觉身体状态比以前好太多了。💪 给自己点个赞！',
    image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    likes: 198,
    comments: 34,
    shares: 15,
    timestamp: '10小时前',
    liked: true,
    circleId: '4'
  },
  // 添加付费帖子示例
  {
    id: '6',
    user: mockUsers[0],
    content: '独家分享：我的护肤秘籍和产品推荐清单！经过一年的试用和对比，终于整理出这份超详细的护肤指南。包含不同肌肤类型的产品推荐、使用顺序、注意事项等。相信对大家会很有帮助！✨',
    image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
    likes: 89,
    comments: 23,
    shares: 12,
    timestamp: '1天前',
    liked: false,
    isPaid: true,
    price: 50,
    isPurchased: false,
    circleId: '1' // 非付费圈子
  },
  {
    id: '7',
    user: mockUsers[2],
    content: '摄影技巧大公开！从构图到后期，手把手教你拍出朋友圈点赞最多的照片。包含20个实用技巧和案例分析，让你的摄影水平快速提升！📸',
    image: 'https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    likes: 156,
    comments: 45,
    shares: 28,
    timestamp: '2天前',
    liked: false,
    isPaid: true,
    price: 80,
    isPurchased: false,
    circleId: '3' // 非付费圈子
  }
]

export const mockCategories: Category[] = [
  { id: '1', name: '女装', icon: '👗', color: 'bg-pink-100 text-pink-600' },
  { id: '2', name: '男装', icon: '👔', color: 'bg-blue-100 text-blue-600' },
  { id: '3', name: '美妆', icon: '💄', color: 'bg-purple-100 text-purple-600' },
  { id: '4', name: '数码', icon: '📱', color: 'bg-green-100 text-green-600' },
  { id: '5', name: '家居', icon: '🏠', color: 'bg-yellow-100 text-yellow-600' },
  { id: '6', name: '食品', icon: '🍎', color: 'bg-red-100 text-red-600' },
  { id: '7', name: '运动', icon: '⚽', color: 'bg-indigo-100 text-indigo-600' },
  { id: '8', name: '更多', icon: '⋯', color: 'bg-gray-100 text-gray-600' }
]

export const mockProducts: Product[] = [
  {
    id: '1',
    name: '时尚连衣裙春夏新款',
    price: 299,
    originalPrice: 399,
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    rating: 4.8,
    reviews: 156,
    category: '女装',
    tags: ['新品', '热销'],
    hot: true,
    new: true
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    price: 8999,
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    rating: 4.9,
    reviews: 2341,
    category: '数码',
    tags: ['官方正品'],
    hot: true
  },
  {
    id: '3',
    name: '韩式护肤套装',
    price: 199,
    originalPrice: 299,
    image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    rating: 4.7,
    reviews: 89,
    category: '美妆',
    tags: ['限时特价'],
    new: true
  },
  {
    id: '4',
    name: '运动休闲鞋男款',
    price: 459,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    rating: 4.6,
    reviews: 234,
    category: '男装',
    tags: ['舒适透气']
  },
  {
    id: '5',
    name: '北欧风台灯',
    price: 159,
    originalPrice: 199,
    image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    rating: 4.5,
    reviews: 67,
    category: '家居',
    tags: ['设计感']
  },
  {
    id: '6',
    name: '有机坚果混合装',
    price: 89,
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    rating: 4.8,
    reviews: 145,
    category: '食品',
    tags: ['健康零食']
  }
]

export const mockBannerItems: BannerItem[] = [
  {
    id: 'banner-1',
    type: 'ad',
    title: '春季大促销',
    subtitle: '全场商品最高立减50%，限时优惠不容错过',
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    gradient: 'bg-gradient-to-r from-red-500 to-pink-500',
    url: '/promotion/spring-sale'
  },
  {
    id: 'banner-2',
    type: 'product',
    title: 'iPhone 15 Pro Max',
    subtitle: '全新发布，现货开售，支持分期付款',
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-600',
    targetId: '2'
  },
  {
    id: 'banner-3',
    type: 'post',
    title: '圈子热门话题',
    subtitle: '小美分享的街拍穿搭获得了1000+点赞',
    image: 'https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    gradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
    targetId: '1'
  }
]

export const generateMorePosts = (startId: number = 11): Post[] => {
  const additionalPosts: Post[] = []
  const contents = [
    '今天学会了一道新菜，味道还不错！下次可以做给朋友们尝尝。👨‍🍳',
    '刚看完一部很棒的电影，剧情很感人，推荐给大家！🎬',
    '周末去爬山了，虽然很累但是山顶的风景真的很美！🏔️',
    '最近在学习新的技能，虽然有点难但是很有趣。💻',
    '今天天气很好，和朋友一起去公园散步了。🌳',
    '分享一个好用的APP，大家可以试试看！📱',
    '今天心情特别好，想和大家分享这份快乐！😊',
    '刚完成了一个小目标，给自己鼓鼓掌！👏'
  ]

  const images = [
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
    'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
    'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=400&h=350&fit=crop'
  ]

  for (let i = 0; i < 8; i++) {
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)]
    const hasImage = Math.random() > 0.4
    const isPaid = Math.random() > 0.8 // 20% 概率为付费帖子
    
    additionalPosts.push({
      id: (startId + i).toString(),
      user,
      content: contents[Math.floor(Math.random() * contents.length)],
      image: hasImage ? images[Math.floor(Math.random() * images.length)] : undefined,
      likes: Math.floor(Math.random() * 300) + 10,
      comments: Math.floor(Math.random() * 50) + 1,
      shares: Math.floor(Math.random() * 20) + 1,
      timestamp: `${Math.floor(Math.random() * 24) + 1}小时前`,
      liked: Math.random() > 0.7,
      isPaid,
      price: isPaid ? Math.floor(Math.random() * 100) + 20 : undefined,
      isPurchased: false,
      circleId: ['1', '3', '5'][Math.floor(Math.random() * 3)] // 只在非付费圈子中
    })
  }

  return additionalPosts
}