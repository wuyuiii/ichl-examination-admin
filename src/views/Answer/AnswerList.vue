<script lang="ts" setup>
import type {
  GetAnswerListType,
  AnswerListDataType,
  SubjectDataType
} from '@/interface'
import { getAnswerListAPI } from '@/api/answer'
import { formatDate } from '@/utils/format'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getSubjectListAPI2 } from '@/api/subject'
import { useRoute, useRouter } from 'vue-router'
import { useOptionStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()

const total = ref(0)
const answerListParams = ref<GetAnswerListType>({
  pageIndex: 1,
  pageSize: 10,
  keyword: '',
  paperType: null,
  subjectId: null,
  status: null
})

const answerData = ref<AnswerListDataType[]>([])
const getAnswerList = async () => {
  const { data: res } = await getAnswerListAPI(answerListParams.value)
  if (res.status !== 200) {
    return ElMessage.error(res.message)
  }
  answerData.value = res.data
  total.value = res.total
}
getAnswerList()

const subjectData = ref<SubjectDataType[]>([])
// 获取学科列表
const getSubjectList = async () => {
  const { data: res } = await getSubjectListAPI2()
  if (res.status === 200) {
    subjectData.value = res.data
  }
}
getSubjectList()

// 批改
const judge = (row: AnswerListDataType) => {
  const index = optionStore.tagBar.findIndex(
    (item) => item.items.path == `${route.matched[1].path}/edit`
  )
  if (index !== -1) {
    optionStore.tagBar[index].current =
      `${route.matched[1].path}/judge?id=${row.exam_paper_id}`
  }
  router.push({
    path: `${route.matched[1].path}/judge`,
    query: { id: row.exam_paper_id }
  })
}

// 切换每页条数
const handleSizeChange = (value: number) => {
  answerListParams.value.pageSize = value
  getAnswerList()
}

// 切换分页
const handleCurrentChange = (value: number) => {
  answerListParams.value.pageIndex = value
  getAnswerList()
}
</script>

<template>
  <div class="answer-container">
    <div class="answer-search">
      <el-input
        class="answer-search-input"
        v-model="answerListParams.keyword"
        :placeholder="$t('PAPER.PAPER_NAME_PLACEHOLDER')"
        :prefix-icon="Search"
        @change="getAnswerList"
      />
      <el-select
        class="answer-search-input"
        v-model="answerListParams.paperType"
        :placeholder="$t('PAPER.PAPER_TYPE_PLACEHOLDER')"
        clearable
        @change="getAnswerList"
      >
        <el-option value="1" :label="$t('PAPER.PAPER_OPTION_FIXED')" />
        <el-option value="4" :label="$t('PAPER.PAPER_OPTION_TIME_SLOT')" />
        <el-option value="6" :label="$t('PAPER.PAPER_OPTION_TASK_EXAM')" />
      </el-select>
      <el-select
        class="answer-search-input"
        v-model="answerListParams.subjectId"
        :placeholder="$t('PAPER.SUBJECT_PLACEHOLDER')"
        clearable
        @change="getAnswerList"
      >
        <el-option
          v-for="item in subjectData"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </el-select>
      <el-select
        class="answer-search-input"
        v-model="answerListParams.status"
        :placeholder="$t('ANSWER.STATE_PLACEHOLDER')"
        clearable
        @change="getAnswerList"
      >
        <el-option :label="$t('ANSWER.STATE_CORRECT')" :value="1"></el-option>
        <el-option
          :label="$t('ANSWER.STATE_NO_CORRECT')"
          :value="0"
        ></el-option>
      </el-select>
    </div>
    <el-table style="margin-bottom: 1.25rem" border :data="answerData">
      <el-table-column label="ID" prop="id" width="80" />
      <el-table-column :label="$t('PAPER.PAPER_NAME')" prop="paper_name" />
      <el-table-column :label="$t('PAPER.SUBJECT')" prop="subject_id.name" />
      <el-table-column :label="$t('ANSWER.ANSWER_STU')" width="120">
        <template #default="{ row }">
          <el-tag type="primary">{{ row.create_user }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('ANSWER.ANSWER_SCORE')" width="100">
        <template #default="{ row }">
          {{ row.user_score ? row.user_score : 0 }} /
          {{ row.paper_score }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('ANSWER.QUESTION_TRUE_FALSE')" width="100">
        <template #default="{ row }">
          {{ row.question_correct }} / {{ row.question_count }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('ANSWER.TIME')" width="100">
        <template #default="{ row }">
          {{ row.do_time }} {{ $t('ANSWER.MINUTE') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('ANSWER.SUBMIT_TIME')" width="200">
        <template #default="{ row }">
          {{ formatDate(row.create_time, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('ANSWER.STATE')" width="110">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'warning'">
            {{
              row.status
                ? $t('ANSWER.STATE_CORRECT')
                : $t('ANSWER.STATE_NO_CORRECT')
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('ANSWER.OPERATE')" width="100">
        <template #default="{ row }">
          <el-button
            :type="row.status ? 'primary' : 'warning'"
            size="small"
            plain
            @click="judge(row)"
          >
            {{ row.status ? $t('ANSWER.CHECK') : $t('ANSWER.CORRECT') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[10, 20, 30]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.answer-container {
  .answer-search {
    display: flex;
    width: 50%;
    margin-bottom: 1.25rem;
    .answer-search-input {
      flex: 1;
      margin-right: 0.875rem;
    }
  }
}
</style>
