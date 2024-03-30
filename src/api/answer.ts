import type { Answer, GetAnswerListType } from '@/interface'
import request from '@/utils/request'

/**
 * 获取答卷列表
 * @param data
 * @returns
 */
export const getAnswerListAPI = (data: GetAnswerListType) => {
  return request.get('/paper/getAnswerPaperList', { params: data })
}

/**
 * 获取答卷
 * @param id
 * @returns
 */
export const getAnswerAPI = (id: number) => {
  return request.get('/paper/getAnswerPaper', { params: { id } })
}

/**
 * 批改试卷
 * @param data
 * @returns
 */
export const correctionPaperAPI = (data: Answer) => {
  return request.post('/paper/correctPaper', data)
}
