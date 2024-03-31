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
 * 获取题目
 * @param id
 * @returns
 */
export const getQuestionAPI = (id: number) => {
  return request.get('/question/getQuestion', { params: { id } })
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

/**
 * 更新题目
 * @param data
 * @returns
 */
export const updateQuestionAPI = (data: CreateQuestionType) => {
  return request.patch('/question/updateQuestion', data)
}
