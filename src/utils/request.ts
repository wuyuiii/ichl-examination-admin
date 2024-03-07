import axios from 'axios'
import router from '@/router/index'
import { ElMessage } from 'element-plus'

export const baseURL = 'http://localhost:3000'
const instance = axios.create({
  baseURL: baseURL,
  timeout: 1000
})

/**
 * 请求拦截
 */
instance.interceptors.request.use(
  (config) => {
    const t = localStorage.getItem('t')
    if (t) {
      config.headers.setAuthorization(`Bearer ${t}`)
      config.headers.set('uid-custom-header', localStorage.getItem('uid'))
    }

    return config
  },
  (err) => {
    Promise.reject(err)
  }
)

/**
 * 响应拦截
 */
instance.interceptors.response.use(
  (res) => {
    return res
  },
  (err) => {
    if (err.response.data.status === 401) {
      router.push('/login')
      localStorage.removeItem('uid')
      localStorage.removeItem('t')
      localStorage.removeItem('u')
    }
    //@ts-ignore
    ElMessage({
      type: 'error',
      message: err.response.data.message || '服务异常'
    })
    Promise.reject(err)
  }
)

export default instance
