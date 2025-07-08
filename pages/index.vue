<template>
  <div class="min-h-screen flex flex-col justify-center items-center p-4">
    <div class="max-w-md w-full text-center">
      <div class="bg-white rounded-3xl shadow-xl p-8 mb-8">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">MBTI 性格测试</h1>
          <p class="text-gray-600 text-lg">探索你的内在世界</p>
        </div>
        
        <div class="mb-8">
          <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-gray-600 leading-relaxed">
            通过 93 道精心设计的问题，深入了解你的性格类型。
            <br>
            本测试基于荣格心理类型学理论，帮助你更好地认识自己。
          </p>
        </div>
        
        <div class="space-y-4">
          <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
            <div class="flex items-center justify-between text-sm text-gray-600">
              <span>测试时长</span>
              <span class="font-semibold">约 15-20 分钟</span>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
            <div class="flex items-center justify-between text-sm text-gray-600">
              <span>题目数量</span>
              <span class="font-semibold">93 道</span>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        @click="startTest"
        class="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
      >
        开始测试
      </button>
      
      <p class="text-sm text-gray-500 mt-4">
        测试结果仅供参考，请结合实际情况理性看待
      </p>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()

const startTest = () => {
  router.push('/test')
}
</script>