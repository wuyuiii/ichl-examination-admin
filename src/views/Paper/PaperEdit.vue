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
  score: null
})
const editFormRules: FormRules = {
  paperType: [{ required: true, message: '1', trigger: 'change' }],
  subjectId: [{ required: true, message: '1', trigger: 'change' }],
  paperTitle: [{ required: true, message: '1', trigger: 'change' }],
  suggestTime: [{ required: true, message: '1', trigger: 'change' }],
  edu: [{ required: true, message: '1', trigger: 'change' }],
  titleItems: [{ required: true, message: '1', trigger: 'change' }]
}

const subjectData = ref<SubjectDataType[]>([])
const getPaper = async () => {
  const { data: res } = await getPaperAPI(route.query.id as any)
  if (res.status === 200) {
    editFormData.value = res.data
  }
}
if (route.query.id) {
  getPaper()
}

// 获取学科列表
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
}

// dialog
const dialogVisible = ref(false)
const dialogTable = ref()

// 获取题目
const questionData = ref<QuestionItemType[]>([])
const total = ref(0)
const questionListData = ref<QuestionListType>({
  pageIndex: 1,
  pageSize: 5,
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

// 选择题目
const confirmSelectQuestion = () => {
  editFormData.value.titleItems[titleIndex.value].questionItem.push(
    ...dialogTable.value.getSelectionRows()
  )
  dialogTable.value.clearSelection()
  dialogVisible.value = false
}
</script>

<template>
  <div class="paper-container">
    <el-form
      ref="editFormRef"
      :model="editFormData"
      :rules="editFormRules"
      label-width="9.375rem"
    >
      <el-form-item prop="edu">
        <template #label>
          <div class="edit-form-item-label">学院 / 专业 / 班级 :</div>
        </template>
        <el-cascader
          style="width: 15rem"
          v-model="editFormData.edu"
          :options="options"
          clearable
        />
      </el-form-item>
      <el-form-item label="学科 :" prop="subjectId">
        <el-select
          style="width: 15rem"
          placeholder="请选择学科"
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
      <el-form-item label="试卷类型 :" prop="paperType">
        <el-select
          style="width: 15rem"
          class="paper-search-input"
          v-model="editFormData.paperType"
          placeholder="选择试卷类型"
          clearable
        >
          <el-option :value="1" label="固定试卷" />
          <el-option :value="4" label="时段试卷" />
          <el-option :value="6" label="任务试卷" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="时间限制 :"
        prop="limitDateTime"
        v-show="editFormData.paperType === 4"
      >
        <el-date-picker
          v-model="editFormData.limitDateTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item label="试卷名 :" prop="paperTitle">
        <el-input
          style="width: 15rem"
          class="paper-search-input"
          v-model="editFormData.paperTitle"
          placeholder="输入试卷名"
        />
      </el-form-item>
      <el-form-item
        v-for="(titleItems, titleItemIndex) in editFormData.titleItems"
        :key="titleItemIndex"
        :label="`标题${titleItemIndex + 1}`"
        prop="titleItems"
      >
        <el-input
          v-model="titleItems.name"
          placeholder="请输入标题"
          style="width: 15rem; margin-right: 1rem"
        />
        <el-button type="success" @click="addQuestion(titleItemIndex)"
          >添加题目</el-button
        >
        <el-button
          type="danger"
          @click="editFormData.titleItems.splice(titleItemIndex, 1)"
        >
          删除
        </el-button>
        <el-scrollbar class="paper-title-card-box">
          <el-card
            class="paper-title-card"
            v-for="(questionItem, index) in titleItems.questionItem"
            :key="questionItem.id"
            shadow="never"
          >
            <el-form-item style="display: flex; justify-content: space-around">
              <div class="paper-question-box">
                <div class="paper-question-order">
                  {{ index + 1 }}
                </div>
                <div class="paper-question-content">
                  <span v-html="questionItem.title"></span>
                  <div class="paper-question-content-item">
                    <span
                      class=""
                      v-for="item in questionItem.items"
                      :key="item.prefix"
                    >
                      {{ item.prefix }} . {{ item.content }}
                    </span>
                  </div>
                </div>
                <div class="paper-question-del">
                  <el-button
                    type="danger"
                    @click="titleItems.questionItem.splice(index, 1)"
                    >删除</el-button
                  >
                </div>
              </div>
            </el-form-item>
          </el-card>
        </el-scrollbar>
      </el-form-item>
      <el-form-item label="建议时长(分钟) :" prop="suggestTime">
        <el-input-number
          style="width: 15rem"
          class="paper-search-input"
          v-model="editFormData.suggestTime"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button type="success" @click="addTitle">添加标题</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-dialog v-model="dialogVisible" width="70%" style="padding: 30px">
    <div class="paper-search">
      <el-input
        class="paper-search-input"
        v-model="questionListData.keyword"
        placeholder="输入试卷名查询"
        :prefix-icon="Search"
        @change="getQuestionList"
      />
      <el-select
        class="paper-search-input"
        v-model="questionListData.questionType"
        placeholder="选择题型"
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
        placeholder="选择学科"
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
        label="题型"
        prop="question_name"
        width="100"
      ></el-table-column>
      <el-table-column label="题干">
        <template #default="{ row }">
          <span v-html="row.title"></span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[5, 10, 15]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSelectQuestion">
          确认
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

        .paper-question-box {
          display: flex;
          justify-content: space-around;

          .paper-question-order {
            flex: 1;
            margin-right: 2.5rem;
          }

          .paper-question-content {
            display: flex;
            flex-direction: column;
            align-content: flex-start;
            flex: 20;
            margin-right: 2.5rem;

            .paper-question-content-item {
              padding-left: 1.25rem;

              span {
                margin: 0.25rem 1rem;
              }
            }
          }

          .paper-question-del {
            flex: 1;
            margin-right: 2.5rem;
          }
        }
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
