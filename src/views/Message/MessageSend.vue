<script lang="ts" setup>
import { selectUserNameAPI, sendMessageAPI } from '@/api/message'
import type { OptionItem, SendMessageDataType } from '@/interface'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useOptionStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()

const sendFormData = ref<SendMessageDataType>({
  title: '',
  content: '',
  receive_id: []
})
const sendFormRef = ref()
const sendFormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  receive_id: [
    { required: true, message: '请添加要发送的用户', trigger: 'change' }
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
      label-width="140px"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          style="width: 31.25rem"
          v-model="sendFormData.title"
        ></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input
          style="width: 61.25rem"
          rows="16"
          type="textarea"
          show-word-limit
          v-model="sendFormData.content"
        ></el-input>
      </el-form-item>
      <el-form-item label="接收人用户名" prop="receive_id">
        <el-select
          style="width: 15rem"
          v-model="sendFormData.receive_id"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请输入接收用户名"
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
        <el-button type="primary" @click="send">发送</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped></style>
