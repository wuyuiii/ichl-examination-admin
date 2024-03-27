<script lang="ts" setup>
import { delCollegeAPI, getCollegeListAPI } from '@/api/edu'
import type { CollegeListType, CollegeType } from '@/interface'
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOptionStore } from '@/stores'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()

const loading = ref(true)
const collegeData = ref<CollegeType[]>([])
const total = ref(0)
const collegeListParams = ref<CollegeListType>({
  pageIndex: 1,
  pageSize: 10,
  keyword: ''
})

const getCollegeList = async () => {
  const { data: res } = await getCollegeListAPI(collegeListParams.value)
  if (res.status === 200) {
    loading.value = false
    collegeData.value = res.data
    total.value = res.total
  }
}
getCollegeList()

// 学院创编
const edit = (row: CollegeType) => {
  const index = optionStore.tagBar.findIndex(
    (item) => item.items.path == `${route.matched[1].path}/edit`
  )
  if (index !== -1) {
    optionStore.tagBar[index].current = row.id
      ? `${route.matched[2].path}/edit?id=${row.id}`
      : `${route.matched[2].path}/edit`
  }
  router.push({
    path: `${route.matched[2].path}/edit`,
    query: { id: row.id }
  })
}

// 删除
const remove = (row: CollegeType) => {
  ElMessageBox.confirm(`是否删除学院：${row.college_name}`, '删除学院', {
    type: 'error'
  }).then(async () => {
    const { data: res } = await delCollegeAPI(row.id as number)
    if (res.status === 200) {
      ElMessage.success(res.message)
      getCollegeList()
    } else {
      ElMessage.error(res.message)
    }
  })
}

// 切换每页条数
const handleSizeChange = (value: number) => {
  collegeListParams.value.pageSize = value
  getCollegeList()
}

// 切换分页
const handleCurrentChange = (value: number) => {
  collegeListParams.value.pageIndex = value
  getCollegeList()
}
</script>

<template>
  <div class="college-container">
    <div class="college-search">
      <el-input
        class="college-search-input"
        v-model="collegeListParams.keyword"
        placeholder="输入学院查询"
        clearable
        :prefix-icon="Search"
        @change="getCollegeList"
      />
      <el-button type="primary" @click="edit">添加</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="collegeData"
      border
      style="width: 100%; margin-bottom: 1.875rem"
    >
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="学院名" prop="college_name"></el-table-column>
      <el-table-column
        label="学院专业数量"
        prop="department_size"
      ></el-table-column>
      <el-table-column
        label="学院学生数量"
        prop="student_num"
      ></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" plain @click="edit(row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" plain @click="remove(row)">
            删除
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
.college-container {
  .college-search {
    display: flex;
    width: 20%;
    margin-bottom: 1.25rem;
    .college-search-input {
      flex: 1;
      margin-right: 0.875rem;
    }
  }
}
</style>
