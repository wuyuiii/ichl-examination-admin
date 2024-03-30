import type { QuestionItemType } from './question'
import type { SubjectDataType } from './subject'

export interface AnswerListDataType {
  create_time: string
  create_user: string
  create_user_id: number
  do_time: number
  exam_paper_id: number
  id: number
  paper_name: string
  paper_score: number | null
  paper_type: number
  question_correct: number
  question_count: number
  status: number
  subject_id: SubjectDataType
  system_score: number
  user_score: number | null
}

export interface AnswerDataType {
  answer: Answer
  paper: Paper
}

export interface Answer {
  id: number
  doTime: number
  score: number | null
  answerUser: string
  status: number
  answerItems: AnswerItems[]
}

export interface AnswerItems {
  id: number
  questionId: number
  doRight: number
  itemOrder: number
  questionScore: number
  score: number
  content: string | null
  contentArray: string[]
}

export interface Paper {
  id: number
  paperTitle: string
  subjectId: number
  question_count: number
  paperType: number
  score: number
  suggestTime: number
  limitDateTime: string[]
  create_time: string
  create_user: string
  titleItems: {
    name: string
    questionItem: AnswerPaperQuestionType[]
  }[]
}
export interface AnswerPaperQuestionType extends QuestionItemType {
  correctArray: string[]
  question_name: string
  itemOrder: number
}
