import BasicLayout from '/@/layout/BasicLayout.vue'
import PageView from '/@/layout/PageView.vue'
import config from '/config/config'
import { hasRole } from '/@/utils/hasRole'

const { rolesControl } = config.defaultSettings

let dynamicViewsModules: Record<string, () => Promise<Recordable>>

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout, // 基础页面布局，包含了头部导航，侧边栏和通知栏
  PageView: PageView
  // 你需要动态引入的页面组件
}
/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 本地菜单路由
 */
const rootRouter: any = {
  path: '/',
  name: 'index',
  meta: { title: 'Home' },
  component: 'BasicLayout',
  redirect: '',
  children: []
}

/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 获取当前path的component
 */
export const loadView = (view: string) => {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../views/**/*.{vue,tsx}')
  // 路由懒加载
  return dynamicImport(dynamicViewsModules, view)
}

function dynamicImport(
  dynamicViewsModules: Record<string, () => Promise<Recordable>>,
  component: string
) {
  const keys = Object.keys(dynamicViewsModules)
  const matchKeys = keys.filter((key: string) => {
    let k = key.replace('../views', '')
    const lastIndex = k.lastIndexOf('.')
    k = k.substring(0, lastIndex)
    return k === `/${component}`
  })
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0]
    return dynamicViewsModules[matchKey]
  }
  if (matchKeys?.length > 1) {
    return
  }
}

/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 格式化 后端 结构信息并递归生成层级路由表
 */
export const generator = (routerMap: any[], parent?) => {
  return routerMap.map((item: any) => {
    const currentRouter: any = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${(parent && parent.path) || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件 优先根据组件名或者key从constantRouterComponents获取，没有则通过组件名地址查询
      component:
        constantRouterComponents[item.component || item.key] ||
        loadView(item.component),
      hideChildrenInMenu: item.hideChildrenInMenu || false,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: item.title,
        fixed: item.fixed,
        icon: item.icon || undefined,
        iconType: item.iconType || undefined,
        hiddenHeaderContent: item.hiddenHeaderContent || false,
        target: item.target
      }
    }
    // 隐藏菜单
    if (item.hidden) {
      currentRouter.hideInMenu = true
    }
    // 是否设置了隐藏子菜单
    if (item.hideChildrenInMenu) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 将后台树形数据菜单和本地菜单结合
 */
export function getRootMenu(rows: any[]) {
  // 根菜单
  const rootMenu: any = []
  const arr = []
  const menus: any[] = []
  buildtree(rows, arr, 0)
  arr.forEach((row: any) => {
    menus.push(row)
  })
  rootRouter.children = menus
  rootRouter.children.push({
    key: 'externalLink',
    path: '/externalLink',
    meta: {
      hideInMenu: true,
      title: '外链地址'
    }
  })
  rootMenu.push(rootRouter)
  return rootMenu
}

/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 将后台菜单数据变成树形结构
 */
export function buildtree(list: any[], arr: any[], parentId: string | number) {
  list.forEach((item: any) => {
    if (item.parentId === parentId) {
      const child: any = {
        title: item.menuName,
        key: item.menuKey,
        icon: item.icon,
        iconType: item.iconType,
        hidden: item.visible === '1',
        path: item.path && item.path.length > 0 ? item.path : undefined,
        component: item.component,
        redirect: item.redirect,
        fixed: item.fixed,
        target: item.target,
        hideChildrenInMenu: item.hiddenChildren,
        hiddenHeaderContent: item.hiddenHeader,
        children: [],
        systemCategory: item.systemCategory
      }
      buildtree(list, child.children, item.menuId)
      if (child.children.length === 0) {
        delete child.children
      }
      arr.push(child)
    }
  })
}

/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 根据roles数组拦截路由
 */
export function filterRoutes(routes: any[]) {
  return routes
    .filter((route: any) => {
      if (route.meta && route.meta.roles)
        return !rolesControl || hasRole(route.meta.roles)
      else return true
    })
    .map((route: any) => {
      route.fullPath = route.path
      if (route.children)
        route.children = filterRoutes(route.children)
      return route
    })
}
