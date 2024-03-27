<script lang="ts" setup>
import {
  addClassAPI,
  getCollegeListAPI,
  getClassAPI,
  updateClassAPI,
  getDepartmentListAPI
} from '@/api/edu'
import type {
  CollegeListType,
  CollegeType,
  ClassType,
  DepartmentListType,
  DepartmentType
} from '@/interface'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOptionStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()

const getClass = async () => {
  const { data: res } = await getClassAPI(route.query?.id as any)
  if (res.status === 200) {
    editFormData.value.class_name = res.data.class_name
    editFormData.value.collegeId = res.data.college_id
    editFormData.value.departmentId = res.data.department_id
    editFormData.value.classNode = res.data.class_node
  } else {
    ElMessage.error(res.message)
  }
}
if (route.query?.id) {
  getClass()
}

const editFormData = ref<ClassType>({
  id: (route.query?.id as any) || null,
  class_name: '',
  collegeId: null,
  departmentId: null,
  classNode: ''
})
const editFormRef = ref<FormInstance>()
const editFormRules: FormRules = {
  class_name: [{ required: true, message: '请输入班级名', trigger: 'blur' }],
  collegeId: [{ required: true, message: '请选择所属学院', trigger: 'change' }],
  departmentId: [
    { required: true, message: '请选择所属专业', trigger: 'change' }
  ],
  classNode: [{ required: true, message: '请输入班级码', trigger: 'blur' }]
}

// 提交
const submit = () => {
  editFormRef.value?.validate(async (r) => {
    if (r) {
      let res = null
      if (route.query?.id) {
        res = await updateClassAPI(editFormData.value)
      } else {
        res = await addClassAPI(editFormData.value)
      }
      if (res.data.status === 200) {
        ElMessage({
          type: 'success',
          message: res.data.message
        })
      } else {
        ElMessage({
          type: 'error',
          message: res.data.message
        })
      }
      const index = optionStore.tagBar.findIndex(
        (item) => item.current === route.fullPath
      )
      router.push(optionStore.tagBar[index].back)
      optionStore.tagBar.splice(index, 1)
    } else {
      return false
    }
  })
}

// 重置
const reset = () => {
  editFormRef.value?.resetFields()
}

// 滚动加载
const collegeData = ref<CollegeType[]>([])
const collegeLoading = ref(false)
const collegeListParams = ref<CollegeListType>({
  pageIndex: 1,
  pageSize: 10,
  keyword: ''
})
const collageFlag = ref(false)
const departmentData = ref<DepartmentType[]>([])
const departmentLoading = ref(false)
const departmentListParams = ref<DepartmentListType>({
  college_id: '',
  pageIndex: 1,
  pageSize: 10,
  keyword: ''
})
const departmentFlag = ref(false)
const getCollegeList = async () => {
  const { data: res } = await getCollegeListAPI(collegeListParams.value)
  if (res.status === 200) {
    collegeLoading.value = false
    collegeData.value.push(...res.data)
    collageFlag.value = res.data.length ? false : true
  }
}
getCollegeList()

const getDepartmentList = async (state?: boolean) => {
  const { data: res } = await getDepartmentListAPI(departmentListParams.value)
  if (res.status === 200) {
    departmentLoading.value = false
    state
      ? departmentData.value.push(...res.data)
      : (departmentData.value = res.data)
    departmentFlag.value = res.data.length ? false : true
  }
}
getDepartmentList()

// 滚动加载
const collegeLoadmore = () => {
  if (collageFlag.value) {
    return
  }
  collegeLoading.value = true
  collegeListParams.value.pageIndex++
  getCollegeList()
}
const departmentLoadmore = () => {
  if (departmentFlag.value) {
    return
  }
  departmentLoading.value = true
  departmentListParams.value.pageIndex++
  getDepartmentList(true)
}

// 选择学院
const selectCollege = (val: string) => {
  if (!val) {
    return
  }
  editFormData.value.departmentId = null
  departmentListParams.value.college_id = val
  departmentListParams.value.pageIndex = 1
  getDepartmentList()
}
</script>

<template>
  <div class="classEdit-container">
    <el-form
      :model="editFormData"
      label-width="8.75rem"
      ref="editFormRef"
      :rules="editFormRules"
    >
      <el-form-item label="班级名: " prop="class_name">
        <el-input
          style="width: 15rem"
          v-model="editFormData.class_name"
          placeholder="请输入班级名"
        />
      </el-form-item>
      <el-form-item label="所属学院: " prop="collegeId">
        <el-select
          style="width: 15rem"
          v-model="editFormData.collegeId"
          clearable
          v-loadmore="collegeLoadmore"
          :loading="collegeLoading"
          loading-text="加载中"
          @change="selectCollege"
        >
          <el-option
            v-for="item in collegeData"
            :key="item.id"
            :label="item.college_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属专业: " prop="departmentId">
        <el-select
          style="width: 15rem"
          v-model="editFormData.departmentId"
          clearable
          v-loadmore="departmentLoadmore"
          :loading="departmentLoading"
          loading-text="加载中"
        >
          <el-option
            v-for="item in departmentData"
            :key="item.id"
            :label="item.department_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班级码: " prop="classNode">
        <el-input style="width: 15rem" v-model="editFormData.classNode" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
