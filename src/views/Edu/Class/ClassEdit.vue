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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
  class_name: [
    {
      required: true,
      message: t('EDU.CLASS_NAME_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ],
  collegeId: [
    {
      required: true,
      message: t('EDU.AFFILIATED_COLLEGE_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ],
  departmentId: [
    {
      required: true,
      message: t('EDU.AFFILIATED_DEPARTMENT_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ],
  classNode: [
    {
      required: true,
      message: t('EDU.CLASS_CODE_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ]
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
      label-width="15rem"
      ref="editFormRef"
      :rules="editFormRules"
    >
      <el-form-item prop="class_name">
        <template #label>
          <div class="label">{{ $t('EDU.CLASS_NAME') }} :</div>
        </template>
        <el-input
          style="width: 15rem"
          v-model="editFormData.class_name"
          :placeholder="$t('EDU.CLASS_NAME_PLACEHOLDER')"
        />
      </el-form-item>
      <el-form-item prop="collegeId">
        <template #label>
          <div class="label">{{ $t('EDU.AFFILIATED_COLLEGE') }} :</div>
        </template>
        <el-select
          style="width: 15rem"
          v-model="editFormData.collegeId"
          clearable
          v-loadmore="collegeLoadmore"
          :loading="collegeLoading"
          :loading-text="$t('EDU.LOADING_TEXT')"
          @change="selectCollege"
          :placeholder="$t('EDU.AFFILIATED_COLLEGE_PLACEHOLDER')"
        >
          <el-option
            v-for="item in collegeData"
            :key="item.id"
            :label="item.college_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="departmentId">
        <template #label>
          <div class="label">{{ $t('EDU.AFFILIATED_DEPARTMENT') }} :</div>
        </template>
        <el-select
          style="width: 15rem"
          v-model="editFormData.departmentId"
          clearable
          v-loadmore="departmentLoadmore"
          :loading="departmentLoading"
          :loading-text="$t('EDU.LOADING_TEXT')"
          :placeholder="$t('EDU.AFFILIATED_DEPARTMENT_PLACEHOLDER')"
        >
          <el-option
            v-for="item in departmentData"
            :key="item.id"
            :label="item.department_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="classNode">
        <template #label>
          <div class="label">{{ $t('EDU.CLASS_CODE') }} :</div>
        </template>
        <el-input
          style="width: 15rem"
          v-model="editFormData.classNode"
          :placeholder="$t('EDU.CLASS_CODE_PLACEHOLDER')"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">
          {{ $t('EDU.SUBMIT') }}
        </el-button>
        <el-button @click="reset">{{ $t('EDU.RESET') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
