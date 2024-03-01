import { createApp } from 'vue'
import pinia from './stores'
import App from './App.vue'
import router from './router'

import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/main.scss'
import '@/assets/dark.scss'

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
