<script lang="ts" setup>
import {
  addDepartmentAPI,
  getCollegeListAPI,
  getDepartmentAPI,
  updateDepartmentAPI
} from '@/api/edu'
import type { CollegeListType, CollegeType, DepartmentType } from '@/interface'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOptionStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()

const getDepartment = async () => {
  const { data: res } = await getDepartmentAPI(route.query?.id as any)
  if (res.status === 200) {
    editFormData.value.departmentName = res.data.department_name
    editFormData.value.collegeId = res.data.college_id
  } else {
    ElMessage.error(res.message)
  }
}
if (route.query?.id) {
  getDepartment()
}

const editFormData = ref({
  id: (route.query?.id as string) || '',
  departmentName: '',
  collegeId: ''
})
const editFormRef = ref<FormInstance>()
const editFormRules: FormRules = {
  departmentName: [
    { required: true, message: '请输入专业名', trigger: 'blur' }
  ],
  collegeId: [{ required: true, message: '请选择所属学院', trigger: 'change' }]
}

// 提交
const submit = () => {
  editFormRef.value?.validate(async (r) => {
    if (r) {
      let res = null
      if (route.query?.id) {
        res = await updateDepartmentAPI(editFormData.value)
      } else {
        res = await addDepartmentAPI(editFormData.value)
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
const total = ref(0)
const collegeListParams = ref<CollegeListType>({
  pageIndex: 1,
  pageSize: 10,
  keyword: ''
})
const flag = ref(false)
const getCollegeList = async () => {
  const { data: res } = await getCollegeListAPI(collegeListParams.value)
  if (res.status === 200) {
    loading.value = false
    collegeData.value.push(...res.data)
    total.value = res.total
    flag.value = res.data.length ? false : true
  }
}
getCollegeList()
const loading = ref(false)
const loadmore = () => {
  if (!flag.value) {
    loading.value = true
    collegeListParams.value.pageIndex++
    getCollegeList()
  } else {
    return
  }
}
</script>

<template>
  <div class="departmentEdit-container">
    <el-form
      :model="editFormData"
      label-width="8.75rem"
      ref="editFormRef"
      :rules="editFormRules"
    >
      <el-form-item label="专业名: " prop="departmentName">
        <el-input style="width: 15rem" v-model="editFormData.departmentName" />
      </el-form-item>
      <el-form-item label="所属学院: " prop="collegeId">
        <el-select
          style="width: 15rem"
          v-model="editFormData.collegeId"
          clearable
          v-loadmore="loadmore"
          :loading="loading"
          loading-text="加载中"
        >
          <el-option
            v-for="item in collegeData"
            :key="item.id"
            :label="item.college_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
