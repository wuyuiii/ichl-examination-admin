<script lang="ts" setup>
import { delQuestionAPI, getQuestionListAPI } from '@/api/question'
import { getSubjectListAPI2 } from '@/api/subject'
import type {
  QuestionItemType,
  QuestionListType,
  SubjectDataType
} from '@/interface'
import { formatDate } from '@/utils/format'
import { Search } from '@element-plus/icons-vue'
import { ref, nextTick } from 'vue'
import ShowQuestion from './components/ShowQuestion.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useOptionStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()

const subjectData = ref<SubjectDataType[]>([])
// 获取学科列表
const getSubjectList = async () => {
  const { data: res } = await getSubjectListAPI2()
  if (res.status === 200) {
    subjectData.value = res.data
  }
}
getSubjectList()

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
getQuestionList()

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

const showQues = ref()
const show = (row: QuestionItemType) => {
  dialogVisible.value = true
  nextTick(() => {
    showQues.value.questionItem = row
  })
}
const edit = (row: QuestionItemType) => {
  console.log(route.matched)
  let questionType = ''
  switch (row.question_type) {
    case 1:
      questionType = 'singleChoice'
      break
    case 2:
      questionType = 'multipleChoice'
      break
    case 3:
      questionType = 'trueFalse'
      break
    case 4:
      questionType = 'gapFilling'
      break
    case 5:
      questionType = 'shortAnswer'
      break
  }
  const index = optionStore.tagBar.findIndex(
    (item) => item.items.path == `${route.matched[1].path}/edit/${questionType}`
  )
  if (index !== -1) {
    optionStore.tagBar[index].current = row.id
      ? `${route.matched[1].path}/edit/${questionType}?id=${row.id}`
      : `${route.matched[1].path}/edit/${questionType}`
  }
  router.push({
    path: `${route.matched[1].path}/edit/${questionType}`,
    query: { id: row.id }
  })
}
const remove = (row: QuestionItemType) => {
  ElMessageBox.confirm(`是否删除题目：${row.title}`, '删除题目', {
    type: 'error',
    dangerouslyUseHTMLString: true
  }).then(async () => {
    const { data: res } = await delQuestionAPI(row.id as any)
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: res.message
      })
      getQuestionList()
    } else {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}

// dialog
const dialogVisible = ref(false)
</script>

<template>
  <div class="questionList-container">
    <div class="questionList-search">
      <el-input
        class="questionList-search-input"
        v-model="questionListData.keyword"
        placeholder="输入题目名查询"
        :prefix-icon="Search"
        @change="getQuestionList"
      />
      <el-select
        class="questionList-search-input"
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
        class="questionList-search-input"
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
      <el-table-column label="ID" prop="id" width="60"></el-table-column>
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
      <el-table-column prop="difficult" label="难度" width="60" />
      <el-table-column prop="score" label="分数" width="60" />
      <el-table-column label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.create_time, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="90">
        <template #default="{ row }">
          <el-tag type="success">{{ row.create_user }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" plain type="info" @click="show(row)">
            预览
          </el-button>
          <el-button size="small" plain type="primary" @click="edit(row)">
            编辑
          </el-button>
          <el-button size="small" plain type="danger" @click="remove(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[20, 30, 40, 50]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <el-dialog v-model="dialogVisible" width="40%" style="padding: 30px">
    <ShowQuestion ref="showQues" />
  </el-dialog>
</template>

<style lang="scss" scoped>
.questionList-search {
  display: flex;
  width: 50%;
  margin-bottom: 1.25rem;

  .questionList-search-input {
    flex: 1;
    margin-right: 0.875rem;
  }
}
</style>
