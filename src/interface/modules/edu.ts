export interface CollegeType {
  id: number
  college_name: string
  department_size: number
  student_num: number
}

export interface DepartmentType {
  id: number
  department_name: string
  college_id: number
  class_size: number
  student_num: number
}

export interface ClassType {
  id: number
  class_name: string
  department_id: number
  college_id: number
  student_num: number
  class_node: string
}

export interface CascaderOptionType {
  value: number
  label: string
  children?: CascaderOptionType
}
