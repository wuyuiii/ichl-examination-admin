import type { RouteLocationMatched } from 'vue-router'

// 面包屑
export interface TagBar {
  current: any
  back: any
  items: RouteLocationMatched | any
}
