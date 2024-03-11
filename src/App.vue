<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { onMounted } from 'vue'
import { useOptionStore } from './stores'

const optionStore = useOptionStore()
const dark = () => {
  if (optionStore.themeSwitch) {
    document.documentElement.classList.add('dark')
  }
}

onMounted(() => {
  dark()
})
// import zhCn from 'element-plus/lib/locale/lang/zh-cn'
// 如果使用 lib目录下的话vite会报 No known conditions for "./lib/locale/lang/zh-cn" ...
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<style scoped></style>
