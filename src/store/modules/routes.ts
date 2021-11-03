/**
 * @author gx12358 2539306317@qq.com
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
import { asyncRoutes, constantRoutes, basicRoutes } from '/@/router'
import { getRouterList } from '/@/services/controller/router'
import { filterRoutes, generator, getRootMenu } from '/@/utils/routes'
import { getFirstLastChild } from '/@/utils/routeConvert'
import { getLevelData } from '/@/utils/util'

const state = () => ({
  routerLoading: false,
  routerLoadList: [],
  meunLoading: false,
  routes: [],
  partialRoutes: []
})
const getters = {
  routes: (state) => state.routes,
  meunLoading: (state) => state.meunLoading,
  routerLoading: (state) => state.routerLoading,
  routerLoadList: (state) => state.routerLoadList,
  partialRoutes: (state) => state.partialRoutes
}
const mutations = {
  setMeunLoading(state, type) {
    state.meunLoading = type
  },
  setRouterLoadList(state, path) {
    state.routerLoadList.push(path)
  },
  toggleRouterLoading: (state, loading) => {
    state.routerLoading = loading
  },
  setRoutes(state, routes) {
    state.routes = routes
  },
  setPartialRoutes(state, routes) {
    state.partialRoutes = routes
  }
}
const actions = {
  /**
   * @author gx12358 2539306317@qq.com
   * @description 修改菜单loading状态
   * @param {*} { commit }
   * @returns
   */
  async setMeunLoading({ commit }, state) {
    commit('setMeunLoading', state)
  },
  async setHeaderRoutes({ commit }, data) {
    commit('setHeaderRoutes', data)
  },
  toggleRouterLoading({ commit }, loading) {
    commit('toggleRouterLoading', loading)
  },
  setRouterLoadList({ commit }, path) {
    commit('setRouterLoadList', path)
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description intelligence模式设置路由
   * @param {*} { commit }
   * @returns
   */
  async setRoutes({ commit }) {
    commit('setMeunLoading', true)
    const finallyRoutes = filterRoutes([ ...constantRoutes, ...asyncRoutes ])
    commit('setMeunLoading', false)
    commit('setRoutes', finallyRoutes)
    return [ ...asyncRoutes ]
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description all模式设置路由
   * @param {*} { commit }
   * @returns
   */
  async setAllRoutes({ commit }) {
    commit('setMeunLoading', true)
    const { data } = await getRouterList()
    const notFoundRouter = {
      path: '/:path(.*)*',
      redirect: '/exception/404',
      hidden: true
    }
    const rootMenu = getRootMenu(data)
    const asyncRoutes = generator(rootMenu)
    asyncRoutes[0].children = [ ...asyncRoutes[0].children, ...basicRoutes ]
    const haveHomePage = getLevelData(asyncRoutes[0].children)
      .find(item => item.meta ? item.meta.homePage === 1 : false)
    asyncRoutes[0].redirect = haveHomePage ? haveHomePage.path : getFirstLastChild(asyncRoutes[0].children)
    asyncRoutes.push(notFoundRouter)
    commit('setRoutes', asyncRoutes)
    return [ ...asyncRoutes ]
  },
  /**
   * @author gx12358 2539306317@qq.com
   * @description 画廊布局、综合布局设置路由
   * @param {*} { commit }
   * @param accessedRoutes 画廊布局、综合布局设置路由
   */
  setPartialRoutes({ commit }, accessedRoutes) {
    commit('setPartialRoutes', accessedRoutes)
  }
}
export default { state, getters, mutations, actions }
