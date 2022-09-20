import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { message, notification } from 'ant-design-vue'
import config from '/config/config'
import { getUserInfo, login, logout } from '@/services/controller/user'
import { getAccessToken, removeAccessToken, setAccessToken } from '@/utils/accessToken'
import { timeFix } from '@/utils/util'
import { useStoreRoutes } from '@/store'
import { useStorePermission } from '@/store'
import { useStoreTabsRouter } from '@/store'

const { tokenName } = config.defaultSettings

export interface UserInfo {
  admin?: boolean;
  userId?: number;
  userName?: string;
  nickName?: string;
  avatar?: string;
  loginDate?: string;
}

export interface UserState {
  accessToken: string;
  userInfo: UserInfo;
  userName: string;
  loginName: string;
  avatar: string;
}

export const useStoreUser = defineStore('user', () => {
  const routes = useStoreRoutes()
  const auth = useStorePermission()
  const tabsRouter = useStoreTabsRouter()

  const state = reactive({
    accessToken: getAccessToken(),
    userInfo: {},
    userName: '',
    loginName: '',
    avatar: ''
  } as UserState)

  /**
   * @description 登录
   */
  const userLogin = async (params) => {
    const response: any = await login(params)
    const accessToken = response?.[tokenName]
    if (accessToken) {
      const expires = response?.expire
      state.accessToken = accessToken
      setAccessToken(accessToken, expires ? expires * 60 * 1000 : 0)
      return true
    }
    return false
  }

  /**
   * @description 获取用户信息
   */
  const queryUserInfo = async () => {
    const response: any = await getUserInfo()
    const { user, permissions } = response
    if (!user || Object.keys(user).length === 0) {
      message.error(`验证失败，请重新登录...`)
      return false
    }
    const { userName, avatar, nickName } = user as UserInfo
    if (userName && Array.isArray(permissions)) {
      auth.changeValue('permission', permissions)
      state.userName = userName
      state.loginName = nickName
      state.avatar = avatar
      state.userInfo = user
      notification.success({
        message: `欢迎登录${userName}`,
        description: `${timeFix()}！`
      })
    } else {
      message.error('用户信息接口异常')
      return false
    }
    return true
  }

  const updateUserInfo = (params: UserInfo) => {
    Object.assign(state.userInfo, { ...params })
  }

  /**
   * @description 用户退出登录
   */
  const userLogout = async () => {
    await logout({
      userName: state.userName
    })
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
    queryUserInfo,
    updateUserInfo,
    resetPermissions
  }
})
