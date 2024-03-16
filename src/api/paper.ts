import type { PaperDataType, paperListType } from '@/interface'
import request from '@/utils/request'

/**
 * 获取试卷列表
 * @param data
 * @returns
 */
export const getPaperListAPI = (data: paperListType) => {
  return request.get('/paper/getPaperList', { params: data })
}

/**
 * 获取试卷
 * @param id
 * @returns
 */
export const getPaperAPI = (id: number) => {
  return request.get('/paper/getPaper', { params: { id } })
}

/**
 * 删除试卷
 * @param id
 * @returns
 */
export const delPaperAPI = (id: number) => {
  return request.delete('/paper/delPaper', { params: { id } })
}

/**
 * 创建试卷
 * @param data
 * @returns
 */
export const createPaperAPI = (data: PaperDataType) => {
  return request.post('/paper/createPaper', data)
}

/**
 * 编辑试卷
 * @param data
 * @returns
 */
export const updatePaperAPI = (data: PaperDataType) => {
  return request.post('/paper/updatePaper', data)
}
