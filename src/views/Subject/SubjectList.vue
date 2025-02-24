<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { SubjectListType } from '@/interface'
import type { SubjectDataType } from '@/interface/modules/subject'
import { delSubjectAPI, getSubjectListAPI } from '@/api/subject'
import { useOptionStore } from '@/stores'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()

const optionStore = useOptionStore()
const subjectData = ref<SubjectDataType[]>([])
const total = ref(0)
const loading = ref(true)
const subjectListParams = ref<SubjectListType>({
  pageIndex: 1,
  pageSize: 10,
  keyword: ''
})

// 获取学科列表
const getSubjectList = async () => {
  const { data: res } = await getSubjectListAPI(subjectListParams.value)
  if (res.status === 200) {
    loading.value = false
    subjectData.value = res.data
    total.value = res.total
  }
}
getSubjectList()

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
    `${t('SUBJECT.DELETE_SUBJECT_CONTENT')}：${row.name}`,
    t('SUBJECT.DELETE_SUBJECT_TITLE'),
    {
      type: 'error'
    }
  ).then(async () => {
    const { data: res } = await delSubjectAPI(row.id as any)
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: res.message
      })
      getSubjectList()
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
  subjectListParams.value.pageSize = value
  getSubjectList()
}

// 切换分页
const handleCurrentChange = (value: number) => {
  subjectListParams.value.pageIndex = value
  getSubjectList()
}
</script>

<template>
  <div class="subjectList-container">
    <div class="subjectList-search">
      <el-input
        class="subjectList-search-input"
        v-model="subjectListParams.keyword"
        :placeholder="$t('SUBJECT.PLACEHOLDER')"
        :prefix-icon="Search"
        @change="getSubjectList"
      ></el-input>
      <el-button type="primary" @click="edit">
        {{ $t('SUBJECT.BUTTON') }}
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="subjectData"
      style="width: 100%; margin-bottom: 1.875rem"
      border
    >
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" :label="$t('SUBJECT.SUBJECT')" />
      <el-table-column :label="$t('SUBJECT.OPERATE')">
        <template #default="{ row }">
          <el-button type="primary" size="small" plain @click="edit(row)">
            {{ $t('SUBJECT.EDIT') }}
          </el-button>
          <el-button type="danger" size="small" plain @click="remove(row)">
            {{ $t('SUBJECT.DELETE') }}
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
.subjectList-container {
  .subjectList-search {
    display: flex;
    width: 20%;
    margin-bottom: 1.25rem;
    .subjectList-search-input {
      flex: 1;
      margin-right: 0.875rem;
    }
  }
}
</style>
