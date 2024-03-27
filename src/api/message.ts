import type { MessageListType, SendMessageDataType } from '@/interface'
import request from '@/utils/request'

/**
 * 获取消息列表
 * @returns
 */
export const getMessageListAPI = (data: MessageListType) => {
  return request.get('/message/getList', { params: data })
}

export const selectUserNameAPI = (name: string) => {
  return request.get('/user/selectUserName', { params: { name } })
}

/**
 * 发送消息
 * @param data
 * @returns
 */
export const sendMessageAPI = (data: SendMessageDataType) => {
  return request.post('/message/send', data)
}

/**
 * 删除消息
 * @param id
 * @returns
 */
export const delMessageAPI = (id: number) => {
  return request.delete('/message/delMes', { params: { id } })
}
