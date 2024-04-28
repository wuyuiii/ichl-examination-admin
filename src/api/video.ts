import type {
  CreateVideoDataType,
  DeleteVideoType,
  VideoListType
} from '@/interface'
import request from '@/utils/request'

/**
 * 获取视频列表
 * @param data
 * @returns
 */
export const getVideoListAPI = (data: VideoListType) => {
  return request.get('/video/getVideoList', { params: data })
}

/**
 * 获取视频
 * @param val
 * @returns
 */
export const getVideoAPI = (val: number) => {
  return request.get('/video/getVideo', { params: { id: val } })
}

/**
 * 上传视频
 * @param file
 * @returns
 */
export const uploadVideoAPI = (file: any) => {
  return request.post('/video/uploadVideo', file, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 合并视频
 * @param val
 * @returns
 */
export const mergeVideoAPI = (val: number) => {
  return request.get('/video/mergeVideo', {
    params: { wrongCount: val },
    timeout: 10 * 1000
  })
}

/**
 * 上传视频封面
 * @param file
 * @returns
 */
export const uploadVideoPhotoAPI = (file: any) => {
  return request.post('/video/uploadVideoPhoto', file, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 合并视频封面
 * @param val
 * @returns
 */
export const mergeVideoPhotoAPI = (val: number) => {
  return request.get('/video/mergeVideoPhoto', { params: { wrongCount: val } })
}

/**
 * 提交视频
 * @param data
 * @returns
 */
export const submitVideoAPI = (data: CreateVideoDataType) => {
  return request.post('/video/submitVideo', data, { timeout: 5 * 60 * 1000 })
}

/**
 * 删除视频
 * @param id
 * @returns
 */
export const delVideoAPI = (id: number) => {
  return request.delete('/video/delVideo', { params: { id } })
}

/**
 * 更新视频
 * @param data
 * @returns
 */
export const updateVideoAPI = (data: CreateVideoDataType) => {
  return request.patch('/video/updateVideo', data)
}

/**
 * 移除服务器本地暂存文件
 * @param fileName
 * @returns
 */
export const removeVideoAPI = (fileName: DeleteVideoType) => {
  return request.delete('/video/removeStaticVideo', { params: fileName })
}
