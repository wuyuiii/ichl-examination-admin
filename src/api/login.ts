import type { LoginData } from '@/interface/api'
import request from '@/utils/request'

export const loginAPI = (data: LoginData) => {
  return request.post('/auth/loginAdmin', data)
}
