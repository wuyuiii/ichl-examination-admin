export interface LogDataType {
  id: number
  user_name: string
  real_name: string
  content: string
  create_time: string
}

export interface MyLogDataType extends LogDataType {
  user_id: number
}
