<script lang="ts" setup>
import { getEduOptionAPI } from '@/api/edu'
import type { EditDataType, CascaderOptionType } from '@/interface'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { addUserInfoAPI, updateUserInfoAPI, getUserInfoAPI } from '@/api/user'
import { useOptionStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()
const getUserInfo = async () => {
  const { data: res } = await getUserInfoAPI(route.query.id as any)
  if (res.status === 200) {
    editFormData.value.edu = [
      res.data.user_college_id,
      res.data.user_department_id,
      res.data.user_class_id
    ]
    editFormData.value.user_name = res.data.user_name
    editFormData.value.password = res.data.password
    editFormData.value.real_name = res.data.real_name
    editFormData.value.phone = res.data.phone
    editFormData.value.age = res.data.age
    editFormData.value.gender = res.data.gender
    editFormData.value.birth_day = res.data.birth_day
    editFormData.value.role = res.data.role
    editFormData.value.status = res.data.status
  }
}
if (route.query?.id) {
  getUserInfo()
}

const editFormRef = ref<FormInstance>()
const editFormData = ref<EditDataType>({
  id: (route.query?.id as any) || '',
  user_name: '',
  password: '',
  real_name: '',
  phone: '',
  age: null,
  gender: null,
  birth_day: null,
  edu: null,
  role: route.meta.role as number,
  status: null
})
const editFormRules: FormRules = {
  user_name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  real_name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机格式',
      trigger: 'blur'
    }
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
  birth_day: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
  role: [{ required: true, message: '请选择用户权限', trigger: 'change' }],
  status: [{ required: true, message: '请选择用户状态', trigger: 'blur' }]
}

// 提交
const submit = async () => {
  const r = await editFormRef.value?.validate()
  if (!r) {
    return
  }
  let res = null
  if (route.query?.id) {
    res = await updateUserInfoAPI(editFormData.value)
  } else {
    res = await addUserInfoAPI(editFormData.value)
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

// 学院、专业、班级级联选择
const options = ref<CascaderOptionType[]>([])
const getEduOption = async () => {
  const { data: res } = await getEduOptionAPI()
  if (res.status === 200) {
    options.value = res.data
  }
}
getEduOption()
</script>

<template>
  <div class="edit-container">
    <el-form
      :model="editFormData"
      :rules="editFormRules"
      label-width="140px"
      ref="editFormRef"
    >
      <el-form-item prop="user_name">
        <template #label>
          <div class="edit-form-item-label">用户名 :</div>
        </template>
        <el-input
          v-model="editFormData.user_name"
          placeholder="请输入用户名"
          style="width: 15rem"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <template #label>
          <div class="edit-form-item-label">密码 :</div>
        </template>
        <el-input
          v-model="editFormData.password"
          placeholder="请输入密码"
          style="width: 15rem"
        ></el-input>
      </el-form-item>
      <el-form-item prop="real_name">
        <template #label>
          <div class="edit-form-item-label">真实姓名 :</div>
        </template>
        <el-input
          v-model="editFormData.real_name"
          placeholder="请输入真实姓名"
          style="width: 15rem"
        ></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <template #label>
          <div class="edit-form-item-label">手机号 :</div>
        </template>
        <el-input
          v-model="editFormData.phone"
          placeholder="请输入手机号"
          style="width: 15rem"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <template #label>
          <div class="edit-form-item-label">年龄 :</div>
        </template>
        <el-input-number
          v-model="editFormData.age"
          style="width: 15rem"
          placeholder="请输入年龄"
          :min="18"
        ></el-input-number>
      </el-form-item>
      <el-form-item prop="gender">
        <template #label>
          <div class="edit-form-item-label">性别 :</div>
        </template>
        <el-select
          v-model="editFormData.gender"
          clearable
          placeholder="请选择性别"
          style="width: 15rem"
        >
          <el-option label="男" :value="1" />
          <el-option label="女" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item prop="birth_day">
        <template #label>
          <div class="edit-form-item-label">出生日期 :</div>
        </template>
        <el-date-picker
          v-model="editFormData.birth_day"
          type="date"
          placeholder="请选择出生日期"
          style="width: 15rem"
        />
      </el-form-item>
      <el-form-item v-if="route.meta.role === 1">
        <template #label>
          <div class="edit-form-item-label">学院 / 专业 / 班级 :</div>
        </template>
        <el-cascader
          style="width: 15rem"
          v-model="editFormData.edu"
          :options="options"
          clearable
        />
      </el-form-item>

      <el-form-item v-if="route.meta.role !== 1" prop="role">
        <template #label>
          <div class="edit-form-item-label">权限 :</div>
        </template>
        <el-select
          v-model="editFormData.role"
          placeholder="请选择用户权限"
          clearable
          style="width: 15rem"
        >
          <el-option label="老师" :value="2" />
          <el-option label="管理员" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <template #label>
          <div class="edit-form-item-label">状态 :</div>
        </template>
        <el-select
          v-model="editFormData.status"
          placeholder="请选择用户状态"
          clearable
          style="width: 15rem"
        >
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.edit-container {
  .edit-form-item-label {
    font-weight: 550;
  }
}
</style>
@/interface/modules/edu@/interface/modules/user
