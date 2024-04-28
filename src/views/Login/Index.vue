<script lang="ts" setup>
import { Lock, User } from '@element-plus/icons-vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  loginAPI,
  loginPhoneAPI,
  getQRCodeAPI,
  validatePhoneAPI,
  checkQRCodeAPI
} from '@/api/login'
import type { LoginDataType } from '@/interface'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import { socket } from '@/utils/socket'

onMounted(() => {
  socket.connect()
})
onUnmounted(() => {
  socket.disconnect()
})

const router = useRouter()
const userStore = useUserStore()

const loginLoading = ref(false)
const loginRef = ref()
const loginData = ref<LoginDataType>({
  user_name: '',
  password: '',
  phone: '',
  code: ''
})
// 校验手机号
const checkPhone = (rule: any, value: string, callback: Function) => {
  const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
  if (reg.test(value)) {
    return callback()
  }
  return callback(new Error('请输入正确的手机号'))
}
const loginRules = {
  user_name: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入管理员密码', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入管理员手机号', trigger: 'blur' },
    {
      validator: checkPhone,
      trigger: ['change', 'blur']
    }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

// 登录
const login = async () => {
  const r = await loginRef.value.validate()
  if (r) {
    loginLoading.value = true
    let res = null
    if (loginPhoneShow.value) {
      res = await loginPhoneAPI(loginData.value)
    } else {
      res = await loginAPI(loginData.value)
    }
    if (res.data.status === 200) {
      userStore.setUserData(res.data.user)
      localStorage.setItem('t', res.data.token)
      localStorage.setItem('uid', res.data.uid)
      ElMessage.success(res.data.message)
      router.replace('/')
    } else {
      ElMessage.error(res.data.message)
    }
    loginLoading.value = false
  }
}

// 手机号登录
const isPhoneDisabled = ref(false)
const isDisabled = ref(false)
const loginPhoneShow = ref(false)
const switchPhone = () => {
  loginPhoneShow.value = !loginPhoneShow.value
  loginData.value.user_name = ''
  loginData.value.password = ''
  loginData.value.phone = ''
  loginData.value.code = ''
}
// 获取验证码
const time = ref(60)
const getCode = async () => {
  const r = await loginRef.value.validateField(['phone'])
  if (!r) {
    return
  }
  const { data: res } = await validatePhoneAPI(loginData.value.phone)
  if (res.status === 200) {
    ElMessage({
      message: res.message,
      type: 'success'
    })
    isDisabled.value = true
    isPhoneDisabled.value = true
    const n = setInterval(() => {
      time.value--
      if (time.value === 0) {
        isDisabled.value = false
        isPhoneDisabled.value = false
        time.value = 60
        clearInterval(n)
      }
    }, 1000)
  }
}

// 微信登录
const wxQRCode = ref('')
const wxQRCodeStatus = ref(false) // 二维码状态，是否被扫，true：扫了
const getQRCode = async () => {
  const { data: res } = await getQRCodeAPI()
  if (res.status === 200) {
    wxQRCode.value = res.data
    let n = setInterval(async () => {
      const { data: checkRes } = await checkQRCodeAPI(res.scene)
      if (checkRes.status === 200) {
        wxQRCodeStatus.value = true
        socket.emit('loginQRCodeStatus')
        socket.on('resendLoginStatus', (data) => {
          if (data.status) {
            userStore.setUserData(data.user)
            localStorage.setItem('t', data.token)
            localStorage.setItem('uid', data.uid)
            ElMessage.success(data.message)
            router.replace('/')
          }
        })
        clearInterval(n)
      }
      if (checkRes.status === 400) {
        wxQRCode.value = ''
        clearInterval(n)
      }
    }, 3000)
  }
}
getQRCode()
</script>

<template>
  <div class="login-container">
    <el-card class="login-box">
      <h1 class="login-title">管理端</h1>
      <div class="login-content">
        <el-form
          class="login-form"
          :model="loginData"
          :rules="loginRules"
          ref="loginRef"
        >
          <el-form-item
            style="margin-bottom: 1.5rem"
            prop="user_name"
            v-if="!loginPhoneShow"
          >
            <el-input
              v-model="loginData.user_name"
              :prefix-icon="User"
              placeholder="请输入管理员账号"
              style="height: 2.75rem"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" v-if="!loginPhoneShow">
            <el-input
              v-model="loginData.password"
              :prefix-icon="Lock"
              placeholder="请输入管理员密码"
              style="height: 2.75rem"
              type="password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item
            style="margin-bottom: 1.5rem"
            prop="phone"
            v-if="loginPhoneShow"
            class="login-phone-item"
          >
            <el-input
              v-model="loginData.phone"
              :prefix-icon="User"
              placeholder="请输入管理员手机号"
              style="height: 2.75rem"
              :disabled="isPhoneDisabled"
            ></el-input>
            <el-button
              style="margin-left: 0.625rem"
              :disabled="isDisabled"
              @click="getCode"
              >{{ time < 60 ? time : '获取验证码' }}</el-button
            >
          </el-form-item>
          <el-form-item prop="code" v-if="loginPhoneShow">
            <el-input
              v-model="loginData.code"
              :prefix-icon="Lock"
              placeholder="请输入验证码"
              style="height: 2.75rem"
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
          <span class="login-switch-phone" @click="switchPhone">
            手机号登录
          </span>
        </el-form>
        <div class="login-wx-box">
          <h3 class="login-wx-span">微信登录</h3>
          <div class="login-wx-qrcode">
            <el-image class="login-wx-img" :src="wxQRCode">
              <template #error>
                <div class="image-slot" @click="getQRCode">
                  <el-icon><i-ep-picture /></el-icon>
                  <span>点击获取登录二维码</span>
                </div>
              </template>
            </el-image>
            <span class="login-wx-qrcode-scan" v-if="wxQRCodeStatus"
              >已扫码</span
            >
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-box {
    min-width: 55.75rem;
    min-height: 32.5rem;
    padding: 0.875rem 0 0.875rem 1.25rem;

    .login-title {
      margin-bottom: 1.25rem;
    }

    .login-content {
      min-height: 25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .login-form {
        flex: 1.5;

        .login-phone-item {
          :deep(.el-form-item__content) {
            flex-wrap: nowrap;
          }
        }

        .login-switch-phone {
          font-size: 0.875rem;
          cursor: pointer;
          float: right;
          color: #9a9a9a;
          transition: all 0.2s;

          &:hover {
            color: #409eff;
          }
        }
      }

      .login-wx-box {
        flex: 1;
        height: 25rem;
        padding: 0 2.5rem;
        border-left: 2px solid #e7e7e7;
        margin-left: 2.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        .login-wx-span {
          margin-bottom: 2.5rem;
        }

        .login-wx-qrcode {
          position: relative;
          width: 17.5rem;
          height: 17.5rem;

          .login-wx-img {
            width: 100%;
            height: 100%;
            padding: 1.25rem;
            position: absolute;
            left: 0;
            top: 0;

            .image-slot {
              cursor: pointer;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
              background: var(--el-fill-color-light);
              color: var(--el-text-color-secondary);
              font-size: 30px;

              span {
                font-size: 0.875rem;
                margin-top: 2.5rem;
              }
            }
          }

          .login-wx-qrcode-scan {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 1.25rem;
            backdrop-filter: blur(3px);
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 600;
            font-size: 1.5rem;
            letter-spacing: 0.25rem;
          }
        }
      }
    }
  }
}
</style>
