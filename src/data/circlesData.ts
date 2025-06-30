import type { Circle, CircleRankingItem } from '../types'

export const mockCircles: Circle[] = [
  {
    id: '1',
    name: '今天不想不开心',
    memberCount: 15600,
    backgroundImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    gradient: 'bg-gradient-to-br from-orange-400/60 to-yellow-500/60',
    description: '分享快乐时光',
    isPaid: false,
    isJoined: false
  },
  {
    id: '2',
    name: '学习可爱鬼',
    memberCount: 23400,
    backgroundImage: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    gradient: 'bg-gradient-to-br from-pink-400/60 to-rose-500/60',
    description: '一起学习进步',
    isPaid: true,
    price: 99,
    isJoined: false
  },
  {
    id: '3',
    name: '下雨了',
    memberCount: 8900,
    backgroundImage: 'https://images.pexels.com/photos/1463917/pexels-photo-1463917.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    gradient: 'bg-gradient-to-br from-blue-400/60 to-purple-500/60',
    description: '雨天心情分享',
    isPaid: false,
    isJoined: true
  },
  {
    id: '4',
    name: '吃货来运动',
    memberCount: 31200,
    backgroundImage: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    gradient: 'bg-gradient-to-br from-purple-400/60 to-indigo-500/60',
    description: '健康生活方式',
    isPaid: true,
    price: 199,
    isJoined: false
  },
  {
    id: '5',
    name: '注汪汪',
    memberCount: 19800,
    backgroundImage: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    gradient: 'bg-gradient-to-br from-red-400/60 to-pink-500/60',
    description: '萌宠分享社区',
    isPaid: false,
    isJoined: false
  },
  {
    id: '6',
    name: '古天乐',
    memberCount: 45600,
    backgroundImage: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    gradient: 'bg-gradient-to-br from-blue-400/60 to-cyan-500/60',
    description: '明星粉丝圈',
    isPaid: true,
    price: 299,
    isJoined: false
  }
]

export const mockCircleRanking: CircleRankingItem[] = [
  {
    id: 'rank-1',
    rank: 1,
    name: '自然风光',
    description: '生物摄影',
    memberCount: 4902,
    trend: 'up',
    trendValue: 156
  },
  {
    id: 'rank-2',
    rank: 2,
    name: '乡土文艺',
    description: '保持民族主义玩家聚集地',
    memberCount: 3809,
    trend: 'up',
    trendValue: 89
  },
  {
    id: 'rank-3',
    rank: 3,
    name: '蛇来运转',
    description: '付费阅读',
    memberCount: 3607,
    trend: 'up',
    trendValue: 67
  },
  {
    id: 'rank-4',
    rank: 4,
    name: '绘画',
    description: '原创画家聚集地',
    memberCount: 3598,
    trend: 'up',
    trendValue: 45
  },
  {
    id: 'rank-5',
    rank: 5,
    name: '美食探索',
    description: '发现身边的美味',
    memberCount: 3421,
    trend: 'down',
    trendValue: 23
  },
  {
    id: 'rank-6',
    rank: 6,
    name: '健身达人',
    description: '一起变得更强',
    memberCount: 3298,
    trend: 'up',
    trendValue: 78
  },
  {
    id: 'rank-7',
    rank: 7,
    name: '旅行日记',
    description: '记录美好旅程',
    memberCount: 3156,
    trend: 'stable',
    trendValue: 12
  },
  {
    id: 'rank-8',
    rank: 8,
    name: '音乐分享',
    description: '好音乐一起听',
    memberCount: 2987,
    trend: 'up',
    trendValue: 34
  },
  {
    id: 'rank-9',
    rank: 9,
    name: '读书笔记',
    description: '分享阅读心得',
    memberCount: 2834,
    trend: 'down',
    trendValue: 15
  },
  {
    id: 'rank-10',
    rank: 10,
    name: '科技前沿',
    description: '探讨最新科技',
    memberCount: 2756,
    trend: 'up',
    trendValue: 56
  }
]