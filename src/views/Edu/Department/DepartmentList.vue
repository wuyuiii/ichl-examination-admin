<script lang="ts" setup>
import { delDepartmentAPI, getDepartmentListAPI } from '@/api/edu'
import type { DepartmentListType, DepartmentType } from '@/interface'
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOptionStore } from '@/stores'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()

const loading = ref(true)
const departmentData = ref<DepartmentType[]>([])
const total = ref(0)
const departmentListParams = ref<DepartmentListType>({
  college_id: '',
  pageIndex: 1,
  pageSize: 10,
  keyword: ''
})
const getDepartmentList = async () => {
  const { data: res } = await getDepartmentListAPI(departmentListParams.value)
  if (res.status === 200) {
    loading.value = false
    departmentData.value = res.data
    total.value = res.total
  }
}
getDepartmentList()

// 学院创编
const edit = (row: DepartmentType) => {
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
const remove = (row: DepartmentType) => {
  ElMessageBox.confirm(`是否删除专业：${row.department_name}`, '删除专业', {
    type: 'error'
  }).then(async () => {
    const { data: res } = await delDepartmentAPI(row.id as number)
    if (res.status === 200) {
      ElMessage.success(res.message)
      getDepartmentList()
    } else {
      ElMessage.error(res.message)
    }
  })
}
// 切换每页条数
const handleSizeChange = (value: number) => {
  departmentListParams.value.pageSize = value
  getDepartmentList()
}

// 切换分页
const handleCurrentChange = (value: number) => {
  departmentListParams.value.pageIndex = value
  getDepartmentList()
}
</script>

<template>
  <div class="department-container">
    <div class="department-search">
      <el-input
        class="department-search-input"
        v-model="departmentListParams.keyword"
        placeholder="输入专业查询"
        clearable
        :prefix-icon="Search"
        @change="getDepartmentList"
      />
      <el-button type="primary" @click="edit">添加</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="departmentData"
      border
      style="width: 100%; margin-bottom: 1.875rem"
    >
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="所属学院" prop="college_name"></el-table-column>
      <el-table-column label="专业名" prop="department_name"></el-table-column>
      <el-table-column label="专业班级数量" prop="class_size"></el-table-column>
      <el-table-column
        label="专业学生数量"
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
.department-container {
  .department-search {
    display: flex;
    width: 20%;
    margin-bottom: 1.25rem;

    .department-search-input {
      flex: 1;
      margin-right: 0.875rem;
    }
  }
}
</style>
