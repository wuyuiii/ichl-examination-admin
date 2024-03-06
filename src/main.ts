import { createApp } from 'vue'
import pinia from './stores'
import App from './App.vue'
import router from './router'

import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import '@/assets/main.scss'
import '@/assets/dark.scss'
import '@/assets/font.js'

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
