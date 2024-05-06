<script lang="ts" setup>
import { baseURL } from '@/utils/request'
import { getEduOptionAPI } from '@/api/edu'
import { getSubjectListAPI2 } from '@/api/subject'
import {
  getVideoAPI,
  mergeVideoAPI,
  mergeVideoPhotoAPI,
  removeVideoAPI,
  submitVideoAPI,
  updateVideoAPI,
  uploadVideoAPI,
  uploadVideoPhotoAPI
} from '@/api/video'
import type {
  CascaderOptionType,
  SubjectDataType,
  CreateVideoDataType
} from '@/interface'
import { useOptionStore } from '@/stores'
import {
  handleChunkSuccessRemovesessionStorage,
  handleFileChunk
} from '@/utils/fileChunk'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { socket } from '@/utils/socket'

onMounted(() => {
  socket.connect()
})
onUnmounted(() => {
  removeVideoFile()
  socket.disconnect()
})
const route = useRoute()
const router = useRouter()
const optionStore = useOptionStore()
const editFormData = ref<CreateVideoDataType>({
  id: (route.query.id as any) || null,
  videoSrc: sessionStorage.getItem('video') || '',
  videoPhotosSrc: sessionStorage.getItem('videoPhoto') || '',
  videoName: '',
  subjectId: null,
  edu: []
})

const editFormRules: FormRules = {
  subjectId: [{ required: true, message: '1', trigger: 'change' }],
  videoName: [{ required: true, message: '1', trigger: 'change' }],
  edu: [{ required: true, message: '1', trigger: 'change' }]
}
const editFormRef = ref<FormInstance>()

const getVideo = async () => {
  const { data: res } = await getVideoAPI(route.query.id as any)
  if (res.status === 200) {
    editFormData.value = res.data
  }
}
if (route.query.id) {
  getVideo()
}

// 获取学科列表
const subjectData = ref<SubjectDataType[]>([])
const getSubjectList = async () => {
  const { data: res } = await getSubjectListAPI2()
  if (res.status === 200) {
    subjectData.value = res.data
  }
}
getSubjectList()
// 学院、专业、班级级联选择
const options = ref<CascaderOptionType[]>([])
const getEduOption = async () => {
  const { data: res } = await getEduOptionAPI()
  if (res.status === 200) {
    options.value = res.data
  }
}
getEduOption()

const videoPhotoProgress = ref(0)
const videoProgress = ref(0)
const videoDialog = ref(false)
const videoPhotoDialog = ref(false)

// 上传视频封面
const choicePhotoFileInputref = ref()
const openChoicePhotoFile = () => {
  choicePhotoFileInputref.value.click()
}
const handlePhotoBeforeUpload = async (e: any) => {
  const file: File = e.target.files[0]
  const fileType = file.name.split('.')[file.name.split('.').length - 1]
  if (file.size > 20 * 1024 * 1024) {
    return ElMessage.error('图片太大')
  }
  if (file.name.length > 256) {
    return ElMessage.error('图片名称太长')
  }

  // 分片
  const chunkList = await handleFileChunk(file)
  if (!chunkList) {
    return ElMessage.error('文件分片时发生未知错误')
  }
  const [chunks, totalChunks] = chunkList
  console.log(chunks)

  const sessionChunkList = (chunks as []).map(({ md5, index }) => {
    return { md5, index }
  })
  sessionStorage.setItem('chunkVideoPhoto', JSON.stringify(sessionChunkList))
  let i = 0
  let wrongCount = 0
  while (i < (chunks as []).length && wrongCount === 0) {
    const formData = new FormData()
    formData.append('videoPhoto', (chunks as any)[i].chunk)
    formData.append('chunkFileMD5', (chunks as any)[i].md5)
    formData.append('chunkFileIndex', (chunks as any)[i].index)
    formData.append('fileType', fileType)
    const { data: res } = await uploadVideoPhotoAPI(formData)
    videoPhotoDialog.value = true
    if (res.status === 200) {
      handleChunkSuccessRemovesessionStorage(
        'chunkVideoPhoto',
        (chunks as any)[i].index
      )
      videoPhotoProgress.value = Math.floor((i / +totalChunks) * 100)
      i++
    } else {
      wrongCount++
      const { data: res } = await uploadVideoPhotoAPI(formData)
      if (res.status === 200) {
        wrongCount = 0
        handleChunkSuccessRemovesessionStorage(
          'chunkVideoPhoto',
          (chunks as any)[i].index
        )
        videoPhotoProgress.value = Math.floor((i / +totalChunks) * 100)
        i++
      } else {
        // 再次上传分片文件出错,则停止上传 return false
        ElMessage.error(res.message)
        break
      }
    }
  }
  // 本地预览
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (e) => {
    editFormData.value.videoPhotosSrc = e.target?.result as string
  }
  e.target.value = ''
  // 上传成功后后端合并上传oss之后回传url地址
  const { data: res } = await mergeVideoPhotoAPI(wrongCount)
  if (res.status === 200) {
    videoPhotoProgress.value = Math.floor((i / +totalChunks) * 100)
    editFormData.value.videoPhotosSrc = `${baseURL}/static/${res.fileName}` // 静态资源临时访问
    sessionStorage.setItem('videoPhoto', `${baseURL}/static/${res.fileName}`) // 防止刷新后地址丢失
    videoPhotoDialog.value = false
    return ElMessage.success(res.message)
  } else {
    return ElMessage.error(res.message)
  }
}

