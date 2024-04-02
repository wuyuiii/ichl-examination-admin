<script lang="ts" setup>
import { ref } from 'vue'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { RefreshLeft } from '@element-plus/icons-vue'
import { uploadAvatar } from '@/api/user'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

// 预览头像
const file = ref<any>(null)
const avatarDialogVisible = ref(false)
const avatarDialogImage = ref('')
const inputFileRef = ref() // input框
const avaterDialogImageRef = ref() // el-image

// 选择图片
const openuploadBox = async () => {
  inputFileRef.value.click()
}

// 选择图片后，转为dataURl本地显示
const handleAvatarChange = (e: any) => {
  if (e.target.files[0] === undefined) {
    return
  }
  file.value = e.target.files[0]
  if (file.value?.size > 500 * 1024 * 1024) {
    return ElMessage.error('上传图片不能大于500M')
  }
  avatarDialogVisible.value = true
  // File对象转dataUrl
  const reader = new FileReader()
  reader.readAsDataURL(file.value as any)
  reader.onload = (e) => {
    avatarDialogImage.value = e.target?.result as string
  }
}

// 裁剪
const cropperFile = ref<any>(null)
const cropperDataUrl = ref(null)
const handleCropMoving = () => {
  // 获取截图的Blob信息
  avaterDialogImageRef.value?.getCropBlob((data: any) => {
    cropperFile.value = new File([data], Date.now() as any, {
      type: data.type
    })
    const reader = new FileReader()
    reader.readAsDataURL(cropperFile.value)
    reader.onload = (e) => {
      cropperDataUrl.value = e.target?.result as any
    }
  })
}

// 正式上传
const submitUpload = async () => {
  const avatarFormData: any = new FormData()
  avatarFormData.append('avatar', cropperFile.value)
  avatarFormData.append('uid', userStore.userData.id)
  const { data: res } = await uploadAvatar(avatarFormData)
  if (res.status === 200) {
    userStore.getUserData()
    ElMessage.success(res.message)
    avatarDialogVisible.value = false
  } else {
    ElMessage.error(res.message)
  }
}

// 关闭上传
const closeUpload = () => {
  avatarDialogVisible.value = false
}
</script>

<template>
  <div class="uploadImg-container" @click="openuploadBox">
    <input
      ref="inputFileRef"
      type="file"
      accept="image/*"
      class="uploadImg-upload"
      @change="handleAvatarChange"
    />
    <slot></slot>
  </div>
  <el-dialog v-model="avatarDialogVisible" title="裁剪头像" width="50%">
    <div class="avatarDialog">
      <div class="avatarDialog-left">
        <div
          class="avatarDialog-left-cropper"
          style="width: 22.5rem; height: 22.5rem"
        >
          <VueCropper
            ref="avaterDialogImageRef"
            :img="avatarDialogImage"
            :autoCrop="true"
            :canScale="false"
            :canMove="false"
            autoCropWidth="114"
            autoCropHeight="114"
            :centerBox="true"
            :fixed="true"
            @cropMoving="handleCropMoving()"
          />
        </div>

        <span class="avatarDialog-left-text" @click="inputFileRef.click()">
          <el-icon style="margin-right: 0.125rem"><RefreshLeft /></el-icon>
          重新选择图片
        </span>
      </div>
      <div class="avatarDialog-right">
        <span class="avatarDialog-right-title">预览头像</span>
        <el-avatar :src="cropperDataUrl" :size="200"></el-avatar>
      </div>
    </div>

    <template #footer>
      <el-button @click="closeUpload"> 关闭 </el-button>
      <el-button type="primary" @click="submitUpload"> 上传 </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.uploadImg-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 7.125rem;
  height: 7.125rem;
  cursor: pointer;
  border: 2px dashed var(--el-border-color);
  border-radius: 50%;
  transition: var(--el-transition-duration-fast);
  &:hover {
    border-color: var(--el-color-primary);
  }

  .uploadImg-upload {
    display: none;
  }
}

.avatarDialog {
  display: flex;
  .avatarDialog-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    .avatarDialog-left-text {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 0.5rem;

      cursor: pointer;
      letter-spacing: 1px;
      transition: var(--el-transition-duration-fast);
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
  .avatarDialog-right {
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    .avatarDialog-right-title {
      font-size: 1rem;
      font-weight: 550;
      letter-spacing: 1px;
      margin-bottom: 3.125rem;
    }
  }
}
</style>
