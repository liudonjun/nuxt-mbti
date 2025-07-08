<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
    <div class="max-w-2xl mx-auto" ref="resultContainer">
      <div class="bg-white rounded-3xl shadow-xl overflow-hidden">
        <!-- 头部 -->
        <div class="bg-gradient-to-r from-purple-500 to-blue-500 p-8 text-white text-center">
          <h1 class="text-3xl font-bold mb-2">测试完成！</h1>
          <p class="text-purple-100">你的 MBTI 性格类型是</p>
          <div class="mt-6 mb-4">
            <div class="text-6xl font-bold tracking-wider">{{ personalityType }}</div>
            <div class="text-xl mt-2 text-purple-100">{{ typeInfo.name }}</div>
          </div>
        </div>

        <!-- 内容 -->
        <div class="p-8">
          <!-- 性格特征 -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">性格特征</h2>
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
              <p class="text-gray-700 leading-relaxed">{{ typeInfo.description }}</p>
            </div>
          </div>

          <!-- 维度分析 -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">维度分析</h2>
            <div class="space-y-6">
              <div v-for="(dimension, index) in typeInfo.dimensions" :key="dimension.name"
                class="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white font-bold text-sm"
                      :class="getDimensionColor(index)">
                      {{ dimension.name.charAt(0) }}
                    </div>
                    <span class="font-bold text-gray-800 text-lg">{{ dimension.name }}</span>
                  </div>
                  <span class="text-sm font-semibold px-3 py-1 rounded-full" :class="getDimensionBadgeColor(index)">
                    {{ dimension.type }}
                  </span>
                </div>

                <!-- 进度条 -->
                <div class="mb-3">
                  <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      :class="getDimensionProgressColor(index)"
                      :style="{ width: getDimensionProgress(dimension.type) + '%' }">
                      <!-- 光泽效果 -->
                      <div
                        class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse">
                      </div>
                    </div>
                  </div>
                  <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{{ getDimensionLeft(index) }}</span>
                    <span class="font-semibold">{{ getDimensionProgress(dimension.type) }}%</span>
                    <span>{{ getDimensionRight(index) }}</span>
                  </div>
                </div>

                <p class="text-gray-600 leading-relaxed">{{ dimension.description }}</p>
              </div>
            </div>
          </div>

          <!-- 职业建议 -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">适合的职业</h2>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="career in typeInfo.careers" :key="career" class="bg-orange-50 rounded-lg p-3 text-center">
                <span class="text-orange-800 font-medium">{{ career }}</span>
              </div>
            </div>
          </div>

          <!-- 底部按钮 -->
          <div class="flex flex-col space-y-4">
            <button @click="retakeTest"
              class="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              重新测试
            </button>

            <button @click="shareResult"
              class="w-full bg-gray-100 text-gray-700 font-semibold py-4 px-8 rounded-2xl hover:bg-gray-200 transition-all duration-200"
              :disabled="isGeneratingImage">
              {{ isGeneratingImage ? '生成图片中...' : '分享结果' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分享弹窗 -->
    <div v-if="showShareModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeShareModal">
      <div class="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-800">分享测试结果</h3>
            <button @click="closeShareModal" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- 预览图片 -->
          <div v-if="shareImage" class="mb-6">
            <div class="bg-gray-100 rounded-2xl p-4 max-h-96 overflow-auto">
              <img :src="shareImage" alt="测试结果" class="w-full rounded-lg shadow-md">
            </div>
          </div>

          <!-- 分享选项 -->
          <div class="space-y-3">
            <button @click="saveToAlbum"
              class="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-4 px-6 rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                </path>
              </svg>
              保存到相册
            </button>

            <button @click="shareToSocial"
              class="w-full bg-green-500 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-green-600 transition-all duration-200 flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z">
                </path>
              </svg>
              分享给朋友
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import html2canvas from 'html2canvas'

const route = useRoute()
const router = useRouter()
const resultContainer = ref(null)

const personalityType = ref(route.query.type || 'ENFP')
const showShareModal = ref(false)
const shareImage = ref(null)
const isGeneratingImage = ref(false)

const typeInfo = computed(() => {
  const types = {
    'ENFP': {
      name: '活动家',
      description: '热情洋溢、富有创造力的人，总是能够找到新的可能性。他们是天生的外交家，善于理解他人并激发他们的潜力。',
      dimensions: [
        { name: '外向性 (E)', type: '外向', description: '从与他人互动中获得能量，善于表达想法' },
        { name: '直觉 (N)', type: '直觉', description: '关注可能性和未来，善于看到事物的潜在联系' },
        { name: '情感 (F)', type: '情感', description: '重视人际关系和价值观，以情感为决策依据' },
        { name: '知觉 (P)', type: '知觉', description: '灵活适应，喜欢保持开放的选择' }
      ],
      careers: ['心理咨询师', '记者', '教师', '艺术家', '市场营销', '公关专员', '培训师', '创业者']
    },
    'INFP': {
      name: '调停者',
      description: '理想主义者，忠于自己的价值观和重要的人。他们希望外在的生活与内在的价值观相一致。',
      dimensions: [
        { name: '内向性 (I)', type: '内向', description: '从独处和内省中获得能量' },
        { name: '直觉 (N)', type: '直觉', description: '关注可能性和未来，善于看到事物的潜在联系' },
        { name: '情感 (F)', type: '情感', description: '重视人际关系和价值观，以情感为决策依据' },
        { name: '知觉 (P)', type: '知觉', description: '灵活适应，喜欢保持开放的选择' }
      ],
      careers: ['作家', '心理学家', '社会工作者', '音乐家', '设计师', '翻译', '研究员', '治疗师']
    },
    'ENFJ': {
      name: '主人公',
      description: '富有魅力的领导者，能够激励他人追求共同的目标。他们关心他人的成长和发展。',
      dimensions: [
        { name: '外向性 (E)', type: '外向', description: '从与他人互动中获得能量，善于表达想法' },
        { name: '直觉 (N)', type: '直觉', description: '关注可能性和未来，善于看到事物的潜在联系' },
        { name: '情感 (F)', type: '情感', description: '重视人际关系和价值观，以情感为决策依据' },
        { name: '判断 (J)', type: '判断', description: '喜欢有序的生活，倾向于做出明确的决定' }
      ],
      careers: ['教师', '人力资源', '心理咨询师', '社会工作者', '培训师', '牧师', '政治家', '外交官']
    },
    'INFJ': {
      name: '提倡者',
      description: '富有创造力和洞察力的理想主义者，能够用坚定的原则和正直的品格激励他人。',
      dimensions: [
        { name: '内向性 (I)', type: '内向', description: '从独处和内省中获得能量' },
        { name: '直觉 (N)', type: '直觉', description: '关注可能性和未来，善于看到事物的潜在联系' },
        { name: '情感 (F)', type: '情感', description: '重视人际关系和价值观，以情感为决策依据' },
        { name: '判断 (J)', type: '判断', description: '喜欢有序的生活，倾向于做出明确的决定' }
      ],
      careers: ['心理学家', '作家', '艺术家', '咨询师', '教师', '社会工作者', '研究员', '非营利组织工作者']
    },
    'ENTJ': {
      name: '指挥官',
      description: '大胆、富有想象力、意志强烈的领导者，总能找到或创造解决问题的方法。',
      dimensions: [
        { name: '外向性 (E)', type: '外向', description: '从与他人互动中获得能量，善于表达想法' },
        { name: '直觉 (N)', type: '直觉', description: '关注可能性和未来，善于看到事物的潜在联系' },
        { name: '思考 (T)', type: '思考', description: '基于逻辑和客观分析做决策' },
        { name: '判断 (J)', type: '判断', description: '喜欢有序的生活，倾向于做出明确的决定' }
      ],
      careers: ['CEO', '企业家', '管理顾问', '投资银行家', '律师', '政治家', '军官', '项目经理']
    },
    'INTJ': {
      name: '建筑师',
      description: '富有想象力和战略性的思想家，一切皆在计划之中。',
      dimensions: [
        { name: '内向性 (I)', type: '内向', description: '从独处和内省中获得能量' },
        { name: '直觉 (N)', type: '直觉', description: '关注可能性和未来，善于看到事物的潜在联系' },
        { name: '思考 (T)', type: '思考', description: '基于逻辑和客观分析做决策' },
        { name: '判断 (J)', type: '判断', description: '喜欢有序的生活，倾向于做出明确的决定' }
      ],
      careers: ['科学家', '工程师', '建筑师', '系统分析师', '研究员', '战略规划师', '投资分析师', '学者']
    },
    'ENTP': {
      name: '辩论家',
      description: '聪明好奇的思想家，不会拒绝智力上的挑战。',
      dimensions: [
        { name: '外向性 (E)', type: '外向', description: '从与他人互动中获得能量，善于表达想法' },
        { name: '直觉 (N)', type: '直觉', description: '关注可能性和未来，善于看到事物的潜在联系' },
        { name: '思考 (T)', type: '思考', description: '基于逻辑和客观分析做决策' },
        { name: '知觉 (P)', type: '知觉', description: '灵活适应，喜欢保持开放的选择' }
      ],
      careers: ['创业者', '发明家', '记者', '律师', '心理学家', '营销专家', '顾问', '演讲家']
    },
    'INTP': {
      name: '逻辑学家',
      description: '具有创新精神的发明家，对知识有着止不住的渴望。',
      dimensions: [
        { name: '内向性 (I)', type: '内向', description: '从独处和内省中获得能量' },
        { name: '直觉 (N)', type: '直觉', description: '关注可能性和未来，善于看到事物的潜在联系' },
        { name: '思考 (T)', type: '思考', description: '基于逻辑和客观分析做决策' },
        { name: '知觉 (P)', type: '知觉', description: '灵活适应，喜欢保持开放的选择' }
      ],
      careers: ['研究员', '哲学家', '数学家', '程序员', '理论物理学家', '经济学家', '学者', '分析师']
    },
    'ESFJ': {
      name: '执政官',
      description: '极有同情心、受欢迎、总是热心帮助他人的人。',
      dimensions: [
        { name: '外向性 (E)', type: '外向', description: '从与他人互动中获得能量，善于表达想法' },
        { name: '感觉 (S)', type: '感觉', description: '关注具体事实和细节，重视实际经验' },
        { name: '情感 (F)', type: '情感', description: '重视人际关系和价值观，以情感为决策依据' },
        { name: '判断 (J)', type: '判断', description: '喜欢有序的生活，倾向于做出明确的决定' }
      ],
      careers: ['护士', '教师', '社会工作者', '人力资源', '销售代表', '活动策划', '客服经理', '行政助理']
    },
    'ISFJ': {
      name: '守护者',
      description: '非常专注、温暖的守护者，时刻准备保护爱着的人们。',
      dimensions: [
        { name: '内向性 (I)', type: '内向', description: '从独处和内省中获得能量' },
        { name: '感觉 (S)', type: '感觉', description: '关注具体事实和细节，重视实际经验' },
        { name: '情感 (F)', type: '情感', description: '重视人际关系和价值观，以情感为决策依据' },
        { name: '判断 (J)', type: '判断', description: '喜欢有序的生活，倾向于做出明确的决定' }
      ],
      careers: ['医生', '护士', '教师', '图书管理员', '会计', '行政人员', '社会工作者', '心理咨询师']
    },
    'ESFP': {
      name: '娱乐家',
      description: '自发的、精力充沛和热情的人 — 生活在他们周围绝不会无聊。',
      dimensions: [
        { name: '外向性 (E)', type: '外向', description: '从与他人互动中获得能量，善于表达想法' },
        { name: '感觉 (S)', type: '感觉', description: '关注具体事实和细节，重视实际经验' },
        { name: '情感 (F)', type: '情感', description: '重视人际关系和价值观，以情感为决策依据' },
        { name: '知觉 (P)', type: '知觉', description: '灵活适应，喜欢保持开放的选择' }
      ],
      careers: ['演员', '音乐家', '导游', '销售代表', '活动策划', '儿童教师', '社交媒体专员', '治疗师']
    },
    'ISFP': {
      name: '探险家',
      description: '灵活、迷人的艺术家，时刻准备探索新的可能性。',
      dimensions: [
        { name: '内向性 (I)', type: '内向', description: '从独处和内省中获得能量' },
        { name: '感觉 (S)', type: '感觉', description: '关注具体事实和细节，重视实际经验' },
        { name: '情感 (F)', type: '情感', description: '重视人际关系和价值观，以情感为决策依据' },
        { name: '知觉 (P)', type: '知觉', description: '灵活适应，喜欢保持开放的选择' }
      ],
      careers: ['艺术家', '设计师', '摄影师', '音乐家', '治疗师', '兽医', '厨师', '时装设计师']
    },
    'ESTJ': {
      name: '总经理',
      description: '出色的管理者，在管理事情或人的时候无与伦比。',
      dimensions: [
        { name: '外向性 (E)', type: '外向', description: '从与他人互动中获得能量，善于表达想法' },
        { name: '感觉 (S)', type: '感觉', description: '关注具体事实和细节，重视实际经验' },
        { name: '思考 (T)', type: '思考', description: '基于逻辑和客观分析做决策' },
        { name: '判断 (J)', type: '判断', description: '喜欢有序的生活，倾向于做出明确的决定' }
      ],
      careers: ['管理者', '银行家', '法官', '军官', '项目经理', '销售经理', '政府官员', '企业高管']
    },
    'ISTJ': {
      name: '物流师',
      description: '实用主义的逻辑型人，可靠性无人能及。',
      dimensions: [
        { name: '内向性 (I)', type: '内向', description: '从独处和内省中获得能量' },
        { name: '感觉 (S)', type: '感觉', description: '关注具体事实和细节，重视实际经验' },
        { name: '思考 (T)', type: '思考', description: '基于逻辑和客观分析做决策' },
        { name: '判断 (J)', type: '判断', description: '喜欢有序的生活，倾向于做出明确的决定' }
      ],
      careers: ['会计师', '审计师', '工程师', '医生', '律师', '银行家', '管理员', '质量控制专员']
    },
    'ESTP': {
      name: '企业家',
      description: '聪明、精力充沛、善于感知的人，真心享受生活在边缘的感觉。',
      dimensions: [
        { name: '外向性 (E)', type: '外向', description: '从与他人互动中获得能量，善于表达想法' },
        { name: '感觉 (S)', type: '感觉', description: '关注具体事实和细节，重视实际经验' },
        { name: '思考 (T)', type: '思考', description: '基于逻辑和客观分析做决策' },
        { name: '知觉 (P)', type: '知觉', description: '灵活适应，喜欢保持开放的选择' }
      ],
      careers: ['销售员', '企业家', '警察', '消防员', '运动员', '股票经纪人', '急救医生', '飞行员']
    },
    'ISTP': {
      name: '鉴赏家',
      description: '大胆而实际的实验家，擅长使用各种工具。',
      dimensions: [
        { name: '内向性 (I)', type: '内向', description: '从独处和内省中获得能量' },
        { name: '感觉 (S)', type: '感觉', description: '关注具体事实和细节，重视实际经验' },
        { name: '思考 (T)', type: '思考', description: '基于逻辑和客观分析做决策' },
        { name: '知觉 (P)', type: '知觉', description: '灵活适应，喜欢保持开放的选择' }
      ],
      careers: ['机械师', '工程师', '程序员', '飞行员', '外科医生', '侦探', '运动员', '技术专家']
    }
  }

  return types[personalityType.value] || types['ENFP']
})

const retakeTest = () => {
  router.push('/test')
}

// 维度相关的样式和数据方法
const getDimensionColor = (index) => {
  const colors = [
    'bg-gradient-to-r from-purple-500 to-purple-600',
    'bg-gradient-to-r from-blue-500 to-blue-600',
    'bg-gradient-to-r from-green-500 to-green-600',
    'bg-gradient-to-r from-orange-500 to-orange-600'
  ]
  return colors[index % colors.length]
}

const getDimensionBadgeColor = (index) => {
  const colors = [
    'bg-purple-100 text-purple-800',
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-orange-100 text-orange-800'
  ]
  return colors[index % colors.length]
}

const getDimensionProgressColor = (index) => {
  const colors = [
    'bg-gradient-to-r from-purple-400 to-purple-600',
    'bg-gradient-to-r from-blue-400 to-blue-600',
    'bg-gradient-to-r from-green-400 to-green-600',
    'bg-gradient-to-r from-orange-400 to-orange-600'
  ]
  return colors[index % colors.length]
}

const getDimensionLeft = (index) => {
  const pairs = ['内向', '感觉', '思考', '判断']
  return pairs[index % pairs.length]
}

const getDimensionRight = (index) => {
  const pairs = ['外向', '直觉', '情感', '知觉']
  return pairs[index % pairs.length]
}

const getDimensionProgress = (type) => {
   // 根据实际测试结果计算维度倾向百分比
   const typeStr = personalityType.value
   const route = useRoute()
   
   // 从路由参数获取各维度得分
   const scores = {
     '外向': route.query.E || 0,
     '内向': route.query.I || 0,
     '直觉': route.query.N || 0,
     '感觉': route.query.S || 0,
     '情感': route.query.F || 0,
     '思考': route.query.T || 0,
     '知觉': route.query.P || 0,
     '判断': route.query.J || 0
   }
   
   // 计算百分比 (50%基础值 + 实际得分影响)
   const baseValue = 50
   const scoreImpact = (scores[type] || 0) * 0.5 // 调整系数使结果更合理
   return Math.min(100, Math.max(0, baseValue + scoreImpact))
}
const shareResult = async () => {
  try {
    isGeneratingImage.value = true

    // 生成截图
    const canvas = await html2canvas(resultContainer.value, {
      backgroundColor: '#f8fafc',
      scale: 2, // 提高清晰度
      useCORS: true,
      allowTaint: true,
      height: resultContainer.value.scrollHeight,
      width: resultContainer.value.scrollWidth
    })

    // 转换为图片
    shareImage.value = canvas.toDataURL('image/png', 0.9)
    showShareModal.value = true

  } catch (error) {
    console.error('生成截图失败:', error)
    // 降级到文本分享
    if (navigator.share) {
      navigator.share({
        title: 'MBTI 测试结果',
        text: `我的 MBTI 性格类型是 ${personalityType.value} - ${typeInfo.value.name}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(`我的 MBTI 性格类型是 ${personalityType.value} - ${typeInfo.value.name}`)
        .then(() => {
          alert('结果已复制到剪贴板！')
        })
    }
  } finally {
    isGeneratingImage.value = false
  }
}

const closeShareModal = () => {
  showShareModal.value = false
  shareImage.value = null
}

const saveToAlbum = () => {
  if (shareImage.value) {
    // 创建下载链接
    const link = document.createElement('a')
    link.download = `MBTI测试结果-${personalityType.value}-${typeInfo.value.name}.png`
    link.href = shareImage.value
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 显示成功提示
    showToast('图片已保存到下载文件夹')
  }
}

const shareToSocial = async () => {
  if (shareImage.value) {
    try {
      // 将base64转换为blob
      const response = await fetch(shareImage.value)
      const blob = await response.blob()
      const file = new File([blob], `MBTI测试结果-${personalityType.value}.png`, { type: 'image/png' })

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'MBTI 测试结果',
          text: `我的 MBTI 性格类型是 ${personalityType.value} - ${typeInfo.value.name}`,
          files: [file]
        })
      } else {
        // 降级到文本分享
        if (navigator.share) {
          await navigator.share({
            title: 'MBTI 测试结果',
            text: `我的 MBTI 性格类型是 ${personalityType.value} - ${typeInfo.value.name}`,
            url: window.location.href
          })
        } else {
          showToast('请手动保存图片后分享')
        }
      }
    } catch (error) {
      console.error('分享失败:', error)
      showToast('分享失败，请尝试保存图片后手动分享')
    }
  }
}

const copyImageToClipboard = async () => {
  if (shareImage.value) {
    try {
      // 将base64转换为blob
      const response = await fetch(shareImage.value)
      const blob = await response.blob()

      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ])
        showToast('图片已复制到剪贴板')
      } else {
        showToast('浏览器不支持图片复制，请手动保存')
      }
    } catch (error) {
      console.error('复制失败:', error)
      showToast('复制失败，请尝试保存图片')
    }
  }
}

const showToast = (message) => {
  // 简单的toast提示
  const toast = document.createElement('div')
  toast.textContent = message
  toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg z-50 transition-all duration-300'
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.opacity = '0'
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 2000)
}
</script>