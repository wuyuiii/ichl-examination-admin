import type { SubjectDataType, SubjectListType } from '@/interface'
import request from '@/utils/request'

/**
 * 获取学科列表(分页、查询)
 * @param data
 * @returns
 */
export const getSubjectListAPI = (data: SubjectListType) => {
  return request.get('/subject/getSubListAdmin', { params: data })
}

/**
 * 获取学科列表
 * @param data
 * @returns
 */
export const getSubjectListAPI2 = () => {
  return request.get('/subject/getSubList')
}

/**
 * 获得学科
 * @param id
 * @returns
 */
export const getSubjectAPI = (id: number) => {
  return request.get('/subject/getSubject', { params: { id } })
}

/**
 * 创建学科
 * @param data
 * @returns
 */
export const addSubjectAPI = (data: SubjectDataType) => {
  return request.post('/subject/createSubject', data)
}

/**
 * 编辑学科
 * @param data
 * @returns
 */
export const updateSubjectAPI = (data: SubjectDataType) => {
  return request.patch('/subject/updateSubject', data)
}

/**
 * 删除学科
 * @param id
 * @returns
 */
export const delSubjectAPI = (id: number) => {
  return request.delete('/subject/delSubject', { params: { id } })
}
