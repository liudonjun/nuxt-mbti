<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
    <div class="max-w-2xl mx-auto">
      <!-- 头部进度条 -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <button 
            @click="goBack"
            class="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            返回
          </button>
          
          <div class="text-sm text-gray-600">
            {{ currentIndex + 1 }} / {{ questions.length }}
          </div>
        </div>
        
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
      
      <!-- 题目卡片 -->
      <div class="bg-white rounded-3xl shadow-xl p-8 mb-6">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">
            {{ currentQuestion.text }}
          </h2>
          <div class="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 inline-block">
            {{ getDimensionName(currentQuestion.dimension) }}
          </div>
        </div>
        
        <div class="space-y-3">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="selectOption(option)"
            :class="[
              'w-full p-5 text-left rounded-xl border-2 transition-all duration-300 relative overflow-hidden',
              selectedOption && selectedOption.text === option.text
                ? 'border-purple-500 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-900 shadow-lg transform scale-105'
                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50 hover:shadow-md'
            ]"
          >
            <!-- 选中状态的背景光效 -->
            <div v-if="selectedOption && selectedOption.text === option.text" 
                 class="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 animate-pulse">
            </div>
            
            <div class="flex items-center">
              <div class="w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center relative z-10 transition-all duration-300"
                   :class="selectedOption && selectedOption.text === option.text 
                     ? 'border-purple-500 bg-purple-500 shadow-lg' 
                     : 'border-gray-300 hover:border-purple-400'"
              >
                <div v-if="selectedOption && selectedOption.text === option.text" 
                     class="w-3 h-3 bg-white rounded-full animate-pulse">
                </div>
                <!-- 选中时的外圈动画 -->
                <div v-if="selectedOption && selectedOption.text === option.text"
                     class="absolute -inset-1 border-2 border-purple-300 rounded-full animate-ping opacity-75">
                </div>
              </div>
              <span class="text-lg font-medium relative z-10 transition-all duration-300"
                    :class="selectedOption && selectedOption.text === option.text ? 'text-purple-900' : 'text-gray-700'">
                {{ option.text }}
              </span>
              
              <!-- 选中状态的勾选图标 -->
              <div v-if="selectedOption && selectedOption.text === option.text" 
                   class="ml-auto relative z-10">
                <svg class="w-6 h-6 text-purple-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      <!-- 导航按钮 -->
      <div class="flex justify-between space-x-4">
        <button
          @click="previousQuestion"
          :disabled="currentIndex === 0"
          :class="[
            'flex-1 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200',
            currentIndex === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          上一题
        </button>
        
        <button
          @click="nextQuestion"
          :disabled="!selectedOption || !selectedOption.text"
          :class="[
            'flex-1 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200',
            !selectedOption || !selectedOption.text
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg transform hover:scale-105'
          ]"
        >
          {{ currentIndex === questions.length - 1 ? '查看结果' : '下一题' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const { $questionsData } = useNuxtApp()

// 数据
const questions = $questionsData
const currentIndex = ref(0)
const selectedOption = ref(null)
const answers = ref([])

// 计算属性
const currentQuestion = computed(() => questions[currentIndex.value])
const progress = computed(() => ((currentIndex.value + 1) / questions.length) * 100)

// 方法
const goBack = () => {
  router.push('/')
}

const getDimensionName = (dimension) => {
  const names = {
    'E-I': '外向性 vs 内向性',
    'S-N': '感觉 vs 直觉',
    'T-F': '思考 vs 情感',
    'J-P': '判断 vs 知觉'
  }
  return names[dimension] || dimension
}

const selectOption = (option) => {
  selectedOption.value = option
  console.log('Selected option:', option) // 调试用
}

const nextQuestion = () => {
  if (!selectedOption.value || !selectedOption.value.text) return
  
  // 保存答案
  answers.value[currentIndex.value] = selectedOption.value
  
  if (currentIndex.value === questions.length - 1) {
    // 最后一题，计算结果
    const result = calculateResult()
    router.push({
      name: 'result',
      query: { type: result }
    })
  } else {
    // 下一题
    currentIndex.value++
    selectedOption.value = answers.value[currentIndex.value] || null
  }
}

const previousQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedOption.value = answers.value[currentIndex.value] || null
  }
}

const calculateResult = () => {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
  
  answers.value.forEach(answer => {
    if (answer && answer.score) {
      Object.entries(answer.score).forEach(([key, value]) => {
        scores[key] += value
      })
    }
  })
  
  const result = [
    scores.E >= scores.I ? 'E' : 'I',
    scores.S >= scores.N ? 'S' : 'N',
    scores.T >= scores.F ? 'T' : 'F',
    scores.J >= scores.P ? 'J' : 'P'
  ].join('')
  
  return result
}

// 初始化
onMounted(() => {
  if (currentIndex.value < answers.value.length) {
    selectedOption.value = answers.value[currentIndex.value] || null
  }
})
</script>