import type {
  ClassListType,
  ClassType,
  CollegeListType,
  DepartmentListType,
  GetClassStudentType,
  StuOperationType
} from '@/interface'
import request from '@/utils/request'

/**
 * 获取学院列表
 * @returns
 */
export const getCollegeListAPI = (data: CollegeListType) => {
  return request.get('/edu/getCollegeList', { params: data })
}

/**
 * 获取学院信息
 * @param id
 * @returns
 */
export const getCollegeAPI = (id: number) => {
  return request.get('/edu/getCollege', { params: { id } })
}

/**
 * 删除学院
 * @param id
 * @returns
 */
export const delCollegeAPI = (id: number) => {
  return request.delete('/edu/delCollege', { params: { id } })
}

/**
 * 更新学院
 * @param data
 * @returns
 */
export const updateCollegeAPI = (data: { id: string; collegeName: string }) => {
  return request.patch('/edu/updateCollege', data)
}

/**
 * 添加学院
 * @param data
 * @returns
 */
export const addCollegeAPI = (data: { collegeName: string }) => {
  return request.post('/edu/createCollege', data)
}

/**
 * 获取专业列表
 * @returns
 */
export const getDepartmentListAPI = (data: DepartmentListType) => {
  return request.get('/edu/getDepartmentList', { params: data })
}

/**
 * 获取专业信息
 * @param id
 * @returns
 */
export const getDepartmentAPI = (id: number) => {
  return request.get('/edu/getDepartment', { params: { id } })
}

/**
 * 删除专业
 * @param id
 * @returns
 */
export const delDepartmentAPI = (id: number) => {
  return request.delete('/edu/delDepartment', { params: { id } })
}

/**
 * 更新专业
 * @param data
 * @returns
 */
export const updateDepartmentAPI = (data: {
  id: string
  departmentName: string
  collegeId: string
}) => {
  return request.patch('/edu/updateDepartment', data)
}

/**
 * 添加专业
 * @param data
 * @returns
 */
export const addDepartmentAPI = (data: {
  departmentName: string
  collegeId: string
}) => {
  return request.post('/edu/createDepartment', data)
}

/**
 * 获取班级列表
 * @returns
 */
export const getClassListAPI = (data: ClassListType) => {
  return request.get('/edu/getClassList', { params: data })
}

/**
 * 获取班级信息
 * @param id
 * @returns
 */
export const getClassAPI = (id: number) => {
  return request.get('/edu/getClass', { params: { id } })
}

/**
 * 删除班级
 * @param id
 * @returns
 */
export const delClassAPI = (id: number) => {
  return request.delete('/edu/delClass', { params: { id } })
}

/**
 * 添加班级
 * @param data
 * @returns
 */
export const addClassAPI = (data: ClassType) => {
  return request.post('/edu/createClass', data)
}

/**
 * 更新班级
 * @param data
 * @returns
 */
export const updateClassAPI = (data: ClassType) => {
  return request.patch('/edu/updateClass', data)
}

/**
 * 获取学院、专业、班级级联对象
 * @returns
 */
export const getEduOptionAPI = () => {
  return request.get('/edu/getEduOption')
}

/**
 * 获取班级学生
 * @param data
 * @returns
 */
export const getClassStudentAPI = (data: GetClassStudentType) => {
  return request.get('/edu/getClassStudent', { params: data })
}

/**
 * 班级添加学生
 * @param data
 * @returns
 */
export const addClassStudentAPI = (data: StuOperationType) => {
  return request.post('/edu/addClassStudent', data)
}

/**
 * 班级移除学生
 * @param data
 * @returns
 */
export const delClassStudentAPI = (data: StuOperationType) => {
  return request.post('/edu/delClassStudent', data)
}
