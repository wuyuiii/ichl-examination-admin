<script lang="ts" setup>
import { getSubjectListAPI2 } from '@/api/subject'
import type { CreateQuestionType, SubjectDataType } from '@/interface'
import { ElMessage } from 'element-plus'
import type {
  FormRules,
  FormInstance
} from 'element-plus/lib/components/index.js'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  createQuestionAPI,
  getQuestionAPI,
  updateQuestionAPI
} from '@/api/question'
import { useOptionStore } from '@/stores'
import RichEditor from '@/components/RichEditor.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()

const editFormData = ref<CreateQuestionType>({
  title: '',
  question_type: route.meta.question_type as number,
  subject_id: '',
  score: null,
  items: [
    { prefix: 'A', content: t('QUESTION.TRUE') },
    { prefix: 'B', content: t('QUESTION.FALSE') }
  ],
  difficult: null,
  correct: ''
})

const getQuestion = async () => {
  const { data: res } = await getQuestionAPI(route.query.id as any)
  if (res.status === 200) {
    editFormData.value = res.data
  } else {
    ElMessage.error(res.message)
  }
}
if (route.query.id) {
  getQuestion()
}

const editFormRules: FormRules = {
  title: [
    {
      required: true,
      message: t('QUESTION.QUESTION_TITLE_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ],
  subject_id: [
    {
      required: true,
      message: t('QUESTION.SUBJECT_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ],
  score: [
    {
      required: true,
      message: t('QUESTION.SCORE_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ],
  items: [
    {
      required: true,
      message: t('QUESTION.ANSWER_OPTIONS_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ],
  difficult: [
    {
      required: true,
      message: t('QUESTION.DIFFICULTY_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ],
  correct: [
    {
      required: true,
      message: t('QUESTION.ANSWER_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ]
}

const editFormRef = ref<FormInstance>()

// 获取学科列表
const subjectData = ref<SubjectDataType[]>([])
const getSubjectList = async () => {
  const { data: res } = await getSubjectListAPI2()
  if (res.status === 200) {
    subjectData.value = res.data
  }
}
getSubjectList()

const submit = () => {
  editFormRef.value?.validate(async (r) => {
    if (r) {
      let str = ''
      for (let i = 0; i < editFormData.value.items.length; i++) {
        if (editFormData.value.items[i].content === '') {
          str += `选项 ${editFormData.value.items[i].prefix} 的内容不能为空  `
        }
      }

      if (str !== '') {
        ElMessage.error(str)
        return
      }
      if (!editFormData.value.difficult) {
        ElMessage.error('请选择题目难度')
        return
      }

      let res = null
      if (!route.query.id) {
        res = await createQuestionAPI(editFormData.value)
      } else {
        res = await updateQuestionAPI(editFormData.value)
      }
      if (res.data.status === 200) {
        ElMessage({
          type: 'success',
          message: res.data.message
        })
        const index = optionStore.tagBar.findIndex(
          (item) => item.current === route.fullPath
        )
        router.push(optionStore.tagBar[index].back)
        optionStore.tagBar.splice(index, 1)
      } else {
        ElMessage({
          type: 'error',
          message: res.data.message
        })
      }
    } else {
      return false
    }
  })
}
const reset = () => {
  editFormRef.value?.resetFields()
}
// 获取富文本框的内容
const getEditorValue = (val: string) => {
  editFormData.value.title = val
}
</script>

<template>
  <div class="questionEdit-container">
    <el-form
      :model="editFormData"
      :rules="editFormRules"
      ref="editFormRef"
      label-width="15rem"
    >
      <el-form-item prop="subject_id">
        <template #label>
          <div class="label">{{ $t('QUESTION.SUBJECT') }} :</div>
        </template>
        <el-select
          style="width: 15rem"
          :placeholder="$t('QUESTION.SUBJECT_PLACEHOLDER')"
          clearable
          v-model="editFormData.subject_id"
        >
          <el-option
            v-for="item in subjectData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="title">
        <template #label>
          <div class="label">{{ $t('QUESTION.QUESTION_TITLE') }} :</div>
        </template>
        <!-- <el-input
          style="width: 15rem"
          v-model="editFormData.title"
          placeholder="请输入题干"
        /> -->
        <RichEditor
          :title="editFormData.title"
          @getEditorValue="getEditorValue"
        />
      </el-form-item>
      <el-form-item
        prop="items"
        v-if="
          editFormData.question_type === 1 ||
          editFormData.question_type === 2 ||
          editFormData.question_type === 3
        "
      >
        <template #label>
          <div class="label">{{ $t('QUESTION.OPTIONS') }} :</div>
        </template>
        <el-form-item
          class="question-item"
          v-for="(item, index) in editFormData.items"
          :key="index"
          prop="items"
        >
          <el-input
            v-model="item.prefix"
            style="width: 40px; margin-right: 1rem"
          />
          <el-input
            v-model="item.content"
            style="width: 400px; margin-right: 1rem"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item prop="correct">
        <template #label>
          <div class="label">{{ $t('QUESTION.STANDART_ANSWER') }} :</div>
        </template>
        <el-radio-group v-model="editFormData.correct">
          <el-radio
            v-for="(item, index) in editFormData.items"
            :key="index"
            :value="item.prefix"
          >
            {{ item.prefix }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="score">
        <template #label>
          <div class="label">{{ $t('QUESTION.SCORE') }} :</div>
        </template>
        <el-input-number style="width: 15rem" v-model="editFormData.score" />
      </el-form-item>
      <el-form-item prop="difficult">
        <template #label>
          <div class="label">{{ $t('QUESTION.DIFFICULTY') }} :</div>
        </template>
        <el-rate v-model="editFormData.difficult" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">
          {{ $t('QUESTION.SUBMIT') }}
        </el-button>
        <el-button @click="reset">
          {{ $t('QUESTION.RESET') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.questionEdit-container {
  &:deep(.el-form-item__content) {
    display: block;
  }
  .question-item {
    margin-bottom: 1.25rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
