<script lang="ts" setup>
import { Lock, User } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginAPI } from '@/api/login'
import type { LoginDataType } from '@/interface/api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginLoading = ref(false)
const loginRef = ref()
const loginData = ref<LoginDataType>({
  user_name: '',
  password: ''
})
const loginRules = {
  user_name: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入管理员密码', trigger: 'blur' }]
}

const login = async () => {
  const r = await loginRef.value.validate()
  if (r) {
    loginLoading.value = true
    const { data: res } = await loginAPI(loginData.value)
    if (res.status === 201) {
      localStorage.setItem('t', res.token)
      localStorage.setItem('uid', res.uid)
      //@ts-ignore
      ElMessage({
        type: 'success',
        message: res.message
      })

      router.replace('/')
    } else {
      //@ts-ignore
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
    loginLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <el-card class="login-box">
      <h1 class="login-title">管理端</h1>
      <el-form :model="loginData" :rules="loginRules" ref="loginRef">
        <el-form-item style="margin-bottom: 1.5rem" prop="user_name">
          <el-input
            v-model="loginData.user_name"
            :prefix-icon="User"
            placeholder="请输入管理员账号"
            style="height: 2.75rem"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginData.password"
            :prefix-icon="Lock"
            placeholder="请输入管理员密码"
            style="height: 2.75rem"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            style="width: 100%; height: 2.75rem"
            type="primary"
            @click="login"
            :loading="loginLoading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  .login-box {
    padding: 0.875rem 1.25rem;
    margin-top: 12.5rem;
    width: 31.25rem;
    height: 20.5rem;
    .login-title {
      text-align: center;
      margin-bottom: 1.25rem;
    }
  }
}
</style>
@/interface/modules/api
