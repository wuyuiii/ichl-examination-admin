/**
 * 登录请求数据
 */
export interface LoginDataType {
  user_name: string
  password: string
  phone: string
  code: string
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
  id?: number
  keyword?: string
}

export interface SubjectListType {
  pageIndex: number
  pageSize: number
  keyword: string
}

export interface paperListType {
  pageIndex: number
  pageSize: number
  keyword: string
  id: number
  paperType: string
  subjectId: string
}

export interface QuestionListType {
  pageIndex: number
  pageSize: number
  keyword: string
  questionType: string
  subjectId: string
}

export interface MessageListType {
  pageIndex: number
  pageSize: number
  keyword: string
}

export interface CollegeListType extends MessageListType {}

export interface DepartmentListType extends CollegeListType {
  college_id?: string
}

export interface ClassListType extends DepartmentListType {
  department_id: string
}

export interface GetClassStudentType {
  pageIndex: number
  pageSize: number
  classId: number | null
  real_name: string
}

export interface GetAnswerListType {
  pageIndex: number
  pageSize: number
  keyword: string
  paperType: number | null
  subjectId: number | null
  status: number | null
}

export interface VideoListType {
  id: number
  pageIndex: number
  pageSize: number
  keyword: string
  subjectId: string
}
