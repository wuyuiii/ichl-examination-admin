export interface QuestionItemType {
  correct: string[] | string
  create_time: string
  create_user: string
  difficult: number
  id: number
  items: Item[]
  question_type: number | string
  score: number
  subject_id: number | string
  title: string
}

export interface Item {
  content: string
  prefix: string
  score?: number
}
