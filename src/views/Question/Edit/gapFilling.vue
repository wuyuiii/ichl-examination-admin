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
import { createQuestionAPI } from '@/api/question'
import { useOptionStore } from '@/stores'
import RichEditor from '@/components/RichEditor/RichEditor.vue'

const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()

const editFormData = ref<CreateQuestionType>({
  title: '',
  question_type: route.meta.question_type as number,
  subject_id: '',
  score: null,
  items: [],
  difficult: null,
  correct: []
})

const editFormRules: FormRules = {
  title: [{ required: true, message: '请输入题干', trigger: 'change' }],
  subject_id: [{ required: true, message: '请选择学科', trigger: 'change' }],
  score: [{ required: true, message: '请输入分数', trigger: 'change' }],
  items: [{ required: true, message: '请添加答案选项', trigger: 'change' }],
  difficult: [{ required: true, message: '请选择题目难度', trigger: 'change' }],
  correct: [{ required: true, message: '请添加答案', trigger: 'change' }]
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

      editFormData.value.title = editFormData.value.title.replace(
        /<p[^>]*>|<\/p>/g,
        ''
      )
      let res = null
      if (!route.query.id) {
        res = await createQuestionAPI(editFormData.value)
      } else {
        res = {
          status: 1,
          data: {}
        }
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

// 处理填空答案
const handleCorrect = (correct: string) => {
  ;(editFormData.value.correct as Array<string>).push(correct)
}
</script>

<template>
  <div class="questionEdit-container">
    <el-form
      :model="editFormData"
      :rules="editFormRules"
      ref="editFormRef"
      label-width="8.75rem"
    >
      <el-form-item label="学科 :" prop="subject_id">
        <el-select
          style="width: 15rem"
          placeholder="请选择学科"
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
      <el-form-item label="题干 :" prop="title">
        <RichEditor :form="editFormData"></RichEditor>
      </el-form-item>
      <el-form-item label="参考答案 :" prop="correct">
        <el-form-item
          class="question-item"
          v-for="(item, index) in editFormData.items"
          :key="index"
          prop="items"
        >
          <span style="padding: 0 1rem; margin-right: 1rem">{{
            item.prefix
          }}</span>
          <el-input
            v-model="item.content"
            style="width: 400px; margin-right: 1rem"
            @change="handleCorrect(item.content)"
          />
          <!-- <el-button type="danger" @click="editFormData.items.splice(index, 1)">
            删除
          </el-button> -->
        </el-form-item>
      </el-form-item>
      <el-form-item label="分数 :" prop="score">
        <el-input-number style="width: 15rem" v-model="editFormData.score" />
      </el-form-item>
      <el-form-item label="难度 :" prop="difficult">
        <el-rate v-model="editFormData.difficult" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="reset">重置</el-button>
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
  }
}
</style>
