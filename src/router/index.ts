import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import type { AppRouteModule } from '/@/router/types'
import BasicLayout from '/@/layout/BasicLayout.vue'
import BlankLayout from '/@/layout/BlankLayout.vue'
import PageView from '/@/layout/PageView.vue'
import UserLayout from '/@/layout/UserLayout.vue'
import config from '/config/config'

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
    hidden: true,
    children: [
      {
        path: '/user/login',
        name: 'Login',
        component: () => import('/@/views/User/login/index.vue')
      }
    ]
  },
  {
    path: '/exception',
    name: 'Exception',
    component: BlankLayout,
    redirect: '/exception/403',
    hidden: true,
    meta: {
      title: '错误页',
      icon: 'error-warning-line'
    },
    children: [
      {
        path: '/exception/403',
        name: 'Error403',
        component: () => import('/@/views/exception/403/index.vue'),
        meta: {
          title: '403',
          icon: 'error-warning-line'
        }
      },
      {
        path: '/exception/404',
        name: 'Error404',
        component: () => import('/@/views/exception/404/index.vue'),
        meta: {
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
    component: () => import('/@/views/workplace/index.vue'),
    meta: {
      homePage: true,
      sideMenuHidden: true,
      title: '工作台'
    }
  }
]
export const asyncRoutes: AppRouteModule[] = [
  {
    path: '/',
    component: BasicLayout,
    redirect: '/index/workplace',
    children: [
      {
        path: '/index',
        name: 'Index',
        component: PageView,
        redirect: '/index/workplace',
        meta: {
          title: '首页',
          icon: 'home-4-line',
          affix: true
        },
        children: [
          {
            path: '/index/workplace',
            component: () => import('/@/views/workplace/index.vue'),
            meta: {
              title: '工作台',
              icon: 'home-4-line',
              affix: true
            }
          }
        ]
      }
    ]
  },
  {
    path: '/:path(.*)*',
    redirect: '/exception/404'
  }
]

const router = createRouter({
  history: handleRouterMode(),
  routes: constantRoutes as unknown as RouteRecordRaw[]
})

export default router
