import type { UserLogListType } from '@/interface'
import request from '@/utils/request'

/**
 * 获取用户日志列表
 * @param data
 * @returns
 */
export const getLogListAPI = (data: UserLogListType) => {
  return request.get('/log/getLogList', { params: data })
}
