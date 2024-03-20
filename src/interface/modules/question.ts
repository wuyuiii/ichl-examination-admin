export interface QuestionItemType {
  correct: string[] | string
  create_time: string
  create_user: string
  difficult: number | string
  id: number | string
  items: Item[]
  question_type: number | string
  score: number | string
  subject_id: number | string
  title: string
}

export interface Item {
  content: string
  prefix: string
}

export interface CreateQuestionType {
  title: string // 题干

  question_type: number // 题目类型 1.单选题 2.多选题 3.判断题 4.填空题 5.简答题

  subject_id: number | string // 学科id

  score: number | null // 分数

  items: Item[] // 题目答案数组

  difficult: number | null // 难度

  correct: string | string[] // 正确答案
}
