<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { delStuLogAPI, getStuLogAPI } from '@/api/user'
import type { UserLogType, UserLogListType } from '@/interface'
import { formatDate } from '@/utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const logData = ref<UserLogType[]>([])
const total = ref<number>(0)
const userLogParams = ref<UserLogListType>({
  id: route.query.id as any,
  pageIndex: 1,
  pageSize: 10
})
const getStuLog = async () => {
  const { data: res } = await getStuLogAPI(userLogParams.value)
  if (res.status === 200) {
    logData.value = res.data
    total.value = res.total
  }
}
getStuLog()

// 删除
const remove = (row: UserLogType) => {
  ElMessageBox.confirm(`是否删除操作日志： ${row.content}`, '删除日志', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { data: res } = await delStuLogAPI(row.id)
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: res.message
      })
      getStuLog()
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
  userLogParams.value.pageSize = value
  getStuLog()
}

// 切换分页
const handleCurrentChange = (value: number) => {
  userLogParams.value.pageIndex = value
  getStuLog()
}
</script>

<template>
  <div class="log-container">
    <el-table
      :data="logData"
      style="width: 100%; margin-bottom: 1.875rem"
      border
    >
      <el-table-column prop="id" label="id" />
      <el-table-column prop="user_id" label="用户ID" />
      <el-table-column prop="user_name" label="用户名" />
      <el-table-column prop="real_name" label="真实姓名" />
      <el-table-column prop="content" label="操作内容" />
      <el-table-column prop="create_time" label="操作时间">
        <template #default="{ row }">
          {{ formatDate(row.create_time, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="danger" @click="remove(row)" size="small"
            >删除</el-button
          >
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

<style lang="scss" scoped></style>
@/interface/modules/api@/interface/modules/user
