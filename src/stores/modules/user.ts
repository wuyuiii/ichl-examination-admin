import type { User } from '@/interface'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userData = ref<User>({})

  const setUserData = (data: User) => {
    userData.value = data
  }
  return {
    userData,
    setUserData
  }
})
