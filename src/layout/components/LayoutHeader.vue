<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import {
  useRoute,
  useRouter,
  type HistoryState,
  type RouteLocationMatched
} from 'vue-router'
import { ArrowRight, ArrowDown, Moon, Sunny } from '@element-plus/icons-vue'
import { useOptionStore, useUserStore } from '@/stores'
import type { TagBar } from '@/interface'
const optionStore = useOptionStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

// 主题切换
const toggleDark = () => {
  document.documentElement.classList.toggle('dark')
}

watch(
  () => route.fullPath,
  () => {
    getBreadcrumb() // 当路由发生变化时修改breadList
  }
)
onMounted(() => {
  getBreadcrumb()
})

const breadList = ref<RouteLocationMatched[]>([]) // 路由集合
const getBreadcrumb = () => {
  // 通过路由元信息和route.matched数组筛选，将需要显示到面包屑的路由添加到数组中
  breadList.value = route.matched.filter((item) => item.meta && item.meta.title)
  if (breadList.value.length) {
    addSelectTag(
      breadList.value[breadList.value.length - 1],
      router.options.history.state
    )
  }
}

// tag导航
/** 思路
 * 1. 创建一个tagBar对象的数组，用于存放访问记录
 * 2. 创建一个添加tag的函数，接收路由信息和router.options.history.state路由历史
 *  2.1 判断tag数组中是否有重复的，没有重复则添加路由细信息对象
 * 3. 创建一个切换tag的函数，接收传入的路由对象，用于切换路径
 *  3.1 当切换路径时，给当前的tagBar对象修改历史记录
 * 4. 创建一个关闭tag的函数，接收传入的路由对象，用于删除tagBar数组中的访问记录，并跳转链接
 *  4.1 用当前关闭的路由地址和数组中的地址比较找到索引值，并删除数组中对应的记录
 *  4.2 判断关闭的tag是否是被选中的tag还是未被选中的tag，如果不是则不做处理
 *  4.3 将当前关闭的tag的上一次访问路径和tagBar中的路径做比较，如果找不到则跳转到数组最后一项的路径，
 *    找得到就直接跳转到当前项的上一次访问路径
 *  4.4 如果数组为空时直接跳转首页
 */

// 添加tag
const addSelectTag = (items: RouteLocationMatched, history: HistoryState) => {
  // 如果tag数组中重复则不添加，否则添加路由信息
  if (optionStore.tagBar.some((item) => item.items.path === items.path)) {
    return
  }
  const historyItem: TagBar = {
    current: history.current,
    back: history.back,
    items
  }
  optionStore.tagBar.push(historyItem)
}

// 切换tag
const selectTag = (item: TagBar) => {
  item.back = route.path
  router.push(item.current)
}

// 关闭tag
const closeTag = (item: TagBar | any) => {
  const index = optionStore.tagBar.findIndex(
    (i) => i.items.path === item.items.path
  )
  optionStore.tagBar.splice(index, 1)
  if (item.items.path !== route.path) {
    return
  }
  if (optionStore.tagBar.length == 0) {
    return router.replace('/')
  }
  if (optionStore.tagBar.findIndex((i) => item.back === i.current) === -1) {
    return router.push(
      optionStore.tagBar[optionStore.tagBar.length - 1].current
    )
  }
  return router.push(item.back)
}

// 关闭其他tag
const closeOtherTag = (item: TagBar | any) => {
  if (route.fullPath !== item.current) {
    selectTag(item)
  }
  optionStore.tagBar.splice(0)
  optionStore.tagBar.push(item)
}

// 关闭左或右侧tag
const selectTagIndex = ref(0)
const left = ref(true)
const right = ref(true)
const closeLeftTag = (item: TagBar | any) => {
  if (route.fullPath !== item.current) {
    selectTag(item)
  }
  optionStore.tagBar.splice(0, selectTagIndex.value)
}
const closeRightTag = (item: TagBar | any) => {
  if (route.fullPath !== item.current) {
    selectTag(item)
  }
  optionStore.tagBar.splice(selectTagIndex.value + 1, optionStore.tagBar.length)
}

// 关闭全部tag
const closeAllTag = () => {
  optionStore.tagBar.splice(0)
  return router.replace('/')
}

// 横向滚动
const refScrollbar = ref()
const handleScroll = (e: any) => {
  const wheelDelta = e.wheelDelta || -e.deltaY * 40
  refScrollbar.value.setScrollLeft(
    refScrollbar.value.wrapRef.scrollLeft - wheelDelta
  )
}

// 退出登录
const logout = () => {
  localStorage.removeItem('option')
  localStorage.removeItem('uid')
  localStorage.removeItem('t')
  router.push('/login')
  console.log(window.history)
}

// 打开右键菜单
const menuVisible = ref(false)
const menu = ref()
const menuLeft = ref(0)
const menuTop = ref(0)
const selectMenuTag = ref<TagBar>()

