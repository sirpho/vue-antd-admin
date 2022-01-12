import type { RouteRecordRaw } from 'vue-router'
export { clearMenuItem, flatMap, getMenuFirstChildren } from './index'

export type MenuData = {
  menuData: RouteRecordRaw[];
  breadcrumb: RecordType;
};

const formatRelativePath = (
  routes: RouteRecordRaw[],
  breadcrumb: RecordType
): RouteRecordRaw[] => {
  // 计算路由绝对路径
  return routes.map(route => {
    route.path = route.path.replace('//', '/')
    // format children routes
    if (route.children && route.children.length > 0) {
      route.children = formatRelativePath(route.children, breadcrumb)
    }
    breadcrumb[`${route.path}`] = route
    return route
  })
}

export const getMenuData = (routes: RouteRecordRaw[]): MenuData => {
  const childrenRoute = routes.find(route => route.path === '/')
  const breadcrumb: RecordType = {}
  return {
    menuData: formatRelativePath(childrenRoute?.children || ([] as RouteRecordRaw[]), breadcrumb),
    breadcrumb
  }
}
