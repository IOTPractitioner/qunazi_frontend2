import type { BroadcastMessage } from '../types'

export const mockBroadcastMessages: BroadcastMessage[] = [
  {
    id: 'broadcast-1',
    type: 'promotion',
    title: '🎉 双十一大促',
    content: '全场商品5折起，满299减50，满599减120，活动仅限3天！',
    url: '/promotion/double11',
    priority: 'high',
    startTime: new Date(Date.now() - 1000 * 60 * 60),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    dismissible: true
  },
  {
    id: 'broadcast-2',
    type: 'status',
    title: '📱 系统升级',
    content: '为了给您提供更好的服务体验，系统将于今晚23:00-01:00进行维护升级',
    priority: 'medium',
    startTime: new Date(Date.now() - 1000 * 60 * 30),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 12),
    dismissible: true
  }
]