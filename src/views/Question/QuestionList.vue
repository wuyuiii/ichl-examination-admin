<script lang="ts" setup>
import {
  delQuestionAPI,
  getQuestionListAPI,
  mergeQuestionAPI,
  uploadQuestionAPI
} from '@/api/question'
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
import {
  handleChunkSuccessRemovesessionStorage,
  handleFileChunk
} from '@/utils/fileChunk'
import * as ExcelJS from 'exceljs'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
  ElMessageBox.confirm(
    `${t('QUESTION.DELETE_QUESTION_CONTENT')}：${row.title}`,
    t('QUESTION.DELETE_QUESTION_TITLE'),
    {
      type: 'error',
      dangerouslyUseHTMLString: true
    }
  ).then(async () => {
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

// 文件导入
const choiceFileInputRef = ref()
const openChoiceFile = () => {
  choiceFileInputRef.value.click()
}
const handleBeforeUpload = async (e: any) => {
  // 文件上传之前
  const file: File = e.target.files[0]
  const fileLastName = file.name.split('.')
  if (
    fileLastName[fileLastName.length - 1] === 'xlsx' ||
    fileLastName[fileLastName.length - 1] === 'xls'
  ) {
    if (file.name.length > 256) {
      return ElMessage.error('文件名过长,请修改后重新上传')
    }
    const chunkResult = await handleFileChunk(file) // 分片结果
    if (!chunkResult) {
      // 分片失败，停止上传并弹出错误
      ElMessage.error('文件分片时发生未知错误')
      return false
    }
    const [chunks] = chunkResult

    // 遍历分片信息数组，将数组中除了分片外的信息暂存到sessionStorage
    const sessionChunkList = (chunks as []).map(({ md5, index }) => {
      return { md5, index }
    })
    sessionStorage.setItem('chunkInfoData', JSON.stringify(sessionChunkList))
    let i = 0
    let wrongCount = 0 // 统计上传分片后发生的错误数量
    while (i < (chunks as []).length && wrongCount < 1) {
      // 对分片数组进行遍历,添加到FormData，通过FormData形式发送给服务器
      const formData = new FormData()
      formData.append('chunkFileBolb', (chunks as any)[i].chunk)
      formData.append('chunkFileMD5', (chunks as any)[i].md5)
      formData.append('chunkFileIndex', (chunks as any)[i].index)
      const { data: res } = await uploadQuestionAPI(formData)
      if (res.status === 200) {
        // 上传分片成功后，删除存储在浏览器中对应的分片信息
        handleChunkSuccessRemovesessionStorage(
          'chunkInfoData',
          (chunks as any)[i].index
        )
        i++ // 当前分片处理结束 i++ 进行下一个分片
      } else {
        // 如果上传失败，再次对当前分片进行上传
        wrongCount++
        const { data: res } = await uploadQuestionAPI(formData)
        if (res.status === 200) {
          handleChunkSuccessRemovesessionStorage(
            'chunkInfoData',
            (chunks as any)[i].index
          )
          wrongCount = 0
          i++
        } else {
          // 再次上传分片文件出错,则停止上传 return false
          ElMessage.error(res.message)
          break
        }
      }
    }
    e.target.value = '' // 清空 防止同一个文件再次上传无反应
    // 无论分片全部上传成功还是失败都调用合并接口,对分片进行合并,只是当有分片上传失败后服务器会删除之前上传的分片文件
    const { data: mergeRes } = await mergeQuestionAPI(wrongCount)
    if (mergeRes.status === 200) {
      getQuestionList()
      return ElMessage.success(mergeRes.message)
    } else {
      return ElMessage.error(mergeRes.message)
    }
  }

  return ElMessage.error('请上传 .xlsx或.xls文件')
}

// 模板导出
const fileDownload = async () => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1')
  worksheet.columns = [
    { header: '标题', key: 'title' },
    { header: '题目类型', key: 'question_type' },
    { header: '学科ID', key: 'subject_id' },
    { header: '题目分数', key: 'score' },
    { header: '难度', key: 'difficult' },
    { header: '答案', key: 'correct' },
    { header: '题目选项', key: 'items' }
  ]
  const data = [
    {
      title: '题目标题模板',
      question_type: 1,
      subject_id: 1,
      score: 3,
      difficult: 3,
      correct: 'A',
      items: [
        { prefix: 'A', content: 'A 模板' },
        { prefix: 'B', content: 'B 模板' },
        { prefix: 'C', content: 'C 模板' },
        { prefix: 'D', content: 'D 模板' }
      ]
    }
  ]
  data.forEach((item) => {
    worksheet.addRow(item)
  })
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = '题目导入模板.xlsx'
  a.click()
  ElMessage.success('下载成功')
}
</script>

<template>
  <div class="questionList-container">
    <div class="questionList-search">
      <el-input
        class="questionList-search-input"
        v-model="questionListData.keyword"
        :placeholder="$t('QUESTION.QUESTION_NAME_PLACEHOLDER')"
        :prefix-icon="Search"
        @change="getQuestionList"
      />
      <el-select
        class="questionList-search-input"
        v-model="questionListData.questionType"
        :placeholder="$t('QUESTION.QUESTION_TYPE_PLACEHOLDER')"
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
        :placeholder="$t('QUESTION.SUBJECT_PLACEHOLDER')"
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
      <!-- <el-upload
        action=""
        class="question-upload"
        accept=".xlsx,.xls"
        :http-request="handleBeforeUpload"
        :show-file-list="false"
        :auto-upload="false"
        ref="uploadExcel"
      >
        导入
      </el-upload> -->
      <el-popover placement="bottom" popper-class="popover" trigger="click">
        <template #reference>
          <el-button type="success">
            {{ $t('QUESTION.TEMPLATE_OPTIONS') }}
          </el-button>
        </template>
        <div class="upload-box">
          <el-button
            type="primary"
            @click="fileDownload"
            style="margin-right: 1rem"
          >
            {{ $t('QUESTION.EXPORT') }}
          </el-button>
          <div class="upload-input-box">
            <input
              class="upload-input"
              type="file"
              ref="choiceFileInputRef"
              accept=".xlsx,.xls"
              @change="handleBeforeUpload"
            />
            <el-button type="success" @click="openChoiceFile">
              {{ $t('QUESTION.IMPORT') }}
            </el-button>
          </div>
        </div>
      </el-popover>
    </div>
    <el-table
      ref="dialogTable"
      border
      :data="questionData"
      style="width: 100%; margin-bottom: 1.25rem"
    >
      <el-table-column label="ID" prop="id" width="60"></el-table-column>
      <el-table-column
        :label="$t('QUESTION.QUESTION_TYPE')"
        prop="question_name"
        width="130"
      ></el-table-column>
      <el-table-column :label="$t('QUESTION.QUESTION_TITLE')">
        <template #default="{ row }">
          <span v-html="row.title"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="difficult"
        :label="$t('QUESTION.DIFFICULTY')"
        width="90"
      />
      <el-table-column prop="score" :label="$t('QUESTION.SCORE')" width="70" />
      <el-table-column :label="$t('QUESTION.CREATE_TIME')" width="180">
        <template #default="{ row }">
          {{ formatDate(row.create_time, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('QUESTION.CREATE_USER')" width="120">
        <template #default="{ row }">
          <el-tag type="success">{{ row.create_user }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('QUESTION.OPERATE')" width="240">
        <template #default="{ row }">
          <el-button size="small" plain type="info" @click="show(row)">
            {{ $t('QUESTION.PREVIEW') }}
          </el-button>
          <el-button size="small" plain type="primary" @click="edit(row)">
            {{ $t('QUESTION.EDIT') }}
          </el-button>
          <el-button size="small" plain type="danger" @click="remove(row)">
            {{ $t('QUESTION.DELETE') }}
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

.upload-box {
  display: flex;
  justify-content: space-around;
  align-items: center;

  .upload-input-box {
    position: relative;

    .upload-input {
      position: absolute;
      display: none;
    }
  }
}

:global(.popover) {
  width: auto !important;
}
</style>
