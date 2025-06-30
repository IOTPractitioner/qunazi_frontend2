<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-40">
      <div class="flex items-center justify-between">
        <button 
          @click="$router.back()"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ArrowLeft :size="20" class="text-gray-600" />
        </button>
        
        <h1 class="text-lg font-bold text-gray-900">充值钻石</h1>
        
        <button 
          @click="showRechargeHistory = true"
          class="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
        >
          记录
        </button>
      </div>
    </div>

    <!-- Current Balance -->
    <div class="bg-gradient-to-r from-yellow-400 to-orange-500 mx-4 mt-4 rounded-2xl p-6 text-white">
      <div class="text-center">
        <div class="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
          <Gem :size="32" class="text-white" />
        </div>
        <h2 class="text-2xl font-bold mb-1">当前余额</h2>
        <div class="flex items-center justify-center space-x-2">
          <span class="text-4xl font-bold">{{ userStore.user?.diamonds || 0 }}</span>
          <span class="text-xl">💎</span>
        </div>
        <p class="text-yellow-100 text-sm mt-2">钻石可用于购买付费圈子和特殊功能</p>
      </div>
    </div>

    <!-- Recharge Packages -->
    <div class="p-4">
      <h3 class="text-lg font-bold text-gray-900 mb-4">充值套餐</h3>
      
      <div class="grid grid-cols-2 gap-3 mb-6">
        <button
          v-for="pkg in rechargePackages"
          :key="pkg.id"
          @click="selectPackage(pkg)"
          :class="[
            'relative p-4 rounded-2xl border-2 transition-all duration-200',
            selectedPackage?.id === pkg.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          ]"
        >
          <!-- Popular Badge -->
          <div v-if="pkg.popular" class="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <span class="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              热门
            </span>
          </div>
          
          <!-- Bonus Badge -->
          <div v-if="pkg.bonus > 0" class="absolute -top-2 -right-2">
            <div class="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              +{{ pkg.bonus }}
            </div>
          </div>

          <div class="text-center">
            <div class="flex items-center justify-center space-x-1 mb-2">
              <Gem :size="20" :class="pkg.popular ? 'text-yellow-500' : 'text-gray-500'" />
              <span class="text-2xl font-bold text-gray-900">{{ pkg.diamonds }}</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">钻石</p>
            <div class="flex items-center justify-center space-x-1">
              <span class="text-lg font-bold text-blue-600">¥{{ pkg.price }}</span>
            </div>
            <p v-if="pkg.bonus > 0" class="text-xs text-green-600 mt-1">
              赠送{{ pkg.bonus }}钻石
            </p>
          </div>

          <!-- Selected Indicator -->
          <div 
            v-if="selectedPackage?.id === pkg.id"
            class="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
          >
            <Check :size="12" class="text-white" />
          </div>
        </button>
      </div>

      <!-- Custom Amount -->
      <div class="bg-white rounded-2xl p-4 mb-6 border border-gray-200">
        <h4 class="font-semibold text-gray-900 mb-3">自定义金额</h4>
        <div class="flex items-center space-x-3">
          <div class="flex-1 relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
            <input
              v-model.number="customAmount"
              type="number"
              min="1"
              max="9999"
              placeholder="输入金额"
              class="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              @input="handleCustomAmount"
            />
          </div>
          <div class="text-center">
            <div class="flex items-center space-x-1">
              <Gem :size="16" class="text-yellow-500" />
              <span class="font-bold text-gray-900">{{ customDiamonds }}</span>
            </div>
            <p class="text-xs text-gray-500">钻石</p>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">1元 = 10钻石</p>
      </div>

      <!-- Payment Methods -->
      <div class="bg-white rounded-2xl p-4 mb-6 border border-gray-200">
        <h4 class="font-semibold text-gray-900 mb-3">支付方式</h4>
        <div class="space-y-3">
          <button
            v-for="method in paymentMethods"
            :key="method.id"
            @click="selectedPaymentMethod = method"
            :class="[
              'flex items-center justify-between w-full p-3 rounded-xl border-2 transition-all duration-200',
              selectedPaymentMethod?.id === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center space-x-3">
              <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', method.bgColor]">
                <span class="text-lg">{{ method.icon }}</span>
              </div>
              <span class="font-medium text-gray-900">{{ method.name }}</span>
            </div>
            <div 
              v-if="selectedPaymentMethod?.id === method.id"
              class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <Check :size="12" class="text-white" />
            </div>
          </button>
        </div>
      </div>

      <!-- Recharge Button -->
      <button
        @click="handleRecharge"
        :disabled="!canRecharge"
        :class="[
          'w-full py-4 rounded-xl font-bold text-lg transition-all duration-200',
          canRecharge
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
      >
        {{ getRechargeButtonText() }}
      </button>

      <!-- Terms -->
      <div class="mt-4 text-center">
        <p class="text-xs text-gray-500 leading-relaxed">
          充值即表示同意
          <button class="text-blue-600 hover:text-blue-700">《充值协议》</button>
          和
          <button class="text-blue-600 hover:text-blue-700">《用户协议》</button>
        </p>
      </div>
    </div>

    <!-- Recharge History Modal -->
    <div v-if="showRechargeHistory" class="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div class="bg-white rounded-t-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 class="text-lg font-bold text-gray-900">充值记录</h3>
          <button 
            @click="showRechargeHistory = false"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X :size="20" class="text-gray-600" />
          </button>
        </div>
        
        <div class="p-4 overflow-y-auto max-h-96">
          <div v-if="rechargeHistory.length === 0" class="text-center py-8">
            <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <CreditCard :size="24" class="text-gray-400" />
            </div>
            <p class="text-gray-500">暂无充值记录</p>
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="record in rechargeHistory"
              :key="record.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Gem :size="16" class="text-green-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">+{{ record.diamonds }} 钻石</p>
                  <p class="text-sm text-gray-500">{{ formatDate(record.timestamp) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-gray-900">¥{{ record.amount }}</p>
                <p :class="[
                  'text-xs',
                  record.status === 'success' ? 'text-green-600' : 
                  record.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                ]">
                  {{ getStatusText(record.status) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Check :size="24" class="text-white" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">充值成功！</h3>
          <p class="text-gray-600 mb-4">
            成功充值 {{ lastRechargeAmount }} 钻石
          </p>
          <div class="bg-yellow-50 rounded-xl p-3 mb-6">
            <div class="flex items-center justify-center space-x-2">
              <Gem :size="20" class="text-yellow-500" />
              <span class="text-lg font-bold text-gray-900">{{ userStore.user?.diamonds || 0 }}</span>
              <span class="text-gray-600">钻石</span>
            </div>
            <p class="text-sm text-gray-500 mt-1">当前余额</p>
          </div>
          <button
            @click="showSuccessModal = false"
            class="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            继续使用
          </button>
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
  Gem, 
  Check, 
  X, 
  CreditCard 
} from 'lucide-vue-next'
import { useUserStore } from '../stores/userStore'

interface RechargePackage {
  id: string
  diamonds: number
  price: number
  bonus: number
  popular?: boolean
}

interface PaymentMethod {
  id: string
  name: string
  icon: string
  bgColor: string
  type: 'wechat' | 'alipay' | 'card'
}

interface RechargeRecord {
  id: string
  diamonds: number
  amount: number
  paymentMethod: string
  timestamp: Date
  status: 'success' | 'pending' | 'failed'
}

const router = useRouter()
const userStore = useUserStore()

const selectedPackage = ref<RechargePackage | null>(null)
const selectedPaymentMethod = ref<PaymentMethod | null>(null)
const customAmount = ref<number | null>(null)
const showRechargeHistory = ref(false)
const showSuccessModal = ref(false)
const lastRechargeAmount = ref(0)

const rechargePackages: RechargePackage[] = [
  { id: '1', diamonds: 100, price: 10, bonus: 0 },
  { id: '2', diamonds: 300, price: 30, bonus: 20, popular: true },
  { id: '3', diamonds: 500, price: 50, bonus: 50 },
  { id: '4', diamonds: 1000, price: 100, bonus: 150 },
  { id: '5', diamonds: 2000, price: 200, bonus: 400 },
  { id: '6', diamonds: 5000, price: 500, bonus: 1200 }
]

const paymentMethods: PaymentMethod[] = [
  { id: 'wechat', name: '微信支付', icon: '💚', bgColor: 'bg-green-100', type: 'wechat' },
  { id: 'alipay', name: '支付宝', icon: '💙', bgColor: 'bg-blue-100', type: 'alipay' },
  { id: 'card', name: '银行卡', icon: '💳', bgColor: 'bg-gray-100', type: 'card' }
]

const rechargeHistory = ref<RechargeRecord[]>([
  {
    id: '1',
    diamonds: 300,
    amount: 30,
    paymentMethod: '微信支付',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    status: 'success'
  },
  {
    id: '2',
    diamonds: 100,
    amount: 10,
    paymentMethod: '支付宝',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    status: 'success'
  }
])

const customDiamonds = computed(() => {
  return customAmount.value ? customAmount.value * 10 : 0
})

const canRecharge = computed(() => {
  const hasAmount = selectedPackage.value || (customAmount.value && customAmount.value > 0)
  const hasPaymentMethod = selectedPaymentMethod.value
  return hasAmount && hasPaymentMethod
})

const selectPackage = (pkg: RechargePackage) => {
  selectedPackage.value = pkg
  customAmount.value = null
}

const handleCustomAmount = () => {
  if (customAmount.value && customAmount.value > 0) {
    selectedPackage.value = null
  }
}

const getRechargeButtonText = (): string => {
  if (!selectedPaymentMethod.value) return '请选择支付方式'
  
  const amount = selectedPackage.value?.price || customAmount.value || 0
  if (amount <= 0) return '请选择充值金额'
  
  return `支付 ¥${amount}`
}

const handleRecharge = async () => {
  if (!canRecharge.value) return

  try {
    // 模拟支付过程
    const amount = selectedPackage.value?.price || customAmount.value || 0
    const diamonds = selectedPackage.value 
      ? selectedPackage.value.diamonds + selectedPackage.value.bonus
      : customDiamonds.value

    // 模拟支付延迟
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 添加钻石到用户账户
    userStore.addDiamonds(diamonds)
    
    // 添加充值记录
    const record: RechargeRecord = {
      id: Date.now().toString(),
      diamonds,
      amount,
      paymentMethod: selectedPaymentMethod.value?.name || '',
      timestamp: new Date(),
      status: 'success'
    }
    rechargeHistory.value.unshift(record)

    // 显示成功提示
    lastRechargeAmount.value = diamonds
    showSuccessModal.value = true

    // 重置选择
    selectedPackage.value = null
    selectedPaymentMethod.value = null
    customAmount.value = null

    console.log('Recharge successful:', { amount, diamonds })
  } catch (error) {
    console.error('Recharge failed:', error)
    alert('充值失败，请重试')
  }
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'success': return '成功'
    case 'pending': return '处理中'
    case 'failed': return '失败'
    default: return '未知'
  }
}
</script>