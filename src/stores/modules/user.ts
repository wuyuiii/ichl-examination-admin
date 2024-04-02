import { getUserInfoAPI } from '@/api/user'
import type { User } from '@/interface'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const userData = ref<User>({})

    const setUserData = (data: User) => {
      userData.value = data
    }

    const getUserData = async (id: number = userData.value.id as number) => {
      const { data: res } = await getUserInfoAPI(id)
      if (res.status === 200) {
        setUserData(res.data)
      } else {
        ElMessage.error(res.message)
      }
    }
    return {
      userData,
      setUserData,
      getUserData
    }
  },
  {
    persist: {
      paths: ['userData']
    }
  }
)
