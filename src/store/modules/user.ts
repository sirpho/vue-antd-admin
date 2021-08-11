/**
 * @author gx12358 2539306317@qq.com
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */
import { MutationTree, ActionTree } from 'vuex'
import { message, notification } from 'ant-design-vue'
import config from '/config/config'
import { getUserInfo, login, logout } from '/@/services/user'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken
} from '/@/utils/accessToken'
import { timeFix } from '/@/utils/util'

interface UserState {
  accessToken: string;
  username: string;
  avatar: string;
}

const { tokenName } = config.defaultSettings

const state = (): UserState => ({
  accessToken: getAccessToken(),
  userInfo: {},
  username: '',
  avatar: ''
})
const getters = {
  accessToken: (state): string => state.accessToken,
  userInfo: (state): string => state.userInfo,
  username: (state): string => state.username,
  avatar: (state): string => state.avatar
}
const mutations: MutationTree<any> = {
  /**
   * @author gx12358 2539306317@qq.com
   * @description 设置accessToken
   * @param {*} state
   * @param {*} accessToken
   */
  setAccessToken(state: UserState, accessToken: string) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 设置userInfo
   * @param {*} state
   * @param {*} userInfo
   */
  setUserInfo(state: UserState, userInfo: any) {
    state.userInfo = userInfo
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 设置用户名
   * @param {*} state
   * @param {*} username
   */
  setUsername(state: UserState, username: string) {
    state.username = username
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 设置头像
   * @param {*} state
   * @param {*} avatar
   */
  setAvatar(state: UserState, avatar: string) {
    state.avatar = avatar
  }
}
const actions: ActionTree<UserState, any> = {
  /**
   * @author gx12358 2539306317@qq.com
   * @description 登录拦截放行时，设置虚拟角色
   * @param {*} { commit, dispatch }
   */
  setVirtualRoles({ commit, dispatch }) {
    dispatch('acl/setFull', true, { root: true })
    commit('setAvatar', 'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif')
    commit('setUsername', 'admin(未开启登录拦截)')
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 登录
   * @param {*} { commit }
   * @param {*} userInfo
   */
  async login({ commit }, userInfo) {
    const { data } = await login(userInfo)
    const accessToken = data[tokenName]
    if (accessToken) {
      commit('setAccessToken', accessToken)
    } else {
      message.error(`登录接口异常，未正确返回${tokenName}...`)
    }
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 获取用户信息接口 这个接口非常非常重要，如果没有明确底层前逻辑禁止修改此方法，错误的修改可能造成整个框架无法正常使用
   * @param {*} { commit, dispatch, state }
   * @returns
   */
  async getUserInfo({ commit, dispatch, state }) {
    const { data } = await getUserInfo(state.accessToken)
    if (!data) {
      message.error(`验证失败，请重新登录...`)
      return false
    }
    const { username, avatar, roles, ability, nickName } = data
    if (username && roles && Array.isArray(roles)) {
      dispatch('acl/setRole', roles, { root: true })
      if (ability && ability.length > 0)
        dispatch('acl/setAbility', ability, { root: true })
      commit('setUsername', username)
      commit('setAvatar', avatar)
      commit('setUserInfo', data)
      notification.success({
        message: `欢迎登录${nickName}`,
        description: `${timeFix()}！`
      })
    } else {
      message.error('用户信息接口异常')
    }
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 退出登录
   * @param {*} { dispatch }
   */
  async logout({ dispatch, state }) {
    await logout({
      userName: state.username
    })
    await dispatch('resetAll')
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 重置accessToken、roles、ability、router等
   * @param {*} { commit, dispatch }
   */
  async resetAll({ dispatch }) {
    await dispatch('setAccessToken', '')
    await dispatch('acl/setFull', false, { root: true })
    await dispatch('acl/setRole', [], { root: true })
    await dispatch('acl/setAbility', [], { root: true })
    removeAccessToken()
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 设置token
   */
  setAccessToken({ commit }, accessToken) {
    commit('setAccessToken', accessToken)
  }
}
export default { state, getters, mutations, actions }
