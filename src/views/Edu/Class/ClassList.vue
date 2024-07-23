<script lang="ts" setup>
import {
  addClassStudentAPI,
  delClassAPI,
  delClassStudentAPI,
  getClassListAPI,
  getClassStudentAPI
} from '@/api/edu'
import type {
  ClassListType,
  ClassType,
  GetClassStudentType,
  StuOperationType,
  User
} from '@/interface'
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOptionStore } from '@/stores'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatGender } from '@/utils/format'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()

const loading = ref(true)
const classData = ref<ClassType[]>([])
const total = ref(0)
const classListParams = ref<ClassListType>({
  college_id: '',
  department_id: '',
  pageIndex: 1,
  pageSize: 10,
  keyword: ''
})
const getClassList = async () => {
  const { data: res } = await getClassListAPI(classListParams.value)
  if (res.status === 200) {
    loading.value = false
    classData.value = res.data
    total.value = res.total
  } else {
    ElMessage.error(res.message)
  }
}
getClassList()

// 班级创编
const edit = (row: ClassType) => {
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
const remove = (row: ClassType) => {
  ElMessageBox.confirm(
    `${t('EDU.DELETE_CLASS_CONTENT')}：${row.class_name}`,
    t('EDU.DELETE_CLASS_TITLE'),
    {
      type: 'error'
    }
  ).then(async () => {
    const { data: res } = await delClassAPI(row.id as number)
    if (res.status === 200) {
      ElMessage.success(res.message)
      getClassList()
    } else {
      ElMessage.error(res.message)
    }
  })
}

// 切换每页条数
const handleSizeChange = (value: number) => {
  classListParams.value.pageSize = value
  getClassList()
}

// 切换分页
const handleCurrentChange = (value: number) => {
  classListParams.value.pageIndex = value
  getClassList()
}

// 获取班级学生
const stuDialog = ref(false)
const select = ref(false)
const dialogTotal = ref(0)
const stuListParams = ref<GetClassStudentType>({
  pageIndex: 1,
  pageSize: 10,
  classId: null,
  real_name: ''
})
const classStuData = ref<User[]>([])
const getClassStudent = async (row?: ClassType) => {
  if (row && row.id) {
    stuListParams.value.classId = row.id
  }
  const { data: res } = await getClassStudentAPI(stuListParams.value)
  if (res.status === 200) {
    classStuData.value = res.data
    dialogTotal.value = res.total
  }
}

// 查看学生
const getStudent = (row: ClassType) => {
  select.value = false
  stuDialog.value = true
  getClassStudent(row)
}

const stuOperation = ref<StuOperationType>({
  classId: null,
  studentId: []
})
const delFlag = ref(false)

// 班级添加学生
const addStudent = async (row: ClassType) => {
  delFlag.value = false // 区分添加和移除操作
  select.value = true
  stuDialog.value = true
  stuListParams.value.classId = null
  stuOperation.value.classId = row.id as number
  getClassStudent()
}

// 移除学生
const delStudent = (row: ClassType) => {
  delFlag.value = true // 区分添加和移除操作
  select.value = true
  stuDialog.value = true
  stuListParams.value.classId = null
  stuOperation.value.classId = row.id as number
  getClassStudent(row)
}

// 选择学生
const handleSelectionChange = (val: any[]) => {
  const studentId: Array<string | number> = []
  val.forEach((item) => {
    studentId.push(item.id)
  })
  stuOperation.value.studentId = studentId
}

// 切换dialog每页条数
const handleSizeChange2 = (value: number) => {
  stuListParams.value.pageSize = value
  getClassStudent()
}

// 切换dialog分页
const handleCurrentChange2 = (value: number) => {
  stuListParams.value.pageIndex = value
  getClassStudent()
}

// 确定选择
const handleSelectConfirm = async () => {
  if (stuOperation.value.studentId.length === 0) {
    return ElMessage.warning(`请选择要${delFlag.value ? '移除' : '添加'}的学生`)
  }
  if (delFlag.value) {
    // 删除
    const { data: res } = await delClassStudentAPI(stuOperation.value)
    if (res.status !== 200) {
      return ElMessage.error(res.message)
    }
    ElMessage.success(res.message)
    stuDialog.value = false
    getClassList()
  } else {
    // 添加
    const { data: res } = await addClassStudentAPI(stuOperation.value)
    if (res.status !== 200) {
      return ElMessage.error(res.message)
    }
    ElMessage.success(res.message)
    stuDialog.value = false
    getClassList()
  }
}
</script>

<template>
  <div class="class-container">
    <div class="class-search">
      <el-input
        class="class-search-input"
        v-model="classListParams.keyword"
        :placeholder="$t('EDU.CLASS_NAME_PLACEHOLDER')"
        clearable
        :prefix-icon="Search"
        @change="getClassList"
      />
      <el-button type="primary" @click="edit">{{ $t('EDU.ADD') }}</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="classData"
      border
      style="width: 100%; margin-bottom: 1.875rem"
    >
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column
        :label="$t('EDU.CLASS_NAME')"
        prop="class_name"
      ></el-table-column>
      <el-table-column
        :label="$t('EDU.CLASS_CODE')"
        prop="class_node"
        width="80px"
      ></el-table-column>
      <el-table-column
        :label="$t('EDU.AFFILIATED_COLLEGE')"
        prop="college_name"
      ></el-table-column>
      <el-table-column
        :label="$t('EDU.AFFILIATED_DEPARTMENT')"
        prop="department_name"
      ></el-table-column>
      <el-table-column
        :label="$t('EDU.CLASS_STUDENT_COUNT')"
        prop="student_num"
        width="200px"
      ></el-table-column>
      <el-table-column :label="$t('EDU.OPERATE')" width="520px">
        <template #default="{ row }">
          <el-button type="info" size="small" plain @click="getStudent(row)">
            {{ $t('EDU.CHECK_STUDENT') }}
          </el-button>
          <el-button type="success" size="small" plain @click="addStudent(row)">
            {{ $t('EDU.ADD_STUDENT') }}
          </el-button>
          <el-button type="warning" size="small" plain @click="delStudent(row)">
            {{ $t('EDU.REMOVE_STUDENT') }}
          </el-button>
          <el-button type="primary" size="small" plain @click="edit(row)">
            {{ $t('EDU.EDIT') }}
          </el-button>
          <el-button type="danger" size="small" plain @click="remove(row)">
            {{ $t('EDU.DELETE') }}
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
  <el-dialog v-model="stuDialog" width="70%">
    <div class="class-search">
      <el-input
        class="class-search-input"
        v-model="stuListParams.real_name"
        :placeholder="$t('USER_MANAGE.PLACEHOLDER')"
        :prefix-icon="Search"
        @change="getClassStudent"
      ></el-input>
    </div>
    <el-table
      :data="classStuData"
      border
      @selection-change="handleSelectionChange"
      style="margin-bottom: 1.25rem"
    >
      <el-table-column
        type="selection"
        width="55"
        v-if="select"
      ></el-table-column>
      <el-table-column label="ID" prop="id" width="80px"></el-table-column>
      <el-table-column
        :label="$t('USER_MANAGE.USER_NAME')"
        prop="user_name"
      ></el-table-column>
      <el-table-column
        :label="$t('USER_MANAGE.REAL_NAME')"
        prop="real_name"
      ></el-table-column>
      <el-table-column
        :label="$t('USER_MANAGE.PHONE')"
        prop="phone"
      ></el-table-column>
      <el-table-column :label="$t('USER_MANAGE.GENDER')" width="80px">
        <template #default="{ row }">
          {{ formatGender(row.gender) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('USER_MANAGE.COLLEGE')">
        <template #default="{ row }">
          {{
            row.user_college_id == void 0
              ? $t('USER_MANAGE.NONE')
              : row.user_college_id?.college_name
          }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('USER_MANAGE.DEPARTMENT')">
        <template #default="{ row }">
          {{
            row.user_department_id == void 0
              ? '暂无'
              : row.user_department_id?.department_name
          }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('USER_MANAGE.CLASS')">
        <template #default="{ row }">
          {{
            row.user_class_id == void 0
              ? $t('USER_MANAGE.NONE')
              : row.user_class_id?.class_name
          }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[10, 20, 30]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="dialogTotal"
      @size-change="handleSizeChange2"
      @current-change="handleCurrentChange2"
    />
    <template #footer v-if="select">
      <el-button @click="stuDialog = false">{{ $t('PAPER.CANCEL') }}</el-button>
      <el-button type="primary" @click="handleSelectConfirm">
        {{ $t('PAPER.CONFIRM') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.class-search {
  display: flex;
  width: 20%;
  margin-bottom: 1.25rem;
  .class-search-input {
    flex: 1;
    margin-right: 0.875rem;
  }
}
</style>
