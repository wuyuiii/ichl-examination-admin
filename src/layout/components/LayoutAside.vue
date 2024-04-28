<script lang="ts" setup>
import { useOptionStore } from '@/stores'
import { Tickets } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
const optionStore = useOptionStore()
const router = useRouter()
const route = useRoute()
const backHome = () => {
  router.push('/')
}
</script>

<template>
  <el-scrollbar>
    <el-menu
      :default-active="route.fullPath"
      router
      class="aside-container"
      :collapse="optionStore.isCollapse"
    >
      <div class="aside-logo" @click="backHome">logo</div>
      <el-menu-item index="/home">
        <el-icon><i-ep-House /></el-icon>
        <span>主页</span>
      </el-menu-item>
      <el-sub-menu index="/user">
        <template #title>
          <el-icon><i-ep-User /></el-icon>
          <span class="title-text">用户管理</span>
        </template>
        <el-menu-item-group title="用户管理">
          <el-menu-item index="/user/student">学生列表</el-menu-item>
          <el-menu-item index="/user/teacher">教师列表</el-menu-item>
          <el-menu-item index="/user/admin">管理员列表</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="/subject">
        <template #title>
          <el-icon><i-ep-Notebook /></el-icon>
          <span class="title-text">学科管理</span>
        </template>
        <el-menu-item-group title="学科管理">
          <el-menu-item index="/subject/list">学科列表</el-menu-item>
          <el-menu-item index="/subject/edit">学科创建</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="/paper">
        <template #title>
          <el-icon><i-ep-Document /></el-icon>
          <span class="title-text">卷库管理</span>
        </template>
        <el-menu-item-group title="卷库管理">
          <el-menu-item index="/paper/list">试卷列表</el-menu-item>
          <el-menu-item index="/paper/edit">试卷创建</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="/question">
        <template #title>
          <el-icon><i-ep-CollectionTag /></el-icon>
          <span class="title-text">题库管理</span>
        </template>
        <el-menu-item-group title="题库管理">
          <el-menu-item index="/question/list">题目列表</el-menu-item>
          <el-menu-item index="/question/edit/singleChoice"
            >单选题创建</el-menu-item
          >
          <el-menu-item index="/question/edit/multipleChoice"
            >多选题创建</el-menu-item
          >
          <el-menu-item index="/question/edit/trueFalse"
            >判断题创建</el-menu-item
          >
          <el-menu-item index="/question/edit/gapFilling"
            >填空题创建</el-menu-item
          >
          <el-menu-item index="/question/edit/shortAnswer"
            >简答题创建</el-menu-item
          >
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="/message">
        <template #title>
          <el-icon><i-ep-Message /></el-icon>
          <span class="title-text">消息管理</span>
        </template>
        <el-menu-item-group title="消息管理">
          <el-menu-item index="/message/list">消息列表</el-menu-item>
          <el-menu-item index="/message/send">消息发送</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="/edu">
        <template #title>
          <el-icon><i-ep-Discount /></el-icon>
          <span class="title-text">教务管理</span>
        </template>
        <el-menu-item-group title="教务管理">
          <el-menu-item index="/edu/college/list">学院列表</el-menu-item>
          <el-menu-item index="/edu/department/list">专业列表</el-menu-item>
          <el-menu-item index="/edu/class/list">班级列表</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="/answer">
        <template #title>
          <el-icon><i-ep-Tickets /></el-icon>
          <span class="title-text">答卷管理</span>
        </template>
        <el-menu-item-group title="答卷管理">
          <el-menu-item index="/answer/list">答卷列表</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="/video">
        <template #title>
          <el-icon><i-ep-VideoPlay /></el-icon>
          <span class="title-text">视频管理</span>
        </template>
        <el-menu-item-group title="视频管理">
          <el-menu-item index="/video/list">视频列表</el-menu-item>
          <el-menu-item index="/video/edit">视频创编</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="/log">
        <template #title>
          <el-icon><i-ep-Tickets /></el-icon>
          <span class="title-text">日志中心</span>
        </template>
        <el-menu-item-group title="日志中心">
          <el-menu-item index="/log/list">用户日志</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.aside-container {
  height: 100vh;
  .aside-logo {
    width: 100%;
    height: 3.125rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .title-text {
    padding-right: 1.5rem;
  }
  &:deep(.el-menu) {
    background-color: #fbfbfb;
    .el-menu-item-group__title {
      padding: 0;
      display: none;
    }
  }
}
</style>
