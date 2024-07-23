<script lang="ts" setup>
import { getEduOptionAPI } from '@/api/edu'
import type { EditDataType, CascaderOptionType } from '@/interface'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { addUserInfoAPI, updateUserInfoAPI, getUserInfoAPI } from '@/api/user'
import { useOptionStore } from '@/stores'
import type {
  FormInstance,
  FormRules
} from 'element-plus/lib/components/index.js'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
  user_name: [
    {
      required: true,
      message: t('USER_MANAGE.USER_NAME_PLACEHOLDER'),
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: t('USER_MANAGE.PASSWORD_PLACEHOLDER'),
      trigger: 'blur'
    }
  ],
  real_name: [
    {
      required: true,
      message: t('USER_MANAGE.REAL_NAME_PLACEHOLDER'),
      trigger: 'blur'
    }
  ],
  phone: [
    {
      required: true,
      message: t('USER_MANAGE.PHONE_PLACEHOLDER'),
      trigger: 'blur'
    },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机格式',
      trigger: 'blur'
    }
  ],
  gender: [
    {
      required: true,
      message: t('USER_MANAGE.GENDER_PLACEHOLDER'),
      trigger: 'blur'
    }
  ],
  birth_day: [
    {
      required: true,
      message: t('USER_MANAGE.BIRTHDAY_PLACEHOLDER'),
      trigger: 'change'
    }
  ],
  role: [
    {
      required: true,
      message: t('USER_MANAGE.AUTHORITY_PLACEHOLDER'),
      trigger: 'change'
    }
  ],
  status: [
    {
      required: true,
      message: t('USER_MANAGE.STATE_PLACEHOLDER'),
      trigger: 'blur'
    }
  ]
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
      label-width="15rem"
      ref="editFormRef"
    >
      <el-form-item prop="user_name">
        <template #label>
          <div class="edit-form-item-label">
            {{ $t('USER_MANAGE.USER_NAME') }} :
          </div>
        </template>
        <el-input
          v-model="editFormData.user_name"
          :placeholder="$t('USER_MANAGE.USER_NAME_PLACEHOLDER')"
          style="width: 15rem"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <template #label>
          <div class="edit-form-item-label">
            {{ $t('USER_MANAGE.PASSWORD') }} :
          </div>
        </template>
        <el-input
          v-model="editFormData.password"
          :placeholder="$t('USER_MANAGE.PASSWORD_PLACEHOLDER')"
          style="width: 15rem"
        ></el-input>
      </el-form-item>
      <el-form-item prop="real_name">
        <template #label>
          <div class="edit-form-item-label">
            {{ $t('USER_MANAGE.REAL_NAME') }} :
          </div>
        </template>
        <el-input
          v-model="editFormData.real_name"
          :placeholder="$t('USER_MANAGE.REAL_NAME_PLACEHOLDER')"
          style="width: 15rem"
        ></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <template #label>
          <div class="edit-form-item-label">
            {{ $t('USER_MANAGE.PHONE') }} :
          </div>
        </template>
        <el-input
          v-model="editFormData.phone"
          :placeholder="$t('USER_MANAGE.PHONE_PLACEHOLDER')"
          style="width: 15rem"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <template #label>
          <div class="edit-form-item-label">{{ $t('USER_MANAGE.AGE') }} :</div>
        </template>
        <el-input-number
          v-model="editFormData.age"
          style="width: 15rem"
          :placeholder="$t('USER_MANAGE.AGE_PLACEHOLDER')"
          :min="18"
        ></el-input-number>
      </el-form-item>
      <el-form-item prop="gender">
        <template #label>
          <div class="edit-form-item-label">
            {{ $t('USER_MANAGE.GENDER') }} :
          </div>
        </template>
        <el-select
          v-model="editFormData.gender"
          clearable
          :placeholder="$t('USER_MANAGE.GENDER_PLACEHOLDER')"
          style="width: 15rem"
        >
          <el-option :label="$t('USER_MANAGE.MAN')" :value="1" />
          <el-option :label="$t('USER_MANAGE.WOMAN')" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item prop="birth_day">
        <template #label>
          <div class="edit-form-item-label">
            {{ $t('USER_MANAGE.BIRTHDAY') }} :
          </div>
        </template>
        <el-date-picker
          v-model="editFormData.birth_day"
          type="date"
          :placeholder="$t('USER_MANAGE.BIRTHDAY_PLACEHOLDER')"
          style="width: 15rem"
        />
      </el-form-item>
      <el-form-item v-if="route.meta.role === 1">
        <template #label>
          <div class="edit-form-item-label">
            {{ $t('USER_MANAGE.EDU_OPTIONS') }} :
          </div>
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
          <div class="edit-form-item-label">
            {{ $t('USER_MANAGE.AUTHORITY') }} :
          </div>
        </template>
        <el-select
          v-model="editFormData.role"
          :placeholder="$t('USER_MANAGE.AUTHORITY_PLACEHOLDER')"
          clearable
          style="width: 15rem"
        >
          <el-option :label="$t('USER_MANAGE.TEACHER')" :value="2" />
          <el-option :label="$t('USER_MANAGE.ADMIN')" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <template #label>
          <div class="edit-form-item-label">
            {{ $t('USER_MANAGE.STATE') }} :
          </div>
        </template>
        <el-select
          v-model="editFormData.status"
          :placeholder="$t('USER_MANAGE.STATE_PLACEHOLDER')"
          clearable
          style="width: 15rem"
        >
          <el-option
            :label="$t('USER_MANAGE.STATE_OPTIONS_ENABLE')"
            :value="1"
          />
          <el-option
            :label="$t('USER_MANAGE.STATE_OPTIONS_DISABLE')"
            :value="0"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">
          {{ $t('USER_MANAGE.SUBMIT') }}
        </el-button>
        <el-button @click="reset">
          {{ $t('USER_MANAGE.RESET') }}
        </el-button>
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
