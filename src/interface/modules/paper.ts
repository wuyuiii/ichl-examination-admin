import type { QuestionItemType } from './question'

export interface PaperDataType {
  id: number | null
  paperType: number | null
  subjectId: number | null
  paperTitle: string
  suggestTime: number | null
  edu: number[]
  limitDateTime: string[]
  titleItems: TitleItem[]
  score: number | null
}

export interface TitleItem {
  name: string
  questionItem: QuestionItemType[]
}
