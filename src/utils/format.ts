import dayjs from 'dayjs'

export const formatDate = (date: Date | string, format: string): string => {
  return dayjs(date).format(format)
}

export const formatGender = (gender: number): string => {
  if (gender === 0) {
    return '女'
  } else if (gender === 1) {
    return '男'
  } else {
    return '未知'
  }
}
