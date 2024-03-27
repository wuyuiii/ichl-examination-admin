export interface MessageDataType {
  content: string
  create_time: string
  id: number
  read_count: number
  receive_user_count: number
  send_real_name: string
  send_user_id: number
  send_user_name: string
  title: string
}

export interface SendMessageDataType {
  title: string
  content: string
  receive_id: number[]
}

export interface OptionItem {
  user_name: string
  id: number
}