// 上传视频
const choiceVideoFileInputRef = ref()
const openChoiceVideoFile = () => {
  choiceVideoFileInputRef.value.click()
}
const handleVideoBeforeUpload = async (e: any) => {
  const file: File = e.target.files[0]
  console.log(file)
  if (file.type !== 'video/mp4') {
    return ElMessage.error('请上传MP4格式的视频')
  }
  if (file.name.length > 256) {
    return ElMessage.error('视频名称太长')
  }

  // 分片
  const chunkResult = await handleFileChunk(file) // 分片结果
  if (!chunkResult) {
    // 分片失败，停止上传并弹出错误
    return ElMessage.error('文件分片时发生未知错误')
  }
  const [chunks, totalChunks] = chunkResult
  const sessionChunkList = (chunks as []).map(({ md5, index }) => {
    return { md5, index }
  })
  sessionStorage.setItem('chunkVideo', JSON.stringify(sessionChunkList))
  let i = 0
  let wrongCount = 0
  while (i < (chunks as []).length && wrongCount === 0) {
    const formData = new FormData()
    formData.append('video', (chunks as any)[i].chunk)
    formData.append('chunkFileMD5', (chunks as any)[i].md5)
    formData.append('chunkFileIndex', (chunks as any)[i].index)
    const { data: res } = await uploadVideoAPI(formData)
    videoDialog.value = true
    if (res.status === 200) {
      handleChunkSuccessRemovesessionStorage(
        'chunkVideo',
        (chunks as any)[i].index
      )
      videoProgress.value = Math.floor((i / +totalChunks) * 100)
      i++
    } else {
      wrongCount++
      const { data: res } = await uploadVideoAPI(formData)
      if (res.status === 200) {
        wrongCount = 0
        handleChunkSuccessRemovesessionStorage(
          'chunkVideo',
          (chunks as any)[i].index
        )
        videoProgress.value = Math.floor((i / +totalChunks) * 100)
        i++
      } else {
        // 再次上传分片文件出错,则停止上传 return false
        ElMessage.error(res.message)
        break
      }
    }
  }

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (e) => {
    editFormData.value.videoSrc = e.target?.result as string
  }
  e.target.value = ''
  const { data: res } = await mergeVideoAPI(wrongCount)
  if (res.status === 200) {
    videoProgress.value = Math.floor((i / +totalChunks) * 100)
    editFormData.value.videoSrc = `${baseURL}/static/${res.fileName}` // 静态资源临时访问
    sessionStorage.setItem('video', `${baseURL}/static/${res.fileName}`) // 防止刷新后地址丢失
    videoDialog.value = false
    return ElMessage.success(res.message)
  } else {
    return ElMessage.error(res.message)
  }
}

// 提交
/**
 * 提交时打开websocket连接
 * 当后端上传文件到oss进度结束关闭websocket连接
 */
