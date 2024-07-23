<script lang="ts" setup>
import { useOptionStore } from '@/stores'
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
      <div class="aside-logo" @click="backHome">
        <span v-if="!optionStore.isCollapse">{{ $t('MENU.TITLE') }}</span>
        <svg
          v-else
          class="icon aside-logo-icon"
          aria-hidden="true"
          :style="{ fill: optionStore.themeSwitch ? '#cfd3dc' : '#606266' }"
        >
          <use xlink:href="#icon-zhihuikaoshi"></use>
        </svg>
      </div>
      <el-menu-item index="/home">
        <el-icon><i-ep-House /></el-icon>
        <span>{{ $t('MENU.HOME') }}</span>
      </el-menu-item>
      <el-sub-menu index="/user">
        <template #title>
          <el-icon><i-ep-User /></el-icon>
          <span class="title-text">{{ $t('MENU.USER.USER_MANAGE') }}</span>
        </template>
        <el-menu-item-group :title="$t('MENU.USER.USER_MANAGE')">
          <el-menu-item index="/user/student/list">
            {{ $t('MENU.USER.STUDENT_LIST') }}
          </el-menu-item>
          <el-menu-item index="/user/teacher/list">
            {{ $t('MENU.USER.TEACHER_LIST') }}
          </el-menu-item>
          <el-menu-item index="/user/admin/list">
            {{ $t('MENU.USER.ADMIN_LIST') }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="/subject">
        <template #title>
          <el-icon><i-ep-Notebook /></el-icon>
          <span class="title-text">
            {{ $t('MENU.SUBJECT.SUBJECT_MANAGE') }}
          </span>
        </template>
        <el-menu-item-group :title="$t('MENU.SUBJECT.SUBJECT_MANAGE')">
          <el-menu-item index="/subject/list">
            {{ $t('MENU.SUBJECT.SUBJECT_LIST') }}
          </el-menu-item>
          <el-menu-item index="/subject/edit">
            {{ $t('MENU.SUBJECT.SUBJECT_CREATE') }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="/paper">
        <template #title>
          <el-icon><i-ep-Document /></el-icon>
          <span class="title-text">{{ $t('MENU.PAPER.PAPER_MANAGE') }}</span>
        </template>
        <el-menu-item-group :title="$t('MENU.PAPER.PAPER_MANAGE')">
          <el-menu-item index="/paper/list">
            {{ $t('MENU.PAPER.PAPER_LIST') }}
          </el-menu-item>
          <el-menu-item index="/paper/edit">
            {{ $t('MENU.PAPER.PAPER_CREATE') }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="/question">
        <template #title>
          <el-icon><i-ep-CollectionTag /></el-icon>
          <span class="title-text">
            {{ $t('MENU.QUESTION.QUESTION_MANAGE') }}
          </span>
        </template>
        <el-menu-item-group :title="$t('MENU.QUESTION.QUESTION_MANAGE')">
          <el-menu-item index="/question/list">
            {{ $t('MENU.QUESTION.QUESTION_LIST') }}
          </el-menu-item>
          <el-menu-item index="/question/edit/singleChoice">
            {{ $t('MENU.QUESTION.SINGLE_CHOICE_CREATE') }}
          </el-menu-item>
          <el-menu-item index="/question/edit/multipleChoice">
            {{ $t('MENU.QUESTION.MULTIPLE_CHOICE_CREATE') }}
          </el-menu-item>
          <el-menu-item index="/question/edit/trueFalse">
            {{ $t('MENU.QUESTION.TRUE_FALSE_CREATE') }}
          </el-menu-item>
          <el-menu-item index="/question/edit/gapFilling">
            {{ $t('MENU.QUESTION.GAP_FILLING_CREATE') }}
          </el-menu-item>
          <el-menu-item index="/question/edit/shortAnswer">
            {{ $t('MENU.QUESTION.SHORT_ANSWER_CREATE') }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="/message">
        <template #title>
          <el-icon><i-ep-Message /></el-icon>
          <span class="title-text">
            {{ $t('MENU.MESSAGE.MESSAGE_MANAGE') }}
          </span>
        </template>
        <el-menu-item-group :title="$t('MENU.MESSAGE.MESSAGE_MANAGE')">
          <el-menu-item index="/message/list">
            {{ $t('MENU.MESSAGE.MESSAGE_LIST') }}
          </el-menu-item>
          <el-menu-item index="/message/send">
            {{ $t('MENU.MESSAGE.MESSAGE_SEND') }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="/edu">
        <template #title>
          <el-icon><i-ep-Discount /></el-icon>
          <span class="title-text">{{ $t('MENU.EDU.EDU_MANAGE') }}</span>
        </template>
        <el-menu-item-group :title="$t('MENU.EDU.EDU_MANAGE')">
          <el-menu-item index="/edu/college/list">
            {{ $t('MENU.EDU.COLLEGE_LIST') }}
          </el-menu-item>
          <el-menu-item index="/edu/department/list">
            {{ $t('MENU.EDU.DEPARTMENT_LIST') }}
          </el-menu-item>
          <el-menu-item index="/edu/class/list">
            {{ $t('MENU.EDU.CLASS_LIST') }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="/answer">
        <template #title>
          <el-icon><i-ep-Tickets /></el-icon>
          <span class="title-text">{{ $t('MENU.ANSWER.ANSWER_MANAGE') }}</span>
        </template>
        <el-menu-item-group :title="$t('MENU.ANSWER.ANSWER_MANAGE')">
          <el-menu-item index="/answer/list">
            {{ $t('MENU.ANSWER.ANSWER_LIST') }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="/video">
        <template #title>
          <el-icon><i-ep-VideoPlay /></el-icon>
          <span class="title-text">{{ $t('MENU.VIDEO.VIDEO_MANAGE') }}</span>
        </template>
        <el-menu-item-group :title="$t('MENU.VIDEO.VIDEO_MANAGE')">
          <el-menu-item index="/video/list">
            {{ $t('MENU.VIDEO.VIDEO_LIST') }}
          </el-menu-item>
          <el-menu-item index="/video/edit">
            {{ $t('MENU.VIDEO.VIDEO_CREATE') }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="/log">
        <template #title>
          <el-icon><i-ep-Tickets /></el-icon>
          <span class="title-text">{{ $t('MENU.LOG.LOG_MANAGE') }}</span>
        </template>
        <el-menu-item-group :title="$t('MENU.LOG.LOG_MANAGE')">
          <el-menu-item index="/log/list">{{
            $t('MENU.LOG.USER_LOG_LIST')
          }}</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.aside-container {
  height: 100vh;
  .aside-logo {
    position: relative;
    width: 100%;
    height: 3.125rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    span {
      white-space: nowrap;
    }
    .aside-logo-icon {
      font-size: 2rem;
    }
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
