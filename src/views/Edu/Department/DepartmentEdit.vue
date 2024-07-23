<script lang="ts" setup>
import {
  addDepartmentAPI,
  getCollegeListAPI,
  getDepartmentAPI,
  updateDepartmentAPI
} from '@/api/edu'
import type { CollegeListType, CollegeType } from '@/interface'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOptionStore } from '@/stores'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

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
    {
      required: true,
      message: t('EDU.DEPARTMENT_NAME_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ],
  collegeId: [
    {
      required: true,
      message: t('EDU.AFFILIATED_COLLEGE_PLACEHOLDER'),
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
      label-width="15rem"
      ref="editFormRef"
      :rules="editFormRules"
    >
      <el-form-item prop="departmentName">
        <template #label>
          <div class="label">{{ $t('EDU.DEPARTMENT_NAME') }} :</div>
        </template>
        <el-input
          style="width: 15rem"
          v-model="editFormData.departmentName"
          :placeholder="$t('EDU.DEPARTMENT_NAME_PLACEHOLDER')"
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
          v-loadmore="loadmore"
          :loading="loading"
          :loading-text="$t('EDU.LOADING_TEXT')"
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
      <el-form-item>
        <el-button type="primary" @click="submit">
          {{ $t('EDU.SUBMIT') }}
        </el-button>
        <el-button @click="reset">{{ $t('EDU.RESET') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
