import type { RouteRecord, RouteRecordRaw } from 'vue-router'
import type { MenuDataItem } from '../typings'

export { default as isUrl } from './isUrl'
export { default as isImg } from './isImg'

export function clearMenuItem(menusData: RouteRecord[] | RouteRecordRaw[]): RouteRecordRaw[] {
  return menusData
    .map((item: RouteRecord | RouteRecordRaw) => {
      const finalItem = { ...item }
      if (!finalItem.name || finalItem.meta?.hideInMenu) {
        return null
      }

      if (finalItem && finalItem?.children) {
        if (
          finalItem.children.some(
            (child: RouteRecord | RouteRecordRaw) => child && child.name && !child.meta?.hideInMenu
          )
        ) {
          return {
            ...item,
            children: clearMenuItem(finalItem.children)
          }
        }
        delete finalItem.children
      }
      return finalItem
    })
    .filter(item => item) as RouteRecordRaw[]
}

export function flatMap(menusData: RouteRecord[] | RouteRecordRaw[]): RouteRecordRaw[] {
  return menusData
    .map(item => {
      const finalItem = { ...item } as MenuDataItem
      if (!finalItem.name || finalItem.meta?.hideInMenu) {
        return null
      }
      finalItem.linkPath = getMenuFirstLastChildPath(finalItem.children || [])

      if (finalItem.children) {
        delete finalItem.children
      }
      return finalItem
    })
    .filter(item => item) as any[]
}

export function getMenuFirstChildren(menus: MenuDataItem[], key?: string) {
  const menuKey = (key || '').split('/').length === 2
    ? (key || '')
    : `/${(key || '').split('/')[1]}`
  return key === undefined
    ? []
    : (menus[menus.findIndex(menu => menu.path === menuKey)] || {}).children || []
}

export function getMenuFirstLastChildPath(data: MenuDataItem[]): string {
  let newPath = ''
  const getRoutePath = function (newdata) {
    let firstPath = ''
    if (newdata.children && newdata.children.length > 0) {
      firstPath = getRoutePath(newdata.children[0])
    } else {
      firstPath = `${newdata.path}`
    }
    return firstPath
  }
  if (data.length > 0 && data[0].children && data[0].children.length > 0) {
    newPath = getRoutePath(data[0].children[0])
  } else {
    newPath = data.length > 0 ? data[0].path : ''
  }
  return newPath
}

export interface Attrs {
  [key: string]: string;
}

export type StringKeyOf<T> = Extract<keyof T, string>;

export type EventHandlers<E> = {
  [K in StringKeyOf<E>]?: E[K] extends Function ? E[K] : (payload: E[K]) => void;
};
