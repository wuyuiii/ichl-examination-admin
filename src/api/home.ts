import request from '@/utils/request'

/**
 * 获取首页卡片数据
 * @returns
 */
export const getCardDataAPI = () => {
  return request.get('/home/cardData')
}

export const getChartsDataAPI = () => {
  return request.get('/home/chartsData')
}
