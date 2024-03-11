import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TagBar } from '@/interface/modules/header'

export const useOptionStore = defineStore(
  'option',
  () => {
    // 左侧栏开关
    const isCollapse = ref(false)
    const handleCollapse = () => {
      isCollapse.value = !isCollapse.value
    }

    // 主题切换
    const themeSwitch = ref(false)

    //中英切换
    const languageSwitch = ref(false)
    const handleLanguageSwitch = (val: boolean) => {
      languageSwitch.value = val
    }

    // tag导航
    const tagBar = ref<TagBar[]>([])
    return {
      isCollapse,
      handleCollapse,
      themeSwitch,
      languageSwitch,
      handleLanguageSwitch,
      tagBar
    }
  },
  {
    persist: {
      paths: ['isCollapse', 'themeSwitch', 'languageSwitch']
    }
  }
)
