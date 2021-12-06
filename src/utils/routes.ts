import { cloneDeep } from 'lodash-es'
import config from '/config/config'
import { usePermissions } from '@gx-design/pro-hooks/web'
import { getMaxFloor } from '/@/utils/util'

const { rolesControl } = config.defaultSettings

let dynamicViewsModules: Record<string, () => Promise<Recordable>>

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: () => import('/@/layout/BasicLayout.vue'), // 基础页面布局，包含了头部导航，侧边栏和通知栏
  PageView: () => import('/@/layout/PageView.vue'),
  IframeView: () => import('/@/layout/IframeView.vue')
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
      path: parent && parent.path
        ? `${parent.path === '/'
          ? ''
          : (parent.path || '')}/${item.path}`
        : `/${item.path}`,
      // 路由名称，建议唯一
      name: item.name || '',
      // 该路由对应页面的 组件 优先根据组件名或者key从constantRouterComponents获取，没有则通过组件名地址查询
      component:
        constantRouterComponents[item.component || item.key] ||
        loadView(item.component),
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: item.title || '',
        tagFixed: item.tagFixed,
        tagHidden: item.tagHidden,
        icon: item.icon || undefined,
        homePage: item.homePage || 0,
        iconType: item.iconType || undefined,
        hideInMenu: item.hidden || false,
        target: item.target,
        targetStatus: item.targetStatus
      }
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
  let arr: any[] = []
  const menus: any[] = []
  if (getMaxFloor(cloneDeep(rows)) > 1) {
    arr = buildMenu(rows)
  } else {
    buildtree(rows, arr, 0)
  }
  arr.forEach((row: any) => {
    menus.push(row)
  })
  rootRouter.children = menus
  rootRouter.children.push({
    key: 'externalLink',
    path: '/externalLink',
    meta: {
      hidden: true,
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
 * @description 将后台树形结构菜单数据添加后修改属性（具体修改看后台返回值）
 */
export function buildMenu(list: any[]) {
  return list.map((item: any) => {
    const {
      title = '',
      icon = '',
      iconType = 1,
      tagFixed = '1',
      tagHidden = '0',
      homePageFlag = 0,
      isFrame = '1',
      outLinkType = 0
    } = item.meta
    const child = {
      title,
      level: 'tree',
      name: item.name,
      key: item.name,
      icon: icon,
      iconType: iconType || 1,
      hidden: item.hidden,
      homePage: homePageFlag,
      path: item.path && item.path.length > 0
        ? item.path
        : undefined,
      component: item.component,
      redirect: item.redirect === 'noRedirect'
        ? ''
        : item.redirect,
      tagFixed: tagFixed === '0',
      tagHidden: tagHidden === '1',
      target: isFrame === '0' ? item.path : '',
      targetStatus: outLinkType || 0,
      children: item.children && item.children.length > 0
        ? buildMenu(item.children)
        : []
    }
    return child
  })
}

/**
 * @Author      gx12358
 * @DateTime    2021/5/14
 * @lastTime    2021/5/14
 * @description 将后台菜单数据变成树形结构（具体修改看后台返回值）
 */
export function buildtree(list: any[], arr: any[], parentId: string | number) {
  list.forEach((item: any) => {
    if (item.parentId === parentId) {
      const child: any = {
        level: 'flat',
        title: item.menuName,
        name: item.menuName,
        key: item.path,
        icon: item.icon,
        iconType: item.iconType || 1,
        hidden: item.visible === '1',
        path: item.path && item.path.length > 0
          ? item.path
          : undefined,
        component: item.component,
        redirect: item.redirect === 'noRedirect'
          ? ''
          : item.redirect,
        tagFixed: item.tagFixed === '0',
        tagHidden: item.tagHidden === '1',
        target: item.isFrame === '0' ? item.path : '',
        targetStatus: item.outLinkType || 0,
        children: []
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
        return !rolesControl || usePermissions(route.meta.roles)
      else return true
    })
    .map((route: any) => {
      route.fullPath = route.path
      if (route.children)
        route.children = filterRoutes(route.children)
      return route
    })
}
