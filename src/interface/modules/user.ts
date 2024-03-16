export interface User {
  age?: number
  birth_day?: string
  create_time?: string
  gender?: number
  id?: number
  image_path?: string
  password?: string
  phone?: string
  real_name?: string
  role?: number
  status?: number
  user_class_id?: null
  user_college_id?: null
  user_department_id?: null
  user_name?: string
  user_uuid?: string
}

export interface StuListType {
  id: number
  user_name: string
  phone: string
  real_name: string
  age: number
  gender: number
  status: number
  create_time: Date
}

export interface EditDataType {
  id?: string | null
  user_name: string
  password: string
  real_name: string
  age: number | null
  phone: string
  gender?: number | null
  birth_day: Date | null
  edu: Array<number> | null
  role?: number | null
  status?: number | null
}

export interface UserLogType {
  id: number
  user_id: number
  user_name: string
  real_name: string
  content: string
  create_time: Date
}
