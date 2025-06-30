import type { Activity, User } from '../types'

const mockUsers: User[] = [
  {
    id: '1',
    name: '小美',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    verified: true
  },
  {
    id: '2',
    name: '阿强',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    verified: false
  },
  {
    id: '3',
    name: '小雨',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    verified: true
  }
]

export const mockActivities: Activity[] = [
  {
    id: '1',
    title: '周末户外摄影活动',
    description: '一起去公园拍摄春天的美景，分享摄影技巧，记录美好时光。适合摄影爱好者和想要学习摄影的朋友们参加。',
    image: 'https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2天后
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 4), // 4小时活动
    location: '中山公园',
    maxParticipants: 20,
    currentParticipants: 12,
    organizer: mockUsers[0],
    status: 'upcoming',
    tags: ['摄影', '户外', '周末'],
    requirements: ['自备相机或手机', '穿着舒适的运动鞋'],
    rewards: ['优秀作品展示', '摄影技巧分享'],
    isParticipating: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    circleId: '1',
    circleName: '今天不想不开心'
  },
  {
    id: '2',
    title: '线上读书分享会',
    description: '本月我们一起阅读《活着》，分享读后感和人生感悟。通过文字的力量，传递正能量，让心灵得到滋养。',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1天后
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 + 1000 * 60 * 60 * 2), // 2小时活动
    location: '线上会议室',
    maxParticipants: 50,
    currentParticipants: 28,
    organizer: mockUsers[1],
    status: 'upcoming',
    tags: ['读书', '分享', '线上'],
    requirements: ['提前阅读指定书籍', '准备分享内容'],
    rewards: ['精美书签', '优秀分享者奖励'],
    isParticipating: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    circleId: '2',
    circleName: '学习可爱鬼'
  },
  {
    id: '3',
    title: '美食制作体验课',
    description: '学习制作经典川菜，从选材到烹饪，全程指导。让我们一起在厨房里创造美味，分享快乐时光。',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前开始
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 1), // 1小时后结束
    location: '美食工作室',
    maxParticipants: 15,
    currentParticipants: 15,
    organizer: mockUsers[2],
    status: 'ongoing',
    tags: ['美食', '烹饪', '体验'],
    requirements: ['自备围裙', '提前30分钟到场'],
    rewards: ['美食成品带回家', '烹饪技巧学习'],
    isParticipating: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    circleId: '1',
    circleName: '今天不想不开心'
  },
  {
    id: '4',
    title: '健身打卡挑战',
    description: '21天健身打卡挑战，每天完成指定运动任务，养成健康的生活习惯。一起变得更健康更美丽！',
    image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10天前开始
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 11), // 11天后结束
    maxParticipants: 100,
    currentParticipants: 67,
    organizer: mockUsers[0],
    status: 'ongoing',
    tags: ['健身', '打卡', '挑战'],
    requirements: ['每日打卡', '完成指定运动'],
    rewards: ['健身装备', '完成证书', '体重管理指导'],
    isParticipating: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    circleId: '4',
    circleName: '吃货来运动'
  },
  {
    id: '5',
    title: '音乐分享夜',
    description: '分享你喜欢的音乐，聊聊背后的故事。在音乐中找到共鸣，在分享中收获友谊。',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30天前
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 + 1000 * 60 * 60 * 3), // 3小时活动
    location: '咖啡厅包间',
    maxParticipants: 25,
    currentParticipants: 22,
    organizer: mockUsers[1],
    status: 'ended',
    tags: ['音乐', '分享', '社交'],
    requirements: ['准备1-2首喜欢的歌曲', '分享音乐故事'],
    rewards: ['音乐播放列表', '新朋友认识'],
    isParticipating: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35),
    circleId: '2',
    circleName: '学习可爱鬼'
  },
  {
    id: '6',
    title: '春季踏青摄影团',
    description: '春暖花开，一起去郊外踏青拍照，捕捉春天的美好瞬间。专业摄影师带队，教授拍摄技巧。',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5天后
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 60 * 6), // 6小时活动
    location: '香山公园',
    maxParticipants: 30,
    currentParticipants: 18,
    organizer: mockUsers[2],
    status: 'upcoming',
    tags: ['摄影', '踏青', '春季'],
    requirements: ['自备相机', '穿着舒适的鞋子', '自带午餐'],
    rewards: ['精美照片打印', '摄影技巧指导'],
    isParticipating: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    circleId: '1',
    circleName: '今天不想不开心'
  },
  {
    id: '7',
    title: '编程马拉松',
    description: '48小时编程挑战，团队协作开发创新项目。有经验丰富的导师指导，适合各个水平的开发者参与。',
    image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7天后
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9), // 2天活动
    location: '科技园创业中心',
    maxParticipants: 60,
    currentParticipants: 35,
    organizer: mockUsers[0],
    status: 'upcoming',
    tags: ['编程', '马拉松', '创新'],
    requirements: ['自备笔记本电脑', '基础编程知识'],
    rewards: ['奖金池10万元', '创业孵化机会', '技术认证'],
    isParticipating: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    circleId: '2',
    circleName: '学习可爱鬼'
  },
  {
    id: '8',
    title: '瑜伽冥想工作坊',
    description: '在宁静的环境中练习瑜伽和冥想，释放压力，找回内心的平静。适合初学者和有经验的练习者。',
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3天后
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 2), // 2小时活动
    location: '静心瑜伽馆',
    maxParticipants: 20,
    currentParticipants: 14,
    organizer: mockUsers[1],
    status: 'upcoming',
    tags: ['瑜伽', '冥想', '健康'],
    requirements: ['自备瑜伽垫', '穿着舒适的运动服'],
    rewards: ['瑜伽指导手册', '冥想音频'],
    isParticipating: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    circleId: '4',
    circleName: '吃货来运动'
  }
]