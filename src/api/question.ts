import type { CreateQuestionType, QuestionListType } from '@/interface'
import request from '@/utils/request'

/**
 * 获取题目列表
 * @param data
 * @returns
 */
export const getQuestionListAPI = (data: QuestionListType) => {
  return request.get('/question/getQuestionList', { params: data })
}

/**
 * 创建题目
 * @param data
 * @returns
 */
export const createQuestionAPI = (data: CreateQuestionType) => {
  return request.post('/question/createQuestion', data)
}

/**
 * 删除题目
 * @param id
 * @returns
 */
export const delQuestionAPI = (id: number) => {
  return request.delete('/question/delQuestion', { params: { id } })
}
