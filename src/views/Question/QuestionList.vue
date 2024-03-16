<script lang="ts" setup>
import { getQuestionListAPI } from '@/api/question'
import { getSubjectListAPI2 } from '@/api/subject'
import type {
  QuestionItemType,
  QuestionListType,
  SubjectDataType
} from '@/interface'
import { formatDate } from '@/utils/format'
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'

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
</script>

<template>
  <div class="questionList-container">
    <div class="questionList-search">
      <el-input
        class="questionList-search-input"
        v-model="questionListData.keyword"
        placeholder="输入试卷名查询"
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
        <template #default>
          <el-button size="small" plain type="info">预览</el-button>
          <el-button size="small" plain type="primary">编辑</el-button>
          <el-button size="small" plain type="danger">删除</el-button>
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
