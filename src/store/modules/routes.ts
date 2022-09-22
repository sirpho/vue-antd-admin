import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { asyncRoutes, basicRoutes } from '@/router'
import { getRouterList } from '@/services/controller/router'
import { generator, getRootMenu } from '@/utils/routes'
import { getFirstLastChild } from '@/utils/routeConvert'
import { getLevelData } from '@/utils/util'
import { useStorePermission } from '@/store'

/**
 * @description store-routes 路由
 */
export interface RoutesState {
  routes: AppRouteModule[]
  routerLoadList: string[]
  menuLoading: boolean
  routerLoading: boolean
  initialized: boolean
}

export const useStoreRoutes = defineStore('routes', () => {
  const state = reactive({
    routes: [],
    routerLoadList: [],
    menuLoading: false,
    routerLoading: false,
    initialized: false
  } as RoutesState)
  const storePermission = useStorePermission()

  /**
   * @description intelligence（前端静态路由）模式设置路由
   */
  const setRoutes = () => {
    state.menuLoading = true
    let finallyRoutes = [...asyncRoutes]
    const { permission } = storePermission
    // 获取已授权的菜单
    const getAuthorized = (routes: AppRouteModule[]) => {
      const result = []
      for (const item of routes) {
        let hasPermission = true
        const { authority } = item
        if(authority) {
            hasPermission = permission.some((p) => authority.includes(p))
        }
        if (hasPermission) {
          if (item.children && item.children.length > 0) {
            item.children = getAuthorized(item.children)
          }
          result.push(item)
        }
      }
      return result
    }

    // 设置重定向为其下第一个菜单
    const setRedirect = (routes: AppRouteModule[]) => {
      for (const item of routes) {
        if (item.children && item.children.length > 0) {
          item.redirect = item.redirect || getFirstLastChild(item.children)
          setRedirect(item.children)
        }
      }
    }

    finallyRoutes = getAuthorized(finallyRoutes)
    setRedirect(finallyRoutes)

    state.routes = finallyRoutes
    state.menuLoading = false
    return [...finallyRoutes]
  }

  /**
   * @description all（后端动态路由）模式设置路由
   */
  const setAllRoutes = async () => {
    let routes: AppRouteModule[] = []
    state.menuLoading = true
    const response: ResponseResult<MenuDataItem[]> = await getRouterList()
    if (response && response?.data?.length) {
      const notFoundRouter: AppRouteModule = {
        path: '/:path(.*)*',
        redirect: '/exception/404',
        hidden: true
      }
      const rootMenu = getRootMenu(response?.data || [])
      const asyncRoutes = generator(rootMenu)
      asyncRoutes[0].children = [...(asyncRoutes[0]?.children || []), ...basicRoutes]
      const haveHomePage = getLevelData(asyncRoutes[0].children).find((item) =>
        item.meta ? item.meta.homePage === 1 : false
      )
      asyncRoutes[0].redirect = haveHomePage
        ? haveHomePage.path
        : getFirstLastChild(asyncRoutes[0].children)
      asyncRoutes.push(notFoundRouter)
      routes = [...asyncRoutes]
    }
    state.routes = routes
    state.menuLoading = false
    return routes
  }

  /**
   * @description 重置路由
   */
  const resetRoute = () => {
    state.routes = []
    state.routerLoadList = []
    state.initialized = false
  }

  /**
   * @description 添加路由记录
   */
  const addRouterLoadList = (path) => {
    state.routerLoadList.push(path)
  }

  /**
   * @description 修改state状态
   */
  const changeValue = (type, value) => {
    state[type] = value
  }

  return {
    ...toRefs(state),
    setRoutes,
    setAllRoutes,
    resetRoute,
    addRouterLoadList,
    changeValue
  }
})
