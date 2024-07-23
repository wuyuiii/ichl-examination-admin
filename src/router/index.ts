import { createRouter, createWebHistory } from 'vue-router'
import i18n, { getCurrLang } from '@/i18n/index'
const { t, locale } = i18n.global
const currnetLanguage = getCurrLang()

locale.value = currnetLanguage // 设置语言类型

export const constantRouterMap = [
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
        meta: { title: t('MENU.USER.USER_MANAGE') },
        children: [
          {
            path: '/user/student',
            redirect: '/user/student/list',
            children: [
              {
                path: '/user/student/list',
                meta: { title: t('MENU.USER.STUDENT_LIST'), role: 1 },
                component: () => import('@/views/User/userList.vue')
              },
              {
                path: '/user/student/edit',
                meta: { title: t('MENU.USER.STUDENT_CREATE'), role: 1 },
                component: () => import('@/views/User/userEdit.vue')
              },
              {
                path: '/user/student/log',
                meta: { title: t('MENU.USER.STUDENT_LOG'), role: 1 },
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
                meta: { title: t('MENU.USER.TEACHER_LIST'), role: 2 },
                component: () => import('@/views/User/userList.vue')
              },
              {
                path: '/user/teacher/edit',
                meta: { title: t('MENU.USER.TEACHER_CREATE'), role: 2 },
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
                meta: { title: t('MENU.USER.ADMIN_LIST'), role: 3 },
                component: () => import('@/views/User/userList.vue')
              },
              {
                path: '/user/admin/edit',
                meta: { title: t('MENU.USER.ADMIN_CREATE'), role: 3 },
                component: () => import('@/views/User/userEdit.vue')
              }
            ]
          }
        ]
      },
      {
        path: '/subject',
        meta: { title: t('MENU.SUBJECT.SUBJECT_MANAGE') },
        children: [
          {
            path: '/subject/list',
            meta: { title: t('MENU.SUBJECT.SUBJECT_LIST') },
            component: () => import('@/views/Subject/SubjectList.vue')
          },
          {
            path: '/subject/edit',
            meta: { title: t('MENU.SUBJECT.SUBJECT_CREATE') },
            component: () => import('@/views/Subject/SubjectEdit.vue')
          }
        ]
      },
      {
        path: '/paper',
        meta: { title: t('MENU.PAPER.PAPER_MANAGE') },
        children: [
          {
            path: '/paper/list',
            meta: { title: t('MENU.PAPER.PAPER_LIST') },
            component: () => import('@/views/Paper/PaperList.vue')
          },
          {
            path: '/paper/edit',
            meta: { title: t('MENU.PAPER.PAPER_CREATE') },
            component: () => import('@/views/Paper/PaperEdit.vue')
          }
        ]
      },
      {
        path: '/question',
        meta: { title: t('MENU.QUESTION.QUESTION_MANAGE') },
        children: [
          {
            path: '/question/list',
            meta: { title: t('MENU.QUESTION.QUESTION_LIST') },
            component: () => import('@/views/Question/QuestionList.vue')
          },
          {
            path: '/question/edit',
            children: [
              {
                path: '/question/edit/singleChoice',
                meta: {
                  title: t('MENU.QUESTION.SINGLE_CHOICE_CREATE'),
                  question_type: 1
                },
                component: () =>
                  import('@/views/Question/Edit/singleChoice.vue')
              },
              {
                path: '/question/edit/multipleChoice',
                meta: {
                  title: t('MENU.QUESTION.MULTIPLE_CHOICE_CREATE'),
                  question_type: 2
                },
                component: () =>
                  import('@/views/Question/Edit/multipleChoice.vue')
              },
              {
                path: '/question/edit/trueFalse',
                meta: {
                  title: t('MENU.QUESTION.TRUE_FALSE_CREATE'),
                  question_type: 3
                },
                component: () => import('@/views/Question/Edit/trueFalse.vue')
              },
              {
                path: '/question/edit/gapFilling',
                meta: {
                  title: t('MENU.QUESTION.GAP_FILLING_CREATE'),
                  question_type: 4
                },
                component: () => import('@/views/Question/Edit/gapFilling.vue')
              },
              {
                path: '/question/edit/shortAnswer',
                meta: {
                  title: t('MENU.QUESTION.SHORT_ANSWER_CREATE'),
                  question_type: 5
                },
                component: () => import('@/views/Question/Edit/shortAnswer.vue')
              }
            ]
          }
        ]
      },
      {
        path: '/message',
        meta: { title: t('MENU.MESSAGE.MESSAGE_MANAGE') },
        children: [
          {
            path: '/message/list',
            meta: { title: t('MENU.MESSAGE.MESSAGE_LIST') },
            component: () => import('@/views/Message/MessageList.vue')
          },
          {
            path: '/message/send',
            meta: { title: t('MENU.MESSAGE.MESSAGE_SEND') },
            component: () => import('@/views/Message/MessageSend.vue')
          }
        ]
      },
      {
        path: '/edu',
        meta: { title: t('MENU.EDU.EDU_MANAGE') },
        children: [
          {
            path: '/edu/college',
            children: [
              {
                path: '/edu/college/list',
                meta: { title: t('MENU.EDU.COLLEGE_LIST') },
                component: () => import('@/views/Edu/College/CollegeList.vue')
              },
              {
                path: '/edu/college/edit',
                meta: { title: t('MENU.EDU.COLLEGE_CREATE') },
                component: () => import('@/views/Edu/College/CollegeEdit.vue')
              }
            ]
          },
          {
            path: '/edu/department',
            children: [
              {
                path: '/edu/department/list',
                meta: { title: t('MENU.EDU.DEPARTMENT_LIST') },
                component: () =>
                  import('@/views/Edu/Department/DepartmentList.vue')
              },
              {
                path: '/edu/department/edit',
                meta: { title: t('MENU.EDU.DEPARTMENT_CREATE') },
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
                meta: { title: t('MENU.EDU.CLASS_LIST') },
                component: () => import('@/views/Edu/Class/ClassList.vue')
              },
              {
                path: '/edu/class/edit',
                meta: { title: t('MENU.EDU.CLASS_CREATE') },
                component: () => import('@/views/Edu/Class/ClassEdit.vue')
              }
            ]
          }
        ]
      },
      {
        path: '/answer',
        meta: { title: t('MENU.ANSWER.ANSWER_MANAGE') },
        children: [
          {
            path: '/answer/list',
            meta: { title: t('MENU.ANSWER.ANSWER_LIST') },
            component: () => import('@/views/Answer/AnswerList.vue')
          },
          {
            path: '/answer/judge',
            meta: { title: t('MENU.ANSWER.ANSWER_CORRECT') },
            component: () => import('@/views/Answer/AnswerJudge.vue')
          }
        ]
      },
      {
        path: '/log',
        meta: { title: t('MENU.LOG.LOG_MANAGE') },
        children: [
          {
            path: '/log/list',
            meta: { title: t('MENU.LOG.USER_LOG_LIST') },
            component: () => import('@/views/Log/LogList.vue')
          }
        ]
      },
      {
        path: '/center',
        meta: { title: t('MENU.CENTER.CENTER_MANAGE') },
        component: () => import('@/views/Center/PersonalCenter.vue')
      },
      {
        path: '/video',
        meta: { title: t('MENU.VIDEO.VIDEO_MANAGE') },
        children: [
          {
            path: '/video/list',
            meta: { title: t('MENU.VIDEO.VIDEO_LIST') },
            component: () => import('@/views/Video/VideoList.vue')
          },
          {
            path: '/video/edit',
            meta: { title: t('MENU.VIDEO.VIDEO_CREATE') },
            component: () => import('@/views/Video/VideoEdit.vue')
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRouterMap
})

export default router
