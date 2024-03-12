<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { SubjectDataType } from '@/interface'
import { addSubjectAPI, getSubjectAPI, updateSubjectAPI } from '@/api/subject'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useOptionStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()

const getSubject = async () => {
  const { data: res } = await getSubjectAPI(route.query?.id as any)
  if (res.status === 200) {
    editFormData.value.name = res.data.name
  }
}
if (route.query?.id) {
  getSubject()
}

const editFormData = ref<SubjectDataType>({
  id: (route.query?.id as any) || '',
  name: ''
})
const editFormRef = ref<FormInstance>()
const editFormRules: FormRules = {
  name: [{ required: true, message: '请输入学科名', trigger: 'blur' }]
}

// 提交
const submit = async () => {
  const r = await editFormRef.value?.validate()
  if (!r) {
    return
  }
  let res = null
  if (route.query?.id) {
    res = await updateSubjectAPI(editFormData.value)
  } else {
    res = await addSubjectAPI(editFormData.value)
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
}

// 重置
const reset = () => {
  editFormRef.value?.resetFields()
}
</script>

<template>
  <div class="subjectEdit-container">
    <el-form
      :model="editFormData"
      :rules="editFormRules"
      ref="editFormRef"
      label-width="8.75rem"
    >
      <el-form-item prop="name">
        <template #label>
          <div class="label">学科</div>
        </template>
        <el-input
          v-model="editFormData.name"
          placeholder="请输入学科名"
          style="width: 15rem"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.label {
  font-weight: 550;
}
</style>
