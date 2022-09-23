import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { notification } from 'ant-design-vue'
import config from '/config/config'
import { login } from '@/services/controller/user'
import { getAccessToken, removeAccessToken, setAccessToken } from '@/utils/accessToken'
import { timeFix } from '@/utils/util'
import { useStoreRoutes } from '@/store'
import { useStorePermission } from '@/store'
import { useStoreTabsRouter } from '@/store'

const { tokenName } = config.defaultSettings

export interface UserInfo {
  id: number;
  uname: string;
  uid: string;
}

export interface UserState {
  accessToken: string;
  userInfo: UserInfo;
}

export const useStoreUser = defineStore('user', () => {
  const routes = useStoreRoutes()
  const auth = useStorePermission()
  const tabsRouter = useStoreTabsRouter()

  const state = reactive({
    accessToken: getAccessToken(),
    // accessToken: '',
    userInfo: {},
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
      const {permissions, user} = response.data
      setAccessToken(accessToken, expires ? expires * 60 * 1000 : 0)
      auth.changeValue("permission", permissions)
      state.userInfo = user
      notification.success({
        message: `欢迎登录${user.uname}`,
        description: `${timeFix()}！`
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
  }

  return {
    ...toRefs(state),
    userLogin,
    userLogout,
    resetPermissions
  }
})
