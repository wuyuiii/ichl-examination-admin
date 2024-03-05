<script setup lang="ts">
import LayoutAside from './components/LayoutAside.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFooter from './components/LayoutFooter.vue'
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="auto">
      <LayoutAside />
    </el-aside>
    <el-container>
      <el-header style="padding: 0; height: auto"><LayoutHeader /></el-header>
      <el-main><router-view></router-view></el-main>
      <el-footer style="padding: 0"><LayoutFooter /></el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
}
</style>
