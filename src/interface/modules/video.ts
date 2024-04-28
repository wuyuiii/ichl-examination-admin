export interface VideoDataType {
  video_src: string
  video_photos_src: string
  video_name: string
  id?: number
  subject_id: number | null
  create_time?: Date
  college_id?: number
  department_id?: number
  class_id?: number
  create_user_name: string
  status: number
}

/**
 * 创建视频类
 */
export interface CreateVideoDataType {
  id: number | null
  videoSrc: string
  videoPhotosSrc: string
  videoName: string
  subjectId: number | null
  edu: Array<number>
}

export interface DeleteVideoType {
  videoFileName: string
  videoPhotoFileName: string
}