const submitProgress = ref(0)
const submitDialog = ref(false)
const submit = async () => {
  const id = JSON.parse(localStorage.getItem('user') as string).userData.id
  socket.emit('videoSubmit', `${id}`)
  socket.on('uploadOssProgress', (data) => {
    submitProgress.value = Math.round(data * 100)
  })
  submitDialog.value = true
  let res = null
  if (route.query.id) {
    res = await updateVideoAPI(editFormData.value)
  } else {
    // 提交时，清空sessionStorage内的video和videoPhoto 后端同时将先前上传的视频和图片上传到oss
    sessionStorage.removeItem('video')
    sessionStorage.removeItem('videoPhoto')
    res = await submitVideoAPI(editFormData.value)
  }
  if (res.data.status === 200) {
    socket.off('uploadOssProgress')
    submitDialog.value = false
    ElMessage.success(res.data.message)
  } else {
    ElMessage.error(res.data.message)
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
  removeVideoFile()
  editFormData.value.videoPhotosSrc = ''
  editFormData.value.videoSrc = ''
}

// 移除服务器本地暂存文件
const removeVideoFile = async () => {
  if (
    editFormData.value.videoSrc !== '' ||
    editFormData.value.videoPhotosSrc !== ''
  ) {
    const videoName: string = editFormData.value.videoSrc
      .split('/')
      .at(-1) as string
    const videoPhotoName: string = editFormData.value.videoPhotosSrc
      .split('/')
      .at(-1) as string
    const { data: res } = await removeVideoAPI({
      videoFileName: videoName,
      videoPhotoFileName: videoPhotoName
    })
    if (res.status !== 200) {
      console.log(res.errMessage)
      return ElMessage.error(res.message)
    }
    sessionStorage.removeItem('video')
    sessionStorage.removeItem('videoPhoto')
  }
}
</script>

<template>
  <div class="video-container">
    <el-form
      label-width="9.375rem"
      :model="editFormData"
      :rules="editFormRules"
      ref="editFormRef"
    >
      <el-form-item prop="edu">
        <template #label>
          <div class="edit-form-item-label">学院 / 专业 / 班级 :</div>
        </template>
        <el-cascader
          style="width: 15rem"
          v-model="editFormData.edu"
          :options="options"
          :props="{ checkStrictly: true }"
          clearable
        />
      </el-form-item>
      <el-form-item label="学科 :" prop="subjectId">
        <el-select
          style="width: 15rem"
          placeholder="请选择学科"
          clearable
          v-model="editFormData.subjectId"
        >
          <el-option
            v-for="item in subjectData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="视频名称 :" prop="videoName">
        <el-input
          style="width: 15rem"
          v-model="editFormData.videoName"
          placeholder="请输入视频名"
        />
      </el-form-item>
      <el-form-item label="视频封面图片 :" prop="videoName">
        <div class="video-upload-video-box">
          <div class="upload-input-box">
            <input
              class="upload-input"
              type="file"
              ref="choicePhotoFileInputref"
              accept=".jpg,.png"
              @change="handlePhotoBeforeUpload"
            />
            <el-button type="success" @click="openChoicePhotoFile">
              导入
            </el-button>
          </div>
          <el-image
            class="video-upload-photo-box"
            :src="editFormData.videoPhotosSrc"
            :preview-src-list="[editFormData.videoPhotosSrc]"
          >
            <template #error>
              <div class="image-slot">
                <el-icon><i-ep-picture /></el-icon>
                <p>请上传视频封面图片</p>
              </div>
            </template>
          </el-image>
        </div>
      </el-form-item>
      <el-form-item label="视频 :" prop="videoName">
        <div class="video-upload-video-box">
          <div class="upload-input-box">
            <input
              class="upload-input"
              type="file"
              ref="choiceVideoFileInputRef"
              accept=".mp4"
              @change="handleVideoBeforeUpload"
            />
            <el-button type="success" @click="openChoiceVideoFile">
              导入
            </el-button>
          </div>
          <video
            :src="editFormData.videoSrc"
            style="width: 50rem"
            controls
          ></video>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-dialog
    class="video-dialog"
    style="box-shadow: none; background: none"
    v-model="videoDialog"
    destroy-on-close
    align-center
    width="200"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <div class="video-dialog-progress">
      <el-progress type="circle" :percentage="videoProgress" />
    </div>
  </el-dialog>
  <el-dialog
    class="video-dialog"
    style="box-shadow: none; background: none"
    v-model="videoPhotoDialog"
    destroy-on-close
    align-center
    width="200"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <div class="video-dialog-progress">
      <el-progress type="circle" :percentage="videoProgress" />
    </div>
  </el-dialog>
  <el-dialog
    class="video-dialog"
    style="box-shadow: none; background: none"
    v-model="submitDialog"
    destroy-on-close
    align-center
    width="200"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <div class="video-dialog-progress">
      <el-progress type="circle" :percentage="submitProgress" />
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.video-container {
  .video-upload-video-box {
    display: flex;
    align-items: start;
    .upload-input-box {
      margin-right: 2.5rem;
      position: relative;

      .upload-input {
        position: absolute;
        display: none;
      }
    }
    .video-upload-photo-box {
      width: 37.5rem;
      height: 18.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .image-slot {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: var(--el-fill-color-light);
        color: var(--el-text-color-secondary);
        font-size: 30px;
        p {
          font-size: 1rem;
        }
      }
    }
  }
}
.video-dialog {
  .video-dialog-progress {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
