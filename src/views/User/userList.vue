<script lang="ts" setup>
import { ref, watch } from 'vue'
import { formatGender, formatDate } from '@/utils/format'
import type { UserListType, StuListType } from '@/interface'
import { Search } from '@element-plus/icons-vue'
import { getUserListAPI, delStuAPI, updateUserStateAPI } from '@/api/user'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useOptionStore } from '@/stores'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
  ElMessageBox.confirm(
    `${t('USER_MANAGE.DELETE_USER_CONTENT')}：${row.real_name}`,
    t('USER_MANAGE.DELETE_USER_TITLE'),
    {
      type: 'error'
    }
  ).then(async () => {
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
        :placeholder="$t('USER_MANAGE.PLACEHOLDER')"
        :prefix-icon="Search"
        @change="getUserList"
      ></el-input>
      <el-button type="primary" @click="edit">
        {{ $t('USER_MANAGE.BUTTON') }}
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%; margin-bottom: 1.875rem"
      border
    >
      <el-table-column prop="id" label="ID" width="60px" />
      <el-table-column prop="user_name" :label="$t('USER_MANAGE.USER_NAME')" />
      <el-table-column
        prop="real_name"
        :label="$t('USER_MANAGE.REAL_NAME')"
        width="110px"
      />
      <el-table-column prop="phone" :label="$t('USER_MANAGE.PHONE')" />
      <el-table-column prop="age" :label="$t('USER_MANAGE.AGE')" width="54px" />
      <el-table-column :label="$t('USER_MANAGE.GENDER')" width="80px">
        <template #default="{ row }">
          {{ formatGender(row.gender) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('USER_MANAGE.COLLEGE')"
        v-if="userListParams.role === 1"
      >
        <template #default="{ row }">
          {{
            row.user_college_id == void 0
              ? $t('USER_MANAGE.NONE')
              : row.user_college_id?.college_name
          }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('USER_MANAGE.DEPARTMENT')"
        v-if="userListParams.role === 1"
      >
        <template #default="{ row }">
          {{
            row.user_department_id == void 0
              ? $t('USER_MANAGE.NONE')
              : row.user_department_id?.department_name
          }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('USER_MANAGE.CLASS')"
        v-if="userListParams.role === 1"
      >
        <template #default="{ row }">
          {{
            row.user_class_id == void 0
              ? $t('USER_MANAGE.NONE')
              : row.user_class_id?.class_name
          }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('USER_MANAGE.STATE')"
        :width="optionStore.languageSwitch ? '90px' : '70px'"
      >
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'">
            {{
              row.status
                ? $t('USER_MANAGE.STATE_OPTIONS_ENABLE')
                : $t('USER_MANAGE.STATE_OPTIONS_DISABLE')
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('USER_MANAGE.CREATE_TIME')">
        <template #default="{ row }">
          {{ formatDate(row.create_time, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('USER_MANAGE.OPERATE')" width="290px">
        <template #default="{ row }">
          <el-button
            type="warning"
            size="small"
            plain
            @click="updateState(row)"
          >
            {{
              row.status
                ? $t('USER_MANAGE.STATE_OPTIONS_DISABLE')
                : $t('USER_MANAGE.STATE_OPTIONS_ENABLE')
            }}
          </el-button>
          <el-button
            type="info"
            size="small"
            plain
            @click="checkLog(row)"
            v-if="userListParams.role === 1"
          >
            {{ $t('USER_MANAGE.LOG') }}
          </el-button>
          <el-button type="primary" size="small" plain @click="edit(row)">
            {{ $t('USER_MANAGE.EDIT') }}
          </el-button>
          <el-button type="danger" size="small" plain @click="remove(row)">
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
