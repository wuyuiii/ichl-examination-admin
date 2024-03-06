import { ref } from 'vue'
import { defineStore } from 'pinia'

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

    return {
      isCollapse,
      handleCollapse,
      themeSwitch,
      languageSwitch,
      handleLanguageSwitch
    }
  },
  {
    persist: {}
  }
)
