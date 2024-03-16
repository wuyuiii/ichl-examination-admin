import type { QuestionListType } from '@/interface'
import request from '@/utils/request'

/**
 * 获取题目列表
 * @param data
 * @returns
 */
export const getQuestionListAPI = (data: QuestionListType) => {
  return request.get('/question/getQuestionList', { params: data })
}
