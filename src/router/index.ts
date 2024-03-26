import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import config from '/config/config'
import BlankLayout from '@/layout/BlankLayout.vue'
import UserLayout from '@/layout/UserLayout.vue'

const { routerMode } = config.defaultSettings

function handleRouterMode() {
  switch (routerMode) {
    case 'hash':
      return createWebHashHistory()
      break
    case 'browser':
      return createWebHistory()
      break
    default:
      return createWebHashHistory()
      break
  }
}

export const constantRoutes: AppRouteModule[] = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    children: [
      {
        path: '/user/login',
        name: 'Login',
        meta: {
          hideInMenu: true,
          title: '登录'
        },
        component: () => import('@/views/dashboard/workplace/index.vue')
      }
    ]
  },
  {
    path: '/exception',
    name: 'Exception',
    component: BlankLayout,
    redirect: '/exception/403',
    meta: {
      hideInMenu: true,
      title: '错误页',
      icon: 'error-warning-line'
    },
    children: [
      {
        path: '/exception/403',
        name: 'Error403',
        component: () => import('@/views/exception/403/index.vue'),
        meta: {
          hideInMenu: true,
          title: '403',
          icon: 'error-warning-line'
        }
      },
      {
        path: '/exception/404',
        name: 'Error404',
        component: () => import('@/views/exception/404/index.vue'),
        meta: {
          hideInMenu: true,
          title: '404',
          icon: 'error-warning-line'
        }
      }
    ]
  }
]
export const basicRoutes: AppRouteModule[] = [
  {
    path: '/workplace',
    name: 'Workplace',
    component: () => import('@/views/dashboard/workplace/index.vue'),
    meta: {
      tagHidden: true,
      hideInMenu: true,
      homePage: 1,
      title: '工作台'
    }
  }
]
export const asyncRoutes: AppRouteModule[] = [
  {
    path: '/',
    component: () => import('@/layout/BasicLayout.vue'),
    name: 'index',
    redirect: '/workplace',
    meta: {
      hideInMenu: false,
      title: '首页'
    },
    children: [
      {
        path: '/workplace',
        name: 'Workplace',
        component: () => import('@/views/dashboard/workplace/index.vue'),
        meta: {
          title: '主页',
          hideInMenu: true
        }
      },
      {
        path: '/example',
        name: '示例模块',
        authority: 'example',
        meta: {
          title: '示例模块',
          tagFixed: false,
          tagHidden: false,
          icon: 'account-book-outlined',
          hideInMenu: false
        },
        children: [
          {
            path: '/example/language',
            component: () => import('@/views/example/language/index'),
            name: '开发语言管理',
            authority: 'example:language',
            meta: {
              title: '开发语言管理',
              tagFixed: false,
              tagHidden: false,
              icon: 'beer',
              iconType: 'iconfont',
              hideInMenu: false
            },
          },
          {
            path: '/example/compiler',
            component: () => import('@/layout/PageViewTab.vue'),
            name: '编译器管理',
            authority: 'example:compiler',
            meta: {
              title: '编译器管理',
              tagFixed: false,
              tagHidden: false,
              icon: 'table-report',
              iconType: 'iconfont',
              hideInMenu: false
            },
            children: [
              {
                path: '/example/compiler/java',
                component: () => import('@/views/example/compiler/java/index'),
                name: 'java编译器',
                authority: 'example:compiler:java',
                meta: {
                  title: 'java编译器',
                  tagFixed: false,
                  tagHidden: false,
                  icon: 'table-report',
                  iconType: 'iconfont',
                  hideInMenu: true,
                  subTab: true
                },
              },
              {
                path: '/example/compiler/python',
                component: () => import('@/views/example/compiler/python/index'),
                name: 'python编译器',
                authority: 'example:compiler:python',
                meta: {
                  title: 'python编译器',
                  tagFixed: false,
                  tagHidden: false,
                  icon: 'table-report',
                  iconType: 'iconfont',
                  hideInMenu: true,
                  subTab: true
                },
              },
            ]
          },
          {
            path: '/example/computer',
            component: () => import('@/views/example/computer/list/index'),
            name: '计算机管理',
            authority: 'example:language',
            meta: {
              title: '计算机管理',
              tagFixed: false,
              tagHidden: false,
              icon: 'beer',
              iconType: 'iconfont',
              hideInMenu: false
            },
          },
          {
            path: '/example/computer/add/:code',
            component: () => import('@/views/example/computer/edit/index'),
            name: '新增计算机',
            meta: {
              title: '新增计算机',
              tagFixed: false,
              tagHidden: false,
              icon: 'file-text-outlined',
              hideInMenu: true
            }
          },
          {
            path: '/example/visualization',
            component: () => import('@/views/example/visualization/index'),
            name: '可视化管理',
            authority: 'example:visualization',
            meta: {
              title: '可视化管理',
              tagFixed: false,
              tagHidden: false,
              icon: 'beer',
              iconType: 'iconfont',
              hideInMenu: false
            },
          },
        ]
      },
    ]
  },
  {
    path: '/:path(.*)*',
    redirect: '/exception/404',
    hidden: true
  }
]

const router = createRouter({
  history: handleRouterMode(),
  routes: constantRoutes as unknown as RouteRecordRaw[]
})

export default router
