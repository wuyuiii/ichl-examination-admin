<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores'
import { getLogAPI } from '@/api/user'
import type { LogDataType } from '@/interface'
import { formatDate, formatGender } from '@/utils/format'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { updateMineInfoAPI } from '@/api/user'
import UploadAvatar from './components/UploadAvatar.vue'
import { Plus } from '@element-plus/icons-vue'
import { debounce } from 'lodash'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const userStore = useUserStore()

const activeName = ref('first')

// 用户动态
const stuLogListParams = ref({
  pageIndex: 1,
  pageSize: 10,
  id: userStore.userData?.id
})
const stuLogList = ref<LogDataType[]>([])
const isOver = ref(false)
const getStuLogList = async () => {
  if (isOver.value) {
    return
  }
  const { data: res } = await getLogAPI(stuLogListParams.value)
  if (res.status === 200) {
    if (res.data.length < stuLogListParams.value.pageSize) {
      isOver.value = true
    }
    stuLogList.value = [...stuLogList.value, ...res.data]
  }
}
getStuLogList()

const scrollRef = ref()
const scrollTop = ref(0) // 记录数据加载前滚动条的位置，用来手动定位scrollbar
const handleScroll = debounce((e) => {
  const wrapRef = scrollRef.value.wrapRef
  scrollRef.value.moveY = (wrapRef.scrollTop * 100) / wrapRef.clientHeight
  const poor = wrapRef.scrollHeight - wrapRef.clientHeight
  if (e.scrollTop + 2 > poor) {
    scrollTop.value = e.scrollTop
    stuLogListParams.value.pageIndex += 1
  }
}, 100)

watch(
  () => stuLogListParams.value.pageIndex,
  () => {
    if (stuLogListParams.value.pageIndex > 1 && !isOver.value) {
      getStuLogList()
    }
  }
)

// 用户资料
const editFormData = ref({
  id: userStore.userData.id,
  real_name: userStore.userData.real_name,
  age: userStore.userData.age,
  gender: userStore.userData.gender,
  phone: userStore.userData.phone,
  birth_day: userStore.userData.birth_day
})
const checkPhone = (rule: any, value: any, callback: Function) => {
  const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
  if (reg.test(value)) {
    return callback()
  }
  return callback(new Error(t('CENTER.PHONE_TRUE_PLACEHOLDER')))
}

const editFormRef = ref<FormInstance>()
const editFormRules: FormRules = {
  real_name: [
    {
      required: true,
      message: t('CENTER.REAL_NAME_PLACEHOLDER'),
      trigger: ['change', 'blur']
    }
  ],
  gender: [
    {
      required: true,
      message: t('CENTER.GENDER_PLACEHOLDER'),
      trigger: ['change', 'blur']
    }
  ],
  phone: [
    {
      validator: checkPhone,
      trigger: 'change'
    }
  ]
}

const submit = () => {
  editFormRef.value?.validate(async (r) => {
    if (r) {
      const { data: res } = await updateMineInfoAPI(editFormData.value)
      if (res.status === 200) {
        ElMessage.success(res.message)
        userStore.getUserData(editFormData.value.id as number)
      } else {
        ElMessage.error(res.message)
      }
    } else {
      return false
    }
  })
}
</script>