const openMenu = (item: TagBar, event: PointerEvent) => {
  menuVisible.value = true
  menuLeft.value = event.clientX + 10
  menuTop.value = event.clientY
  selectMenuTag.value = item

  selectTagIndex.value = optionStore.tagBar.findIndex(
    (tagBar) => tagBar.current === item.current
  )
  // 判断所选的是否为tag数组除去头尾的元素
  if (selectTagIndex.value < optionStore.tagBar.length - 1) {
    left.value = true
    right.value = true
  }
  // 判断所选的是否为tag数组的尾元素
  if (selectTagIndex.value === optionStore.tagBar.length - 1) {
    left.value = true
    right.value = false
  }
  // 判断所选的是否为tag数组的头元素
  if (selectTagIndex.value === 0) {
    left.value = false
    right.value = true
  }
  // 判断所选的是否为tag数组的头元素，并且tag数组只有一个元素
  if (
    selectTagIndex.value === 0 &&
    selectTagIndex.value === optionStore.tagBar.length - 1
  ) {
    left.value = false
    right.value = false
  }
}

const closeMenu = () => {
  menuVisible.value = false
}
watch(menuVisible, (val) => {
  if (val) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

// 个人中心
const goCenter = () => {
  router.push('/center')
}
</script>
<template>
  <div class="header-container">
    <div class="header-top">
      <div class="header-left">
        <div class="header-menu-box" @click="optionStore.handleCollapse">
          <el-icon class="header-menu-click" size="22px">
            <i-ep-Menu />
          </el-icon>
        </div>
        <el-breadcrumb class="header-breadcrumb" :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="item in breadList" :key="item.path">{{
            item.meta.title
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-items">
        <div class="header-switch-group">
          <el-switch
            v-model="optionStore.themeSwitch"
            @change="toggleDark"
            :active-icon="Moon"
            :inactive-icon="Sunny"
            :style="{
              '--el-switch-on-color': optionStore.themeSwitch ? '#2c2c2c' : ''
            }"
          />
          <el-switch
            v-model="optionStore.languageSwitch"
            active-text="英"
            inactive-text="中"
            :style="{
              '--el-switch-on-color': optionStore.themeSwitch ? '#2c2c2c' : ''
            }"
          />
        </div>
        <el-dropdown placement="bottom">
          <span class="el-dropdown-span">
            <el-avatar :src="userStore.userData.image_path" />
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goCenter"> 个人中心 </el-dropdown-item>
              <el-dropdown-item @click="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="header-bottom">
      <el-tag
        @click="$router.push('/')"
        effect="dark"
        type="success"
        style="margin-bottom: 0.625rem"
        >主页</el-tag
      >
      <el-scrollbar
        @wheel.prevent="handleScroll"
        ref="refScrollbar"
        style="margin-right: 1.25rem; padding-bottom: 0.625rem"
      >
        <div class="header-bottom-item">
          <el-tag
            v-for="item in optionStore.tagBar"
            :key="item.items.path"
            closable
            :effect="$route.path === item.items?.path ? 'dark' : 'light'"
            @click="selectTag(item)"
            @close="closeTag(item)"
            @contextmenu.prevent="openMenu(item, $event)"
            >{{ item.items.meta.title }}</el-tag
          >
        </div>
      </el-scrollbar>
      <ul
        v-show="menuVisible"
        class="contextmenu"
        ref="menu"
        :style="{ left: `${menuLeft}px`, top: `${menuTop}px` }"
      >
        <li @click="closeTag(selectMenuTag)">关闭</li>
        <li @click="closeOtherTag(selectMenuTag)">关闭其他</li>
        <li v-show="left" @click="closeLeftTag(selectMenuTag)">关闭左侧</li>
        <li v-show="right" @click="closeRightTag(selectMenuTag)">关闭右侧</li>
        <li @click="closeAllTag">关闭全部</li>
      </ul>
    </div>
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
    .header-left {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
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
      .header-breadcrumb {
        height: 100%;
        padding-left: 1.25rem;
        display: flex;
        &:deep(.el-breadcrumb__inner) {
          font-weight: 520;
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
        .el-switch {
          height: 1.5rem;
        }
      }
      .el-dropdown-span {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .el-avatar {
          margin-right: 0.625rem;
        }
      }
    }
  }
  .header-bottom {
    padding-left: 1.25rem;
    display: flex;
    align-items: center;
    .el-tag {
      margin-right: 0.625rem;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        color: var(--el-menu-text-color);
      }
    }
    .header-bottom-item {
      display: flex;
      margin-right: 1.25rem;
    }
    .contextmenu {
      margin: 0;
      background-color: var(--el-bg-color-overlay);
      z-index: 9000;
      position: absolute;
      list-style-type: none;
      padding: 0.375rem 0;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 400;
      color: var(--el-text-color-primary);
      box-shadow: 0.125rem 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.3);
      li {
        margin: 0;
        padding: 0.5rem 1rem;
        cursor: pointer;
        &:hover {
          background-color: var(--el-menu-hover-bg-color);
        }
      }
    }
  }
}
</style>
