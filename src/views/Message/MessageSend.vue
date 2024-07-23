<script lang="ts" setup>
import { selectUserNameAPI, sendMessageAPI } from '@/api/message'
import type { OptionItem, SendMessageDataType } from '@/interface'
import { ElMessage, type FormInstance } from 'element-plus'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useOptionStore } from '@/stores'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()

const sendFormData = ref<SendMessageDataType>({
  title: '',
  content: '',
  receive_id: []
})
const sendFormRef = ref<FormInstance>()
const sendFormRules = {
  title: [
    {
      required: true,
      message: t('MESSAGE.MESSAGE_TITLE_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ],
  content: [
    {
      required: true,
      message: t('MESSAGE.MESSAGE_CONTENT_PLACEHOLDER'),
      trigger: ['blur', 'change']
    }
  ]
}

// 远程搜索
const options = ref<OptionItem[]>([])
const loading = ref(false)
const remoteMethod = async (val: string) => {
  if (!val) {
    options.value = []
    return
  }
  loading.value = true
  const { data: res } = await selectUserNameAPI(val)
  if (res.status === 200) {
    loading.value = false
    return (options.value = res.data)
  }
  return ElMessage.error(res.message)
}

// 发送
const send = async () => {
  sendFormRef.value?.validate(async (r) => {
    if (r) {
      const { data: res } = await sendMessageAPI(sendFormData.value)
      if (res.status === 200) {
        ElMessage.success(res.message)
      } else {
        ElMessage.error(res.message)
      }
      const index = optionStore.tagBar.findIndex(
        (item) => item.current === route.fullPath
      )
      router.push(optionStore.tagBar[index].back)
      optionStore.tagBar.splice(index, 1)
      return
    }
    return false
  })
}

// 重置
const reset = () => {
  sendFormRef.value?.resetFields()
}
</script>

<template>
  <div class="send-container">
    <el-form
      :model="sendFormData"
      :rules="sendFormRules"
      ref="sendFormRef"
      label-width="15rem"
    >
      <el-form-item prop="title">
        <template #label>
          <div class="label">{{ $t('MESSAGE.MESSAGE_TITLE') }} :</div>
        </template>
        <el-input
          style="width: 31.25rem"
          v-model="sendFormData.title"
          :placeholder="$t('MESSAGE.MESSAGE_TITLE_PLACEHOLDER')"
        />
      </el-form-item>
      <el-form-item prop="content">
        <template #label>
          <div class="label">{{ $t('MESSAGE.MESSAGE_CONTENT') }} :</div>
        </template>
        <el-input
          style="width: 37.5rem"
          rows="16"
          type="textarea"
          show-word-limit
          v-model="sendFormData.content"
          :placeholder="$t('MESSAGE.MESSAGE_CONTENT_PLACEHOLDER')"
        />
      </el-form-item>
      <el-form-item prop="receive_id">
        <template #label>
          <div class="label">{{ $t('MESSAGE.RECEIVE_USER_NAME') }} :</div>
        </template>
        <el-select
          style="width: 15rem"
          v-model="sendFormData.receive_id"
          multiple
          filterable
          remote
          reserve-keyword
          :placeholder="$t('MESSAGE.RECEIVE_USER_NAME_PLACEHOLDER')"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.user_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="send">
          {{ $t('MESSAGE.SEND') }}
        </el-button>
        <el-button @click="reset">{{ $t('MESSAGE.RESET') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped></style>
