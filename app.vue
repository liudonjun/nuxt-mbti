<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
    <NuxtPage />
  </div>
</template>

<script setup>

useHead({
  script: [
    {
      src: 'https://sdk.51.la/js-sdk-pro.min.js?id=3MjsjvQSXHmaybu7&ck=3MjsjvQSXHmaybu7',
      id: 'LA_COLLECT'
    }
  ]
})

</script>
<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>