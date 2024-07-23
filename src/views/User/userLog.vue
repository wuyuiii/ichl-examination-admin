<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { delStuLogAPI, getLogListAPI } from '@/api/user'
import type { UserLogType, UserLogListType } from '@/interface'
import { formatDate } from '@/utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const route = useRoute()
const logData = ref<UserLogType[]>([])
const total = ref<number>(0)
const userLogParams = ref<UserLogListType>({
  id: route.query.id as any,
  pageIndex: 1,
  pageSize: 10
})
const getStuLog = async () => {
  const { data: res } = await getLogListAPI(userLogParams.value)
  if (res.status === 200) {
    logData.value = res.data
    total.value = res.total
  }
}
getStuLog()

// 删除
const remove = (row: UserLogType) => {
  ElMessageBox.confirm(
    `${t('USER_MANAGE.DELETE_LOG_CONTENT')}： ${row.content}`,
    t('USER_MANAGE.DELETE_LOG_TITLE'),
    {
      type: 'warning'
    }
  ).then(async () => {
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
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="user_id" :label="$t('USER_MANAGE.USER_ID')" />
      <el-table-column prop="user_name" :label="$t('USER_MANAGE.USER_NAME')" />
      <el-table-column prop="real_name" :label="$t('USER_MANAGE.REAL_NAME')" />
      <el-table-column
        prop="content"
        :label="$t('USER_MANAGE.OPERATE_VALUE')"
      />
      <el-table-column
        prop="create_time"
        :label="$t('USER_MANAGE.OPERATE_TIME')"
      >
        <template #default="{ row }">
          {{ formatDate(row.create_time, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('USER_MANAGE.OPERATE')">
        <template #default="{ row }">
          <el-button type="danger" @click="remove(row)" size="small">
            {{ $t('USER_MANAGE.DELETE') }}
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

<style lang="scss" scoped></style>
@/interface/modules/api@/interface/modules/user
