import request from '@/utils/request'

/**
 * 获取首页卡片数据
 * @returns
 */
export const getCardDataAPI = () => {
  return request.get('/home/cardData', {
    headers: { 'uid-custom-header': localStorage.getItem('uid') }
  })
}

export const getChartsDataAPI = () => {
  return request.get('/home/chartsData', {
    headers: { 'uid-custom-header': localStorage.getItem('uid') }
  })
}
