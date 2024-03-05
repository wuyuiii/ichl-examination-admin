import request from '@/utils/request'

/**
 * 获取首页卡片数据
 * @returns
 */
export const getCardDataAPI = () => {
  return request.get('/home/cardData', {
    headers: { 'uid-custom-header': 'e232d5ef-be90-42c4-a797-8f0ce1837a1c' }
  })
}

export const getChartsDataAPI = () => {
  return request.get('/home/chartsData', {
    headers: { 'uid-custom-header': 'e232d5ef-be90-42c4-a797-8f0ce1837a1c' }
  })
}
