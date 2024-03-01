import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/Login/Index.vue') },
    {
      path: '/register',
      component: () => import('@/views/Register/Index.vue')
    },
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/layout/Index.vue'),
      children: [
        { path: '/home', component: () => import('@/views/Home/Index.vue') },
        {
          path: '/user',
          children: [
            {
              path: '/user/student',
              redirect: '/user/student/list',
              children: [
                {
                  path: '/user/student/list',
                  component: () => import('@/views/User/StudentList.vue')
                },
                {
                  path: '/user/student/edit',
                  component: () => import('@/views/User/StudentList.vue')
                }
              ]
            },
            {
              path: '/user/teacher',
              redirect: '/user/teacher/list',
              children: [
                {
                  path: '/user/teacher/list',
                  component: () => import('@/views/User/TeacherList.vue')
                },
                {
                  path: '/user/teacher/edit',
                  component: () => import('@/views/User/StudentList.vue')
                }
              ]
            },
            {
              path: '/user/admin',
              redirect: '/user/admin/list',
              children: [
                {
                  path: '/user/admin/list',
                  component: () => import('@/views/User/AdminList.vue')
                },
                {
                  path: '/user/admin/edit',
                  component: () => import('@/views/User/StudentList.vue')
                }
              ]
            }
          ]
        },
        {
          path: '/subject',
          children: [
            {
              path: '/subject/list',
              component: () => import('@/views/Subject/SubjectList.vue')
            },
            {
              path: '/subject/edit',
              component: () => import('@/views/Subject/SubjectEdit.vue')
            }
          ]
        },
        {
          path: '/paper',
          children: [
            {
              path: '/paper/list',
              component: () => import('@/views/Paper/PaperList.vue')
            },
            {
              path: '/paper/edit',
              component: () => import('@/views/Paper/PaperEdit.vue')
            }
          ]
        },
        {
          path: '/question',
          children: [
            {
              path: '/question/list',
              component: () => import('@/views/Question/QuestionList.vue')
            },
            {
              path: '/question/edit',
              children: [
                {
                  path: '/question/edit/singleChoice',
                  component: () =>
                    import('@/views/Question/Edit/singleChoice.vue')
                },
                {
                  path: '/question/edit/multipleChoice',
                  component: () =>
                    import('@/views/Question/Edit/multipleChoice.vue')
                },
                {
                  path: '/question/edit/trueFalse',
                  component: () => import('@/views/Question/Edit/trueFalse.vue')
                },
                {
                  path: '/question/edit/gapFilling',
                  component: () =>
                    import('@/views/Question/Edit/gapFilling.vue')
                },
                {
                  path: '/question/edit/shortAnswer',
                  component: () =>
                    import('@/views/Question/Edit/shortAnswer.vue')
                }
              ]
            }
          ]
        },
        {
          path: '/message',
          children: [
            {
              path: '/message/list',
              component: () => import('@/views/Message/MessageList.vue')
            },
            {
              path: '/message/send',
              component: () => import('@/views/Message/MessageSend.vue')
            }
          ]
        },
        {
          path: '/edu',
          children: [
            {
              path: '/edu/college',
              children: [
                {
                  path: '/edu/college/list',
                  component: () => import('@/views/Edu/College/CollegeList.vue')
                },
                {
                  path: '/edu/college/edit',
                  component: () => import('@/views/Edu/College/CollegeEdit.vue')
                }
              ]
            },
            {
              path: '/edu/department',
              children: [
                {
                  path: '/edu/department/list',
                  component: () =>
                    import('@/views/Edu/Department/DepartmentList.vue')
                },
                {
                  path: '/edu/department/edit',
                  component: () =>
                    import('@/views/Edu/Department/DepartmentEdit.vue')
                }
              ]
            },
            {
              path: '/edu/class',
              children: [
                {
                  path: '/edu/class/list',
                  component: () => import('@/views/Edu/Class/ClassList.vue')
                },
                {
                  path: '/edu/class/edit',
                  component: () => import('@/views/Edu/Class/ClassEdit.vue')
                }
              ]
            }
          ]
        }
      ]
    }
  ]
})

export default router
