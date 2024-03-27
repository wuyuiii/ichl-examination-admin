export interface CollegeType {
  id: number | null
  college_name: string
  department_size?: number | null
  student_num?: number | null
}

export interface DepartmentType {
  id: number | null
  department_name: string
  college_id: number | null
  class_size?: number | null
  student_num?: number | null
}

export interface ClassType {
  id: number | null
  class_name: string
  departmentId: number | null
  collegeId: number | null
  studentNum?: number | null
  classNode: string
}

export interface CascaderOptionType {
  value: number
  label: string
  children?: CascaderOptionType
}

export interface StuOperationType {
  classId: number | null
  studentId: Array<string | number>
}
