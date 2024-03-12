import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/Login/Index.vue') },
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/layout/Index.vue'),
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/Index.vue')
        },
        {
          path: '/user',
          meta: { title: '用户管理' },
          children: [
            {
              path: '/user/student',
              redirect: '/user/student/list',
              children: [
                {
                  path: '/user/student/list',
                  meta: { title: '学生列表', role: 1 },
                  component: () => import('@/views/User/userList.vue')
                },
                {
                  path: '/user/student/edit',
                  meta: { title: '学生创编', role: 1 },
                  component: () => import('@/views/User/userEdit.vue')
                },
                {
                  path: '/user/student/log',
                  meta: { title: '学生操作日志', role: 1 },
                  component: () => import('@/views/User/userLog.vue')
                }
              ]
            },
            {
              path: '/user/teacher',
              redirect: '/user/teacher/list',
              children: [
                {
                  path: '/user/teacher/list',
                  meta: { title: '教师列表', role: 2 },
                  component: () => import('@/views/User/userList.vue')
                },
                {
                  path: '/user/teacher/edit',
                  meta: { title: '教师创编', role: 2 },
                  component: () => import('@/views/User/userEdit.vue')
                }
              ]
            },
            {
              path: '/user/admin',
              redirect: '/user/admin/list',
              children: [
                {
                  path: '/user/admin/list',
                  meta: { title: '管理员列表', role: 3 },
                  component: () => import('@/views/User/userList.vue')
                },
                {
                  path: '/user/admin/edit',
                  meta: { title: '管理员创编', role: 3 },
                  component: () => import('@/views/User/userEdit.vue')
                }
              ]
            }
          ]
        },
        {
          path: '/subject',
          meta: { title: '学科管理' },
          children: [
            {
              path: '/subject/list',
              meta: { title: '学科列表' },
              component: () => import('@/views/Subject/SubjectList.vue')
            },
            {
              path: '/subject/edit',
              meta: { title: '学科创编' },
              component: () => import('@/views/Subject/SubjectEdit.vue')
            }
          ]
        },
        {
          path: '/paper',
          meta: { title: '卷库管理' },
          children: [
            {
              path: '/paper/list',
              meta: { title: '卷库列表' },
              component: () => import('@/views/Paper/PaperList.vue')
            },
            {
              path: '/paper/edit',
              meta: { title: '卷库创编' },
              component: () => import('@/views/Paper/PaperEdit.vue')
            }
          ]
        },
        {
          path: '/question',
          meta: { title: '题库管理' },
          children: [
            {
              path: '/question/list',
              meta: { title: '题库列表' },
              component: () => import('@/views/Question/QuestionList.vue')
            },
            {
              path: '/question/edit',
              children: [
                {
                  path: '/question/edit/singleChoice',
                  meta: { title: '单选题创编' },
                  component: () =>
                    import('@/views/Question/Edit/singleChoice.vue')
                },
                {
                  path: '/question/edit/multipleChoice',
                  meta: { title: '多选题创编' },
                  component: () =>
                    import('@/views/Question/Edit/multipleChoice.vue')
                },
                {
                  path: '/question/edit/trueFalse',
                  meta: { title: '判断题创编' },
                  component: () => import('@/views/Question/Edit/trueFalse.vue')
                },
                {
                  path: '/question/edit/gapFilling',
                  meta: { title: '填空题创编' },
                  component: () =>
                    import('@/views/Question/Edit/gapFilling.vue')
                },
                {
                  path: '/question/edit/shortAnswer',
                  meta: { title: '简答题创编' },
                  component: () =>
                    import('@/views/Question/Edit/shortAnswer.vue')
                }
              ]
            }
          ]
        },
        {
          path: '/message',
          meta: { title: '消息管理' },
          children: [
            {
              path: '/message/list',
              meta: { title: '消息列表' },
              component: () => import('@/views/Message/MessageList.vue')
            },
            {
              path: '/message/send',
              meta: { title: '消息发送' },
              component: () => import('@/views/Message/MessageSend.vue')
            }
          ]
        },
        {
          path: '/edu',
          meta: { title: '教务管理' },
          children: [
            {
              path: '/edu/college',
              children: [
                {
                  path: '/edu/college/list',
                  meta: { title: '学院列表' },
                  component: () => import('@/views/Edu/College/CollegeList.vue')
                },
                {
                  path: '/edu/college/edit',
                  meta: { title: '学院编辑' },
                  component: () => import('@/views/Edu/College/CollegeEdit.vue')
                }
              ]
            },
            {
              path: '/edu/department',
              children: [
                {
                  path: '/edu/department/list',
                  meta: { title: '专业列表' },
                  component: () =>
                    import('@/views/Edu/Department/DepartmentList.vue')
                },
                {
                  path: '/edu/department/edit',
                  meta: { title: '专业编辑' },
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
                  meta: { title: '班级列表' },
                  component: () => import('@/views/Edu/Class/ClassList.vue')
                },
                {
                  path: '/edu/class/edit',
                  meta: { title: '班级编辑' },
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
