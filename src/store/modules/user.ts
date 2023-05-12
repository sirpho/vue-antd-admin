import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { notification } from 'ant-design-vue'
import config from '/config/config'
import { login } from '@/services/controller/user'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
  setPermission,
  removePermission,
  getUserInfo,
  setUserInfo,
  removeUserInfo
} from '@/utils/accessToken'
import { useStoreRoutes } from '@/store'
import { useStorePermission } from '@/store'
import { useStoreTabsRouter } from '@/store'

const { tokenName, cacheDataOnRefresh } = config.defaultSettings
export interface UserInfo {
  id: number
  uname: string
  uid: string
}

export interface UserState {
  accessToken: string
  userInfo: UserInfo
}

export const useStoreUser = defineStore('user', () => {
  const routes = useStoreRoutes()
  const auth = useStorePermission()
  const tabsRouter = useStoreTabsRouter()

  const state = reactive({
    accessToken: cacheDataOnRefresh ? getAccessToken() : '',
    userInfo: cacheDataOnRefresh ? getUserInfo() : {}
  } as UserState)

  /**
   * @description 登录
   */
  const userLogin = async (params) => {
    const response: any = await login(params)
    const accessToken = response.data?.[tokenName]
    if (accessToken) {
      const expires = response.data?.expire
      state.accessToken = accessToken
      const { permissions, user } = response.data
      auth.changeValue('permission', permissions)
      state.userInfo = user
      setAccessToken(accessToken, expires ? expires * 60 * 1000 : 0)
      setPermission(permissions, expires ? expires * 60 * 1000 : 0)
      setUserInfo(user, expires ? expires * 60 * 1000 : 0)
      notification.success({
        message: `欢迎登录${user.uname}`,
      })
      return true
    }
    return false
  }

  /**
   * @description 用户退出登录
   */
  const userLogout = async () => {
    resetPermissions()
  }

  const resetPermissions = () => {
    state.accessToken = ''
    setAccessToken('')
    auth.changeValue('permission', [])
    routes.resetRoute()
    tabsRouter.blankingTabs()
    removeAccessToken()
    removePermission()
    removeUserInfo()
  }

  return {
    ...toRefs(state),
    userLogin,
    userLogout,
    resetPermissions
  }
})
