<script lang="ts" setup>
import { addCollegeAPI, getCollegeAPI, updateCollegeAPI } from '@/api/edu'
import type { CollegeType } from '@/interface'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOptionStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()

const getCollege = async () => {
  const { data: res } = await getCollegeAPI(route.query?.id as any)
  if (res.status === 200) {
    editFormData.value.collegeName = res.data.college_name
  } else {
    ElMessage.error(res.message)
  }
}
if (route.query?.id) {
  getCollege()
}

const editFormData = ref({
  id: (route.query?.id as string) || '',
  collegeName: ''
})
const editFormRef = ref<FormInstance>()
const editFormRules: FormRules = {
  collegeName: [{ required: true, message: '请输入学院名', trigger: 'blur' }]
}

// 提交
const submit = () => {
  editFormRef.value?.validate(async (r) => {
    if (r) {
      let res = null
      if (route.query?.id) {
        res = await updateCollegeAPI(editFormData.value)
      } else {
        res = await addCollegeAPI(editFormData.value)
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
</script>

<template>
  <div class="collegeEdit-container">
    <el-form
      :model="editFormData"
      label-width="8.75rem"
      ref="editFormRef"
      :rules="editFormRules"
    >
      <el-form-item label="学院名: " prop="collegeName">
        <el-input style="width: 15rem" v-model="editFormData.collegeName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
