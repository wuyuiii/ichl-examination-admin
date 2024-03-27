<script lang="ts" setup>
import { ref, watch } from 'vue'
import { formatGender, formatDate } from '@/utils/format'
import type { UserListType, StuListType } from '@/interface'
import { Search } from '@element-plus/icons-vue'
import { getUserListAPI, delStuAPI, updateUserStateAPI } from '@/api/user'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useOptionStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()
const loading = ref(true)
const tableData = ref<StuListType[]>([])
const total = ref(0)
watch(route, () => {
  userListParams.value.role = route.meta.role as number
  getUserList()
})
const userListParams = ref<UserListType>({
  pageIndex: 1,
  pageSize: 10,
  role: route.meta.role as number,
  real_name: ''
})

// 获取用户列表
const getUserList = async () => {
  const { data: res } = await getUserListAPI(userListParams.value)
  if (res.status === 200) {
    loading.value = false
    tableData.value = res.data
    total.value = res.total
  }
}
getUserList()

// 编辑
const edit = (row: StuListType) => {
  const index = optionStore.tagBar.findIndex(
    (item) => item.items.path == `${route.matched[2].path}/edit`
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

// 查看学生操作日志
const checkLog = (row: StuListType) => {
  router.push({
    path: `${route.matched[2].path}/log`,
    query: { id: row.id }
  })
}

// 删除
const remove = async (row: StuListType) => {
  ElMessageBox.confirm(`是否删除用户：${row.real_name}`, '删除用户', {
    type: 'error'
  }).then(async () => {
    const { data: res } = await delStuAPI(row.id)
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: res.message
      })
      getUserList()
    } else {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}

// 修改用户状态
const updateState = async (row: StuListType) => {
  const { data: res } = await updateUserStateAPI(row.id)
  if (res.status === 200) {
    row.status = +!row.status
    return ElMessage.success(res.message)
  }
  return ElMessage.error(res.message)
}

// 切换每页条数
const handleSizeChange = (value: number) => {
  userListParams.value.pageSize = value
  getUserList()
}

// 切换分页
const handleCurrentChange = (value: number) => {
  userListParams.value.pageIndex = value
  getUserList()
}
</script>

<template>
  <div class="user-container">
    <div class="user-search">
      <el-input
        class="user-search-input"
        v-model="userListParams.real_name"
        placeholder="输入姓名查询"
        :prefix-icon="Search"
        @change="getUserList"
      ></el-input>
      <el-button type="primary" @click="edit">添加</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%; margin-bottom: 1.875rem"
      border
    >
      <el-table-column prop="id" label="ID" width="60px" />
      <el-table-column prop="user_name" label="用户名" />
      <el-table-column prop="real_name" label="真实姓名" width="100px" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="age" label="年龄" width="80px" />
      <el-table-column label="性别" width="54px">
        <template #default="{ row }">
          {{ formatGender(row.gender) }}
        </template>
      </el-table-column>
      <el-table-column label="学院" v-if="userListParams.role === 1">
        <template #default="{ row }">
          {{
            row.user_college_id == void 0
              ? '暂无'
              : row.user_college_id?.college_name
          }}
        </template>
      </el-table-column>
      <el-table-column label="专业" v-if="userListParams.role === 1">
        <template #default="{ row }">
          {{
            row.user_department_id == void 0
              ? '暂无'
              : row.user_department_id?.department_name
          }}
        </template>
      </el-table-column>
      <el-table-column label="班级" v-if="userListParams.role === 1">
        <template #default="{ row }">
          {{
            row.user_class_id == void 0 ? '暂无' : row.user_class_id?.class_name
          }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="70px">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'">
            {{ row.status ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template #default="{ row }">
          {{ formatDate(row.create_time, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280px">
        <template #default="{ row }">
          <el-button
            type="warning"
            size="small"
            plain
            @click="updateState(row)"
          >
            {{ row.status ? '禁用' : '启用' }}
          </el-button>
          <el-button
            type="info"
            size="small"
            plain
            @click="checkLog(row)"
            v-if="userListParams.role === 1"
          >
            日志
          </el-button>
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
.user-container {
  .user-search {
    display: flex;
    width: 20%;
    margin-bottom: 1.25rem;
    .user-search-input {
      flex: 1;
      margin-right: 0.875rem;
    }
  }
}
</style>
@/interface/modules/api@/interface/modules/user
