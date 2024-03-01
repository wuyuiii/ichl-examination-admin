import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/Login/Index.vue') },
    {
      path: '/register',
      component: () => import('@/views/Register/Index.vue')
    },
    { path: '/', component: () => import('@/layout/Index.vue'), children: [] }
  ]
})

export default router
