<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { onMounted, computed } from 'vue'
import { useOptionStore } from './stores'

const optionStore = useOptionStore()
const dark = () => {
  if (optionStore.themeSwitch) {
    document.documentElement.classList.add('dark')
  }
}

const locale = computed(() => {
  return optionStore.languageSwitch ? en : zhCn
})

onMounted(() => {
  dark()
})
// import zhCn from 'element-plus/lib/locale/lang/zh-cn'
// 如果使用 lib目录下的话vite会报 No known conditions for "./lib/locale/lang/zh-cn" ...
</script>

<template>
  <el-config-provider :locale="locale" id="app">
    <router-view></router-view>
  </el-config-provider>
</template>

<style scoped></style>
