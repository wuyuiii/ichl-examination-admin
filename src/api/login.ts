import type { LoginDataType } from '@/interface/modules/api'
import request from '@/utils/request'

export const loginAPI = (data: LoginDataType) => {
  return request.post('/auth/loginAdmin', data)
}
