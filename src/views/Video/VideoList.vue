<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { VideoListType, VideoDataType, SubjectDataType } from '@/interface'
import { delVideoAPI, getVideoListAPI } from '@/api/video'
import { useOptionStore, useUserStore } from '@/stores'
import { formatDate } from '@/utils/format'
import { getSubjectListAPI2 } from '@/api/subject'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const optionStore = useOptionStore()
const subjectData = ref<SubjectDataType[]>([])
const videoData = ref<VideoDataType[]>([])
const total = ref(0)
const loading = ref(false)
const videoListParams = ref<VideoListType>({
  id: userStore.userData.id as number, // 用户id,
  pageIndex: 1,
  pageSize: 10,
  subjectId: '',
  keyword: ''
})

// 获取学科列表
const getSubjectList = async () => {
  const { data: res } = await getSubjectListAPI2()
  if (res.status === 200) {
    subjectData.value = res.data
  }
}
getSubjectList()

// 获取视频列表
const getVideoList = async () => {
  const { data: res } = await getVideoListAPI(videoListParams.value)
  if (res.status === 200) {
    videoData.value = res.data
    total.value = res.total
  }
}
getVideoList()

// 视频创编
const edit = (row: VideoDataType) => {
  const index = optionStore.tagBar.findIndex(
    (item) => item.items.path == `${route.matched[1].path}/edit`
  )
  if (index !== -1) {
    optionStore.tagBar[index].current = row.id
      ? `${route.matched[1].path}/edit?id=${row.id}`
      : `${route.matched[1].path}/edit`
  }
  router.push({
    path: `${route.matched[1].path}/edit`,
    query: { id: row.id }
  })
}

// 删除视频
const remove = async (row: VideoDataType) => {
  ElMessageBox.confirm(
    `${t('VIDEO.DELETE_VIDEO_CONTENT')}：${row.video_name}`,
    t('VIDEO.DELETE_VIDEO_TITLE'),
    {
      type: 'error'
    }
  ).then(async () => {
    const { data: res } = await delVideoAPI(row.id as any)
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: res.message
      })
      getVideoList()
    } else {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}

// 切换每页条数
const handleSizeChange = (value: number) => {
  videoListParams.value.pageSize = value
  getVideoList()
}

// 切换分页
const handleCurrentChange = (value: number) => {
  videoListParams.value.pageIndex = value
  getVideoList()
}
</script>

<template>
  <div class="videoList-container">
    <div class="videoList-search">
      <el-input
        class="videoList-search-input"
        v-model="videoListParams.keyword"
        :placeholder="$t('VIDEO.VIDEO_NAME_PLACEHOLDER')"
        :prefix-icon="Search"
        @change="getVideoList"
      />
      <el-select
        class="videoList-search-input"
        v-model="videoListParams.subjectId"
        :placeholder="$t('QUESTION.SUBJECT_PLACEHOLDER')"
        clearable
        @change="getVideoList"
      >
        <el-option
          v-for="item in subjectData"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </el-select>
      <el-button style="margin-right: 1.25rem" type="primary" @click="edit">
        {{ $t('VIDEO.ADD') }}
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="videoData"
      style="width: 100%; margin-bottom: 1.875rem"
      border
    >
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="subject_id.name" :label="$t('SUBJECT.SUBJECT')" />
      <el-table-column prop="video_name" :label="$t('VIDEO.VIDEO_NAME')" />
      <el-table-column :label="$t('VIDEO.CREATE_TIME')">
        <template #default="{ row }">
          {{ formatDate(row.create_time, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('VIDEO.CREATE_USER')">
        <template #default="{ row }">
          <el-tag type="success">{{ row.create_user_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('VIDEO.OPERATE')">
        <template #default="{ row }">
          <el-button type="primary" size="small" plain @click="edit(row)">
            {{ $t('VIDEO.EDIT') }}
          </el-button>
          <el-button type="danger" size="small" plain @click="remove(row)">
            {{ $t('VIDEO.DELETE') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[10, 20, 30]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.videoList-container {
  .videoList-search {
    display: flex;
    width: 50%;
    margin-bottom: 1.25rem;
    .videoList-search-input {
      flex: 1;
      margin-right: 0.875rem;
    }
  }
}
</style>