<template>
  <div class="center-container">
    <div class="center-about">
      <el-card shadow="never">
        <template #header>
          <h3>{{ $t('CENTER.ABOUT_ME') }}</h3>
        </template>
        <div class="center-about-avatar">
          <UploadAvatar>
            <el-avatar
              class="user-card-avatar"
              :size="100"
              :src="userStore.userData?.image_path"
              v-if="userStore.userData?.image_path"
            />
            <el-icon v-else class="user-card-avatar-icon">
              <Plus />
            </el-icon>
          </UploadAvatar>
          <h3 style="margin-top: 20px">
            {{ userStore.userData.user_name }}
          </h3>
        </div>
        <div class="center-about-info">
          <ul>
            <li>
              <span>{{ $t('CENTER.REAL_NAME') }} : </span>
              {{ userStore.userData.real_name }}
            </li>
            <li>
              <span>{{ $t('CENTER.AGE') }} : </span>
              {{ userStore.userData.age }}
            </li>
            <li>
              <span>{{ $t('CENTER.GENDER') }} : </span>
              {{
                userStore.userData.gender &&
                formatGender(userStore.userData.gender)
              }}
            </li>
            <li>
              <span>{{ $t('CENTER.PHONE') }} : </span>
              {{ userStore.userData.phone }}
            </li>
            <li>
              <span>{{ $t('CENTER.BIRTHDAY') }} : </span>
              {{
                userStore.userData.birth_day &&
                formatDate(userStore.userData.birth_day, 'YYYY-MM-DD')
              }}
            </li>
          </ul>
        </div>
      </el-card>
    </div>
    <div class="center-data">
      <el-card style="height: 100%" shadow="never">
        <el-tabs v-model="activeName" style="height: 100%">
          <el-tab-pane
            :label="$t('CENTER.UPDATE')"
            name="first"
            style="height: 100%"
          >
            <el-scrollbar height="100%" @scroll="handleScroll" ref="scrollRef">
              <el-timeline style="max-width: 600px">
                <el-timeline-item
                  size="large"
                  :timestamp="formatDate(item.create_time, 'YYYY-MM-DD')"
                  placement="top"
                  v-for="item in stuLogList"
                  :key="item.id"
                >
                  <el-card>
                    <h3 style="margin-bottom: 1.25rem">
                      {{ item.real_name }} {{ item.content }}
                    </h3>
                    <p>
                      {{ formatDate(item.create_time, 'YYYY-MM-DD HH:mm:ss') }}
                    </p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane :label="$t('CENTER.ACCOUNT_INFO')" name="second">
            <el-form
              :model="editFormData"
              ref="editFormRef"
              :rules="editFormRules"
              label-width="6.25rem"
            >
              <el-form-item prop="real_name">
                <template #label>
                  <div class="edit-form-item-label">
                    {{ $t('CENTER.REAL_NAME') }} :
                  </div>
                </template>
                <el-input
                  v-model="editFormData.real_name"
                  style="width: 15rem"
                  :placeholder="$t('CENTER.REAL_NAME_PLACEHOLDER')"
                  clearable
                />
              </el-form-item>
              <el-form-item prop="age">
                <template #label>
                  <div class="edit-form-item-label">
                    {{ $t('CENTER.AGE') }} :
                  </div>
                </template>
                <el-input-number
                  v-model="editFormData.age"
                  style="width: 15rem"
                />
              </el-form-item>
              <el-form-item prop="gender">
                <template #label>
                  <div class="edit-form-item-label">
                    {{ $t('CENTER.GENDER') }} :
                  </div>
                </template>
                <el-select
                  v-model="editFormData.gender"
                  style="width: 15rem"
                  :placeholder="$t('CENTER.GENDER_PLACEHOLDER')"
                  clearable
                >
                  <el-option :label="$t('USER_MANAGE.MAN')" :value="1" />
                  <el-option :label="$t('USER_MANAGE.WOMAN')" :value="0" />
                </el-select>
              </el-form-item>
              <el-form-item prop="phone">
                <template #label>
                  <div class="edit-form-item-label">
                    {{ $t('CENTER.PHONE') }} :
                  </div>
                </template>
                <el-input
                  style="width: 15rem"
                  v-model="editFormData.phone"
                  :placeholder="$t('CENTER.PHONE_TRUE_PLACEHOLDER')"
                ></el-input>
              </el-form-item>
              <el-form-item prop="birth_day">
                <template #label>
                  <div class="edit-form-item-label">
                    {{ $t('CENTER.BIRTHDAY') }} :
                  </div>
                </template>
                <el-date-picker
                  v-model="editFormData.birth_day"
                  type="date"
                  :placeholder="$t('CENTER.BIRTHDAY_PLACEHOLDER')"
                  style="width: 15rem"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit">{{
                  $t('CENTER.SUBMIT')
                }}</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.center-container {
  height: 100%;
  display: flex;
  overflow: auto;

  .center-about {
    flex: 1;
    margin-right: 1.25rem;

    .center-about-avatar {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }

    .center-about-info {
      span {
        display: inline-block;
        width: 5rem;
        text-align: right;
        color: #838383;
        margin-right: 0.375rem;
      }
    }
  }
  .center-data {
    flex: 3;
    &:deep(.el-card__body) {
      height: 100%;
    }

    &:deep(.el-tabs__content) {
      height: calc(100% - 40px);
    }
    &:deep(.el-scrollbar__wrap) {
      padding-left: 0.625rem;
    }
  }
}
</style>
