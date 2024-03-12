/**
 * 登录请求数据
 */
export interface LoginDataType {
  user_name: string
  password: string
}

/**
 * 用户管理列表请求数据
 */
export interface UserListType {
  pageIndex: number
  pageSize: number
  role: number
  real_name: string
}

/**
 * 用户操作日志列表请求数据
 */
export interface UserLogListType {
  pageIndex: number
  pageSize: number
  id: number
}

export interface SubjectListType {
  pageIndex: number
  pageSize: number
  keyword: string
}
