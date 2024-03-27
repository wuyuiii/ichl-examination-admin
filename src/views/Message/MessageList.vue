<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'
import { delMessageAPI, getMessageListAPI } from '@/api/message'
import { useOptionStore } from '@/stores'
import type { MessageListType, MessageDataType } from '@/interface'
import { formatDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()

const optionStore = useOptionStore()
const messageData = ref<MessageDataType[]>([])
const total = ref(0)
const loading = ref(false)
const messageListParams = ref<MessageListType>({
  pageIndex: 1,
  pageSize: 10,
  keyword: ''
})

// 获取消息列表
const getmessageList = async () => {
  const { data: res } = await getMessageListAPI(messageListParams.value)
  if (res.status === 200) {
    messageData.value = res.data
    total.value = res.total
  }
}
getmessageList()

// 消息创编
const edit = () => {
  const index = optionStore.tagBar.findIndex(
    (item) => item.items.path == `${route.matched[1].path}/send`
  )
  if (index !== -1) {
    optionStore.tagBar[index].current = `${route.matched[1].path}/send`
  }
  router.push({
    path: `${route.matched[1].path}/send`
  })
}

// 删除消息
const remove = async (row: MessageDataType) => {
  ElMessageBox.confirm(`是否删除学科：${row.title}`, '删除学科', {
    type: 'error'
  }).then(async () => {
    const { data: res } = await delMessageAPI(row.id as any)
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: res.message
      })
      getmessageList()
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
  messageListParams.value.pageSize = value
  getmessageList()
}

// 切换分页
const handleCurrentChange = (value: number) => {
  messageListParams.value.pageIndex = value
  getmessageList()
}
</script>

<template>
  <div class="messageList-container">
    <div class="messageList-search">
      <el-input
        class="messageList-search-input"
        v-model="messageListParams.keyword"
        placeholder="输入发送人姓名查询"
        :prefix-icon="Search"
        @change="getmessageList"
      ></el-input>
      <el-button type="primary" @click="edit">添加</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="messageData"
      style="width: 100%; margin-bottom: 1.875rem"
      border
    >
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="title" label="消息标题" />
      <el-table-column prop="content" label="消息内容" />
      <el-table-column prop="receive_user_count" label="接收人数" />
      <el-table-column prop="read_count" label="已读人数" />
      <el-table-column label="发送人">
        <template #default="{ row }">
          <el-tag type="success">{{ row.send_real_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="接收人用户名" width="200px">
        <template #default="{ row }">
          <el-scrollbar>
            <el-tag
              style="margin-right: 0.5rem"
              type="primary"
              v-for="(item, index) in row.receive_name_item"
              :key="index"
              >{{ item }}</el-tag
            >
          </el-scrollbar>
        </template>
      </el-table-column>
      <el-table-column label="发送时间">
        <template #default="{ row }">
          {{ formatDate(row.create_time, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="danger" @click="remove(row)" size="small" plain>
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
.messageList-container {
  .messageList-search {
    display: flex;
    width: 20%;
    margin-bottom: 1.25rem;
    .messageList-search-input {
      flex: 1;
      margin-right: 0.875rem;
    }
  }

  &:deep(.el-scrollbar__view) {
    display: flex;
    flex-wrap: nowrap;
  }

  &:deep(.el-scrollbar__bar) {
    bottom: 0;
  }

  &:deep(.el-scrollbar__bar.is-horizontal) {
    height: 0.25rem;
  }
}
</style>
