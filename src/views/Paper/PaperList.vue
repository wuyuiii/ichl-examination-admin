<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { paperListType, PaperDataType } from '@/interface'
import type { SubjectDataType } from '@/interface/modules/subject'
import { getPaperListAPI, delPaperAPI } from '@/api/paper'
import { useOptionStore, useUserStore } from '@/stores'
import { formatDate } from '@/utils/format'
import { getSubjectListAPI2 } from '@/api/subject'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const optionStore = useOptionStore()
const userStore = useUserStore()
const subjectData = ref<SubjectDataType[]>([])
const paperData = ref<PaperDataType[]>([])
const total = ref(0)
const loading = ref(false)
const paperListParams = ref<paperListType>({
  id: userStore.userData.id as number, // 用户id
  pageIndex: 1,
  pageSize: 10,
  paperType: '',
  subjectId: '',
  keyword: ''
})

// 获取学科列表
const getSubjectList = async () => {
  const { data: res } = await getSubjectListAPI2()
  if (res.status === 200) {
    subjectData.value = res.data
  }
}
getSubjectList()

// 获取试卷列表
const getPaperList = async () => {
  const { data: res } = await getPaperListAPI(paperListParams.value)
  if (res.status === 200) {
    paperData.value = res.data
    total.value = res.total
  }
}
getPaperList()

// 学科创编
const edit = (row: SubjectDataType) => {
  const index = optionStore.tagBar.findIndex(
    (item) => item.items.path == `${route.matched[1].path}/edit`
  )
  if (index !== -1) {
    optionStore.tagBar[index].current = row.id
      ? `${route.matched[1].path}/edit?id=${row.id}`
      : `${route.matched[1].path}/edit`
  }
  router.push({
    path: `${route.matched[1].path}/edit`,
    query: { id: row.id }
  })
}

// 删除学科
const remove = async (row: SubjectDataType) => {
  ElMessageBox.confirm(
    `${t('PAPER.DELETE_PAPER_CONTENT')}：${row.name}`,
    t('PAPER.DELETE_PAPER_TITLE'),
    {
      type: 'error'
    }
  ).then(async () => {
    const { data: res } = await delPaperAPI(row.id as any)
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: res.message
      })
      getPaperList()
    } else {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}

// 切换每页条数
const handleSizeChange = (value: number) => {
  paperListParams.value.pageSize = value
  getPaperList()
}

// 切换分页
const handleCurrentChange = (value: number) => {
  paperListParams.value.pageIndex = value
  getPaperList()
}
</script>

<template>
  <div class="paperList-container">
    <div class="paperList-search">
      <el-input
        class="paperList-search-input"
        v-model="paperListParams.keyword"
        :placeholder="$t('PAPER.PAPER_NAME_PLACEHOLDER')"
        :prefix-icon="Search"
        @change="getPaperList"
      />
      <el-select
        class="paperList-search-input"
        v-model="paperListParams.paperType"
        :placeholder="$t('PAPER.PAPER_TYPE_PLACEHOLDER')"
        clearable
        @change="getPaperList"
      >
        <el-option value="1" :label="$t('PAPER.PAPER_OPTION_FIXED')" />
        <el-option value="4" :label="$t('PAPER.PAPER_OPTION_TIME_SLOT')" />
        <el-option value="6" :label="$t('PAPER.PAPER_OPTION_TASK_EXAM')" />
      </el-select>
      <el-select
        class="paperList-search-input"
        v-model="paperListParams.subjectId"
        :placeholder="$t('PAPER.SUBJECT_PLACEHOLDER')"
        clearable
        @change="getPaperList"
      >
        <el-option
          v-for="item in subjectData"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </el-select>
      <el-button style="margin-right: 1.25rem" type="primary" @click="edit">
        {{ $t('PAPER.BUTTON') }}
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="paperData"
      style="width: 100%; margin-bottom: 1.875rem"
      border
    >
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="subject_name" :label="$t('PAPER.SUBJECT')" />
      <el-table-column prop="name" :label="$t('PAPER.PAPER_NAME')" />
      <el-table-column :label="$t('PAPER.CREATE_TIME')">
        <template #default="{ row }">
          {{ formatDate(row.create_time, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('PAPER.CREATE_USER')">
        <template #default="{ row }">
          <el-tag type="success">{{ row.create_user }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('PAPER.OPERATE')">
        <template #default="{ row }">
          <el-button type="primary" size="small" plain @click="edit(row)">
            {{ $t('PAPER.EDIT') }}
          </el-button>
          <el-button type="danger" size="small" plain @click="remove(row)">
            {{ $t('PAPER.DELETE') }}
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
.paperList-container {
  .paperList-search {
    display: flex;
    width: 50%;
    margin-bottom: 1.25rem;
    .paperList-search-input {
      flex: 1;
      margin-right: 0.875rem;
    }
  }
}
</style>
