import type { LoginDataType } from '@/interface/modules/api'
import request from '@/utils/request'

/**
 * 账号登录
 * @param param0
 * @returns
 */
export const loginAPI = ({ user_name, password }: LoginDataType) => {
  return request.post('/auth/loginAdmin', { user_name, password })
}

/**
 * 手机号登录
 * @param param0
 * @returns
 */
export const loginPhoneAPI = ({ phone, code }: LoginDataType) => {
  return request.post('/auth/loginPhoneAdmin', { phone, code })
}

/**
 * 手机号验证
 * @param phone
 * @returns
 */
export const validatePhoneAPI = (phone: string) => {
  return request.post('/auth/validatePhone', { phone })
}

/**
 * 获取小程序码
 * @returns
 */
export const getQRCodeAPI = () => {
  return request.get('/auth/createQRcode')
}

/**
 * 轮询小程序码
 * @param val
 * @returns
 */
export const checkQRCodeAPI = (val: string) => {
  return request.post('/auth/checkQRCode', { scene: val })
}
