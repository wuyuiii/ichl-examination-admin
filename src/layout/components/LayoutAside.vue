<script lang="ts" setup>
import { ref } from 'vue'
import { useOptionStore } from '@/stores'
const optionStore = useOptionStore()
</script>

<template>
  <el-menu
    default-active="0"
    class="aside-container"
    :collapse="optionStore.isCollapse"
  >
    <div class="aside-logo">logo</div>
    <el-menu-item index="0">
      <el-icon><i-ep-House /></el-icon>
      <span>主页</span>
    </el-menu-item>
    <el-sub-menu index="1">
      <template #title>
        <el-icon><i-ep-User /></el-icon>
        <span class="title-text">用户管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="1-1">学生列表</el-menu-item>
        <el-menu-item index="1-2">教师列表</el-menu-item>
        <el-menu-item index="1-3">管理员列表</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><i-ep-Notebook /></el-icon>
        <span class="title-text">学科管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="2-1">学科列表</el-menu-item>
        <el-menu-item index="2-2">学科创建</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon><i-ep-Document /></el-icon>
        <span class="title-text">卷库管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="3-1">试卷列表</el-menu-item>
        <el-menu-item index="3-2">试卷创建</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>
        <el-icon><i-ep-CollectionTag /></el-icon>
        <span class="title-text">题库管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="4-1">题目列表</el-menu-item>
        <el-menu-item index="4-2">单选题创建</el-menu-item>
        <el-menu-item index="4-3">多选题创建</el-menu-item>
        <el-menu-item index="4-4">判断题创建</el-menu-item>
        <el-menu-item index="4-5">填空题创建</el-menu-item>
        <el-menu-item index="4-6">简答题创建</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-sub-menu index="5">
      <template #title>
        <el-icon><i-ep-Message /></el-icon>
        <span class="title-text">消息管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="5-1">消息列表</el-menu-item>
        <el-menu-item index="5-2">消息发送</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-sub-menu index="6">
      <template #title>
        <el-icon><i-ep-Discount /></el-icon>
        <span class="title-text">教务管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="6-1">学院列表</el-menu-item>
        <el-menu-item index="6-2">学院创建</el-menu-item>
        <el-menu-item index="6-3">专业列表</el-menu-item>
        <el-menu-item index="6-4">专业创建</el-menu-item>
        <el-menu-item index="6-5">班级列表</el-menu-item>
        <el-menu-item index="6-6">班级创建</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
  </el-menu>
</template>

<style lang="scss" scoped>
.aside-container {
  height: 100%;
  .aside-logo {
    width: 100%;
    height: 3.125rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title-text {
    padding-right: 1.5rem;
  }
}
</style>
