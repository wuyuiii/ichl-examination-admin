<script lang="ts" setup>
import { ref } from 'vue'
import { createPaperAPI, getPaperAPI, updatePaperAPI } from '@/api/paper'
import { useRoute, useRouter } from 'vue-router'
import { getSubjectListAPI2 } from '@/api/subject'
import type {
  CascaderOptionType,
  PaperDataType,
  QuestionListType,
  SubjectDataType
} from '@/interface'
import { useOptionStore } from '@/stores'
import { getEduOptionAPI } from '@/api/edu'
import { ElMessage } from 'element-plus'
import type { QuestionItemType } from '@/interface'
import { getQuestionListAPI } from '@/api/question'
import { Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus/lib/components'
import ShowQuestion from '@/views/Question/components/ShowQuestion.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()
const editFormRef = ref<FormInstance>()
const editFormData = ref<PaperDataType>({
  id: (route.query.id as any) || null,
  paperType: null,
  subjectId: null,
  paperTitle: '',
  suggestTime: null,
  edu: [],
  limitDateTime: [],
  titleItems: [],
  score: 0
})
const editFormRules: FormRules = {
  paperType: [
    {
      required: true,
      message: t('PAPER.PAPER_TYPE_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ],
  subjectId: [
    {
      required: true,
      message: t('PAPER.SUBJECT_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ],
  paperTitle: [
    {
      required: true,
      message: t('PAPER.PAPER_NAME_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ],
  suggestTime: [
    {
      required: true,
      message: t('PAPER.SUGGEST_TIME_PLACEHOLDER'),
      trigger: ['change', 'blur']
    }
  ],
  edu: [
    {
      required: true,
      message: t('PAPER.EDU_OPTIONS_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ],
  titleItems: [
    {
      required: true,
      message: t('PAPER.ADD_TITLE_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ]
}

const getPaper = async () => {
  const { data: res } = await getPaperAPI(route.query.id as any)
  if (res.status === 200) {
    editFormData.value = res.data
  } else {
    ElMessage.error(res.message)
    const index = optionStore.tagBar.findIndex(
      (item) => item.current === route.fullPath
    )
    router.push(optionStore.tagBar[index].back)
    optionStore.tagBar.splice(index, 1)
  }
}
if (route.query.id) {
  getPaper()
}

// 获取学科列表
const subjectData = ref<SubjectDataType[]>([])
const getSubjectList = async () => {
  const { data: res } = await getSubjectListAPI2()
  if (res.status === 200) {
    subjectData.value = res.data
  }
}
getSubjectList()

// 学院、专业、班级级联选择
const options = ref<CascaderOptionType[]>([])
const getEduOption = async () => {
  const { data: res } = await getEduOptionAPI()
  if (res.status === 200) {
    options.value = res.data
  }
}
getEduOption()

// 添加标题
const addTitle = () => {
  editFormData.value.titleItems.push({
    name: '',
    questionItem: []
  })
}

// 添加题目
const titleIndex = ref(0)
const addQuestion = (index: number) => {
  dialogVisible.value = true
  titleIndex.value = index
  getQuestionList()
}

// 提交
const submit = async () => {
  const r = await editFormRef.value?.validate()
  if (!r) {
    return
  }

  if (editFormData.value.titleItems.length === 0) {
    return ElMessage.warning('请添加标题')
  }
  for (let i = 0; i < editFormData.value.titleItems.length; i++) {
    if (editFormData.value.titleItems[i].name === '') {
      return ElMessage.warning(`请给标题${i + 1}输入标题`)
    }
    if (editFormData.value.titleItems[i].questionItem.length === 0) {
      return ElMessage.warning(`请给标题${i + 1}添加题目`)
    }
  }
  let res = null
  if (!route.query.id) {
    res = await createPaperAPI(editFormData.value)
  } else {
    res = await updatePaperAPI(editFormData.value)
  }
  if (res.data.status === 200) {
    ElMessage({
      type: 'success',
      message: res.data.message
    })
  } else {
    ElMessage({
      type: 'error',
      message: res.data.message
    })
  }
  const index = optionStore.tagBar.findIndex(
    (item) => item.current === route.fullPath
  )
  router.push(optionStore.tagBar[index].back)
  optionStore.tagBar.splice(index, 1)
}

// 重置
const reset = () => {
  editFormRef.value?.resetFields()
  editFormData.value.titleItems = []
}

// dialog
const dialogVisible = ref(false)
const dialogTable = ref()

// 获取题目
const questionData = ref<QuestionItemType[]>([])
const total = ref(0)
const questionListData = ref<QuestionListType>({
  pageIndex: 1,
  pageSize: 10,
  keyword: '',
  subjectId: '',
  questionType: ''
})
const getQuestionList = async () => {
  const { data: res } = await getQuestionListAPI(questionListData.value)
  if (res.status === 200) {
    questionData.value = res.data
    total.value = res.total
  }
}

// 选择题目
const confirmSelectQuestion = () => {
  const selectionQuestion = dialogTable.value.getSelectionRows()
  editFormData.value.titleItems[titleIndex.value].questionItem.push(
    ...selectionQuestion
  )
  for (let i = 0; i < selectionQuestion.length; i++) {
    editFormData.value.score += selectionQuestion[i].score
  }

  dialogTable.value.clearSelection()
  dialogVisible.value = false
}

// 移除题目
const removeQuestion = (item: QuestionItemType[], index: number) => {
  editFormData.value.score <= 0
    ? (editFormData.value.score = 0)
    : (editFormData.value.score -= +item[index].score)
  item.splice(index, 1)
}

// 切换每页条数
const handleSizeChange = (value: number) => {
  questionListData.value.pageSize = value
  getQuestionList()
}

// 切换分页
const handleCurrentChange = (value: number) => {
  questionListData.value.pageIndex = value
  getQuestionList()
}
</script>

<template>
  <div class="paper-container">
    <el-form
      ref="editFormRef"
      :model="editFormData"
      :rules="editFormRules"
      label-width="15rem"
    >
      <el-form-item prop="edu">
        <template #label>
          <div class="edit-form-item-label">
            {{ $t('PAPER.EDU_OPTIONS') }} :
          </div>
        </template>
        <el-cascader
          style="width: 15rem"
          v-model="editFormData.edu"
          :options="options"
          :props="{ checkStrictly: true }"
          clearable
        />
      </el-form-item>
      <el-form-item prop="subjectId">
        <template #label>
          <div class="edit-form-item-label">{{ $t('PAPER.SUBJECT') }} :</div>
        </template>
        <el-select
          style="width: 15rem"
          :placeholder="$t('PAPER.SUBJECT_PLACEHOLDER')"
          clearable
          v-model="editFormData.subjectId"
        >
          <el-option
            v-for="item in subjectData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="paperType">
        <template #label>
          <div class="edit-form-item-label">{{ $t('PAPER.PAPER_TYPE') }} :</div>
        </template>
        <el-select
          style="width: 15rem"
          class="paper-search-input"
          v-model="editFormData.paperType"
          :placeholder="$t('PAPER.PAPER_TYPE_PLACEHOLDER')"
          clearable
        >
          <el-option :value="1" :label="$t('PAPER.PAPER_OPTION_FIXED')" />
          <el-option :value="4" :label="$t('PAPER.PAPER_OPTION_TIME_SLOT')" />
          <el-option :value="6" :label="$t('PAPER.PAPER_OPTION_TASK_EXAM')" />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('PAPER.TIME_LIMIT') + ` :`"
        prop="limitDateTime"
        v-show="editFormData.paperType === 4"
      >
        <el-date-picker
          v-model="editFormData.limitDateTime"
          type="daterange"
          :range-separator="$t('PAPER.TO')"
          :start-placeholder="$t('PAPER.START_TIME')"
          :end-placeholder="$t('PAPER.END_TIME')"
        />
      </el-form-item>
      <el-form-item prop="paperTitle">
        <template #label>
          <div class="edit-form-item-label">{{ $t('PAPER.PAPER_NAME') }} :</div>
        </template>
        <el-input
          style="width: 15rem"
          class="paper-search-input"
          v-model="editFormData.paperTitle"
          :placeholder="$t('PAPER.PAPER_NAME_PLACEHOLDER')"
        />
      </el-form-item>
      <el-form-item
        v-for="(titleItems, titleItemIndex) in editFormData.titleItems"
        :key="titleItemIndex"
        prop="titleItems"
      >
        <template #label>
          <div class="edit-form-item-label">
            {{ $t('PAPER.TITLE') }} {{ titleItemIndex + 1 }} :
          </div>
        </template>
        <el-input
          v-model="titleItems.name"
          :placeholder="$t('PAPER.TITLE_PLACEHOLDER')"
          style="width: 15rem; margin-right: 1rem"
        />
        <el-button type="success" @click="addQuestion(titleItemIndex)">
          {{ $t('PAPER.ADD_QUESTION') }}
        </el-button>
        <el-button
          type="danger"
          @click="editFormData.titleItems.splice(titleItemIndex, 1)"
        >
          {{ $t('PAPER.DELETE') }}
        </el-button>
        <el-scrollbar class="paper-title-card-box">
          <el-card
            class="paper-title-card"
            v-for="(questionItem, index) in titleItems.questionItem"
            :key="questionItem.id"
            shadow="never"
          >
            <el-form-item style="display: flex; justify-content: space-around">
              <ShowQuestion :item="questionItem" :index="index + 1">
                <template #right>
                  <div class="paper-question-del">
                    <el-button
                      type="danger"
                      @click="removeQuestion(titleItems.questionItem, index)"
                    >
                      {{ $t('PAPER.DELETE') }}
                    </el-button>
                  </div>
                </template>
              </ShowQuestion>
            </el-form-item>
          </el-card>
        </el-scrollbar>
      </el-form-item>
      <el-form-item prop="suggestTime">
        <template #label>
          <div class="edit-form-item-label">
            {{ $t('PAPER.SUGGEST_TIME') }} :
          </div>
        </template>
        <el-input-number
          style="width: 15rem"
          class="paper-search-input"
          v-model="editFormData.suggestTime"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">
          {{ $t('PAPER.SUBMIT') }}
        </el-button>
        <el-button @click="reset">{{ $t('PAPER.RESET') }}</el-button>
        <el-button type="success" @click="addTitle">
          {{ $t('PAPER.ADD_TITLE') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-dialog v-model="dialogVisible" width="70%" style="padding: 30px">
    <div class="paper-search">
      <el-input
        class="paper-search-input"
        v-model="questionListData.keyword"
        :placeholder="$t('PAPER.PAPER_NAME_PLACEHOLDER')"
        :prefix-icon="Search"
        @change="getQuestionList"
      />
      <el-select
        class="paper-search-input"
        v-model="questionListData.questionType"
        :placeholder="$t('PAPER.QUESTION_TYPE_PLACEHOLDER')"
        clearable
        @change="getQuestionList"
      >
        <el-option value="1" label="单选题" />
        <el-option value="2" label="多选题" />
        <el-option value="3" label="判断题" />
        <el-option value="4" label="填空题" />
        <el-option value="5" label="简答题" />
      </el-select>
      <el-select
        class="paper-search-input"
        v-model="questionListData.subjectId"
        :placeholder="$t('PAPER.SUBJECT_PLACEHOLDER')"
        clearable
        @change="getQuestionList"
      >
        <el-option
          v-for="item in subjectData"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </el-select>
    </div>
    <el-table
      ref="dialogTable"
      border
      :data="questionData"
      style="width: 100%; margin-bottom: 1.25rem"
    >
      <el-table-column
        label="ID"
        prop="id"
        width="60"
        type="selection"
      ></el-table-column>
      <el-table-column
        :label="$t('PAPER.QUESTION_TYPE')"
        prop="question_name"
        width="150"
      ></el-table-column>
      <el-table-column :label="$t('PAPER.QUESTION_TITLE')">
        <template #default="{ row }">
          <span v-html="row.title"></span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[10, 15, 20]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t('PAPER.CANCEL') }}
        </el-button>
        <el-button type="primary" @click="confirmSelectQuestion">
          {{ $t('PAPER.CONFIRM') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.paper-container {
  &:deep(.el-form-item__content) {
    display: block;

    .paper-title-card-box {
      width: 50rem;
      max-height: 500px;
      margin-top: 0.625rem;

      .paper-title-card {
        width: 100%;
        margin-bottom: 0.625rem;
      }
    }
  }
}

.paper-search {
  display: flex;
  width: 50%;
  margin-bottom: 1.25rem;
  .paper-search-input {
    flex: 1;
    margin-right: 0.875rem;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
