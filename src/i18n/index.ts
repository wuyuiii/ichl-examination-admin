import { createI18n } from 'vue-i18n'
import zh from './locales/zh-cn'
import en from './locales/en'

export const getCurrLang = () => {
  // const localLang = navigator.language.split('-')[0]; // 浏览器语言
  const localStorageLang = JSON.parse(
    localStorage.getItem('option') as string
  ).languageSwitch // 本地存储语言
  return localStorageLang ? 'en' : 'zh'
}

//注册i18n实例并引入语言文件
const i18n = createI18n({
  legacy: false,
  locale: getCurrLang(), // 语言标识
  fallbackLocale: 'zh-cn', //没有英文的时候默认中文语言
  messages: {
    zh,
    en
  }
})
export default i18n
