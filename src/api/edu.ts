import request from '@/utils/request'

/**
 * 获取学院列表
 * @returns
 */
export const getCollegeListAPI = () => {
  return request.get('/edu/getCollegeList')
}

/**
 * 获取专业列表
 * @returns
 */
export const getDepartmentListAPI = (college_id: string = '') => {
  return request.get('/edu/getDepartmentList', {
    params: {
      college_id
    }
  })
}

/**
 * 获取班级列表
 * @returns
 */
export const getClassListAPI = (department_id: string = '') => {
  return request.get('/edu/getClassList', {
    params: {
      department_id
    }
  })
}

export const getEduOptionAPI = () => {
  return request.get('/edu/getEduOption')
}
