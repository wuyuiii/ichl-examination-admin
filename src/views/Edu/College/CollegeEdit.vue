<script lang="ts" setup>
import { addCollegeAPI, getCollegeAPI, updateCollegeAPI } from '@/api/edu'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOptionStore } from '@/stores'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

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
  collegeName: [
    {
      required: true,
      message: t('EDU.COLLEGE_NAME_PLACEHOLDER'),
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
      <el-form-item prop="collegeName">
        <template #label>
          <div class="label">{{ $t('EDU.COLLEGE_NAME') }} :</div>
        </template>
        <el-input
          style="width: 15rem"
          v-model="editFormData.collegeName"
          :placeholder="$t('EDU.COLLEGE_NAME_PLACEHOLDER')"
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
