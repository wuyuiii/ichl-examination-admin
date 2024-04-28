<script lang="ts" setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { LogDataType, UserLogListType } from '@/interface'
import { getLogListAPI } from '@/api/user'
import { formatDate } from '@/utils/format'
import { ElMessage } from 'element-plus'

const logListData = ref<LogDataType[]>([])
const total = ref(0)
const loading = ref(true)
const logParams = ref<UserLogListType>({
  pageIndex: 1,
  pageSize: 10,
  keyword: ''
})

// 获取日志列表
const getLog = async () => {
  const { data: res } = await getLogListAPI(logParams.value)
  if (res.status === 200) {
    logListData.value = res.data
    total.value = res.total
  } else {
    ElMessage.error(res.message)
  }
  loading.value = false
}
getLog()

// 切换每页条数
const handleSizeChange = (value: number) => {
  logParams.value.pageSize = value
  getLog()
}

// 切换分页
const handleCurrentChange = (value: number) => {
  logParams.value.pageIndex = value
  getLog()
}
</script>

<template>
  <div class="log-container">
    <div class="log-search">
      <el-input
        class="log-search-input"
        v-model="logParams.keyword"
        placeholder="输入真实姓名查询"
        :prefix-icon="Search"
        @change="getLog"
      ></el-input>
    </div>
    <el-table
      v-loading="loading"
      :data="logListData"
      style="width: 100%; margin-bottom: 1.875rem"
      border
    >
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="user_name" label="用户名" width="200" />
      <el-table-column prop="real_name" label="真实姓名" width="100" />
      <el-table-column prop="content" label="操作内容" width="auto" />
      <el-table-column prop="create_time" label="操作时间" width="200">
        <template #default="{ row }">
          {{ formatDate(row.create_time, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[10, 20, 30, 50]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.log-container {
  .log-search {
    display: flex;
    width: 20%;
    margin-bottom: 1.25rem;
    .log-search-input {
      flex: 1;
      margin-right: 0.875rem;
    }
  }
}
</style>
