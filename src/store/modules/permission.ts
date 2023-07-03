import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { getPermission } from '@/utils/accessToken'
import config from '/config/config'
const { cacheDataOnRefresh } = config.defaultSettings
export const useStorePermission = defineStore('permission', () => {
  const state = reactive({
    permission: cacheDataOnRefresh ? getPermission() : []
  })

  const changeValue = (type: string, value: any) => {
    state[type] = value
  }

  const hasPermission = (value: string) => {
    return state.permission.includes(value)
  }

  return {
    ...toRefs(state),
    changeValue,
    hasPermission
  }
})
