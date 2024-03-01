<script lang="ts" setup>
import { ref } from 'vue'
import { ArrowRight, ArrowDown, Moon, Sunny } from '@element-plus/icons-vue'
import { useOptionStore } from '@/stores'
const optionStore = useOptionStore()

// 主题切换
const toggleDark = () => {
  document.documentElement.classList.toggle('dark')
}
</script>
<template>
  <div class="header-container">
    <div class="header-top">
      <div class="header-menu-box" @click="optionStore.handleCollapse">
        <el-icon class="header-menu-click" size="22px">
          <i-ep-Menu />
        </el-icon>
      </div>
      <div class="header-items">
        <div class="header-switch-group">
          <el-switch
            v-model="optionStore.themeSwitch"
            @change="toggleDark"
            :active-icon="Moon"
            :inactive-icon="Sunny"
            active-color="#2c2c2c"
          />
          <el-switch
            v-model="optionStore.languageSwitch"
            active-text="英"
            inactive-text="中"
            :active-color="optionStore.themeSwitch ? '#2c2c2c' : ''"
          />
        </div>
        <el-dropdown placement="bottom">
          <span class="el-dropdown-span">
            <el-avatar />
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item> 个人中心 </el-dropdown-item>
              <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <el-breadcrumb class="header-breadcrumb" :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
      <el-breadcrumb-item>promotion management</el-breadcrumb-item>
      <el-breadcrumb-item>promotion list</el-breadcrumb-item>
      <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<style lang="scss" scoped>
.header-container {
  width: 100%;
  height: 5.625rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 3.75rem;
    padding-right: 1.25rem;
    border-bottom: 1px solid var(--el-border-color);
    margin-bottom: 0.625rem;
    .header-menu-box {
      height: 100%;
      padding: 0 0.625rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s;
      .header-menu-click {
        transition: all 0.4s;
      }
      &:hover {
        background-color: var(--el-menu-hover-bg-color);
        .header-menu-click {
          color: #838383;
        }
      }
    }

    .header-items {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .header-switch-group {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        margin-right: 1.25rem;
      }
      .el-dropdown-span {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }

  .header-breadcrumb {
    height: 24px;
    padding-left: 1.25rem;
  }
}
</style>
