import axios from 'axios'
import router from '@/router/index'
import { ElMessage } from 'element-plus'

// export const baseURL = 'https://examapi.ywhxy.cn'
export const baseURL = 'http://localhost:3000'
const instance = axios.create({
  baseURL: baseURL,
  timeout: 5000
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
    if (res?.data.status === 401) {
      router.push('/login')
      localStorage.removeItem('uid')
      localStorage.removeItem('t')
      localStorage.removeItem('u')
      ElMessage({
        type: 'error',
        message: res.data.message || '服务异常'
      })
    }
    return res
  },
  (err) => {
    if (err.message.split(' ')[0] === 'timeout') {
      return ElMessage.error('网络超时')
    }

    if (err.code === 'ERR_NETWORK') {
      //@ts-ignore
      return ElMessage({
        type: 'error',
        message: '服务异常'
      })
    }
    if (err.response.data.status === 401) {
      router.push('/login')
      localStorage.removeItem('uid')
      localStorage.removeItem('t')
      localStorage.removeItem('u')
    }

    Promise.reject(err)
  }
)

export default instance
