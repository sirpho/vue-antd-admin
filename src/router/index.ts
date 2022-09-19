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
        component: () => import('@/views/User/login/index.vue')
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
      homePage: 0,
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
        path: '/proComponents',
        component: () => import('@/layout/PageView.vue'),
        name: 'Pro组件',
        meta: {
          title: 'Pro组件',
          tagFixed: false,
          tagHidden: false,
          icon: 'gx-zujian',
          homePage: 0,
          iconType: 1,
          hideInMenu: false,
          target: '',
          targetStatus: 0
        },
        redirect: '/proComponents/layout/waterMark',
        children: [
          {
            path: '/proComponents/layout',
            component: () => import('@/layout/PageView.vue'),
            name: '布局',
            meta: {
              title: '布局',
              tagFixed: false,
              tagHidden: false,
              icon: 'gx-layout',
              homePage: 0,
              iconType: 1,
              hideInMenu: false,
              target: '',
              targetStatus: 0
            },
            redirect: '/proComponents/layout/waterMark',
            children: [
              {
                path: '/proComponents/layout/waterMark',
                component: () => import('@/views/proComponents/layout/waterMark/index.vue'),
                name: '水印组件',
                meta: {
                  title: '水印组件',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              },
              {
                path: '/proComponents/layout/card',
                component: () => import('@/views/proComponents/layout/card/index.vue'),
                name: '高级卡片',
                meta: {
                  title: '高级卡片',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              }
            ]
          },
          {
            path: '/proComponents/dataEntry',
            component: () => import('@/layout/PageView.vue'),
            name: '数据录入',
            meta: {
              title: '数据录入',
              tagFixed: false,
              tagHidden: false,
              icon: 'gx-17',
              homePage: 0,
              iconType: 1,
              hideInMenu: false,
              target: '',
              targetStatus: 0
            },
            children: [
              {
                path: '/proComponents/dataEntry/proUpload',
                component: () => import('@/views/proComponents/dataEntry/proUpload/index.vue'),
                name: '高级上传',
                meta: {
                  title: '高级上传',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              },
            ]
          },
          {
            path: '/proComponents/dataDisplay',
            component: () => import('@/layout/PageView.vue'),
            name: '数据展示',
            meta: {
              title: '数据展示',
              tagFixed: false,
              tagHidden: false,
              icon: 'gx-shuju',
              homePage: 0,
              iconType: 1,
              hideInMenu: false,
              target: '',
              targetStatus: 0
            },
            children: [
              {
                path: '/proComponents/dataDisplay/proTable',
                component: () => import('@/views/proComponents/dataDisplay/proTable/index.vue'),
                name: '高级表格',
                meta: {
                  title: '高级表格',
                  tagFixed: true,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              }
            ]
          },
          {
            path: '/proComponents/universal',
            component: () => import('@/layout/PageView.vue'),
            name: '通用',
            meta: {
              title: '通用',
              tagFixed: false,
              tagHidden: false,
              icon: 'gx-tongyonggongneng',
              homePage: 0,
              iconType: 1,
              hideInMenu: false,
              target: '',
              targetStatus: 0
            },
            children: [
              {
                path: '/proComponents/universal/proSkeleton',
                component: () => import('@/views/proComponents/universal/proSkeleton/index.vue'),
                name: '骨架屏',
                meta: {
                  title: '骨架屏',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              },
              {
                path: '/proComponents/universal/player/video',
                component: () => import('@/views/proComponents/universal/Player/Video/index.vue'),
                name: '视频',
                meta: {
                  title: '视频',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              },
              {
                path: '/proComponents/universal/image',
                component: () => import('@/views/proComponents/universal/Image/index.vue'),
                name: '图片',
                meta: {
                  title: '图片',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              }
            ]
          }
        ]
      },
      {
        path: '/proPage',
        component: () => import('@/layout/PageView.vue'),
        name: 'Pro页面',
        meta: {
          title: 'Pro页面',
          tagFixed: false,
          tagHidden: false,
          icon: 'gx-iconset0335',
          homePage: 0,
          iconType: 1,
          hideInMenu: false,
          target: '',
          targetStatus: 0
        },
        children: [
          {
            path: '/proPage/form',
            component: () => import('@/layout/PageView.vue'),
            name: '表单页',
            meta: {
              title: '表单页',
              tagFixed: false,
              tagHidden: false,
              icon: 'gx-biaodan',
              homePage: 0,
              iconType: 1,
              hideInMenu: false,
              target: '',
              targetStatus: 0
            },
            children: [
              {
                path: '/proPage/form/basicForm',
                component: () => import('@/views/proPages/form/basicForm/index.vue'),
                name: '基础表单',
                meta: {
                  title: '基础表单',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              },
              {
                path: '/proPage/form/stepForm',
                component: () => import('@/views/proPages/form/stepForm/index.vue'),
                name: '分布表单',
                meta: {
                  title: '分布表单',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              },
              {
                path: '/proPage/form/advancedForm',
                component: () => import('@/views/proPages/form/advancedForm/index.vue'),
                name: '组合表单',
                meta: {
                  title: '组合表单',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              }
            ]
          },
          {
            path: '/proPage/list',
            component: () => import('@/layout/PageView.vue'),
            name: '列表页',
            meta: {
              title: '列表页',
              tagFixed: false,
              tagHidden: false,
              icon: 'gx-biaoge',
              homePage: 0,
              iconType: 1,
              hideInMenu: false,
              target: '',
              targetStatus: 0
            },
            children: [
              {
                path: '/proPage/list/searchList',
                component: () => import('@/views/proPages/list/search/index.vue'),
                name: '搜索列表',
                meta: {
                  title: '搜索列表',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              },
              {
                path: '/proPage/list/tableList',
                component: () => import('@/views/proPages/list/tableList/index.vue'),
                name: '查询表格',
                meta: {
                  title: '查询表格',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              },
              {
                path: '/proPage/list/basicList',
                component: () => import('@/views/proPages/list/basicList/index.vue'),
                name: '标准列表',
                meta: {
                  title: '标准列表',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              },
              {
                path: '/proPage/list/cardList',
                component: () => import('@/views/proPages/list/cardList/index.vue'),
                name: '卡片列表',
                meta: {
                  title: '卡片列表',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              }
            ]
          },
          {
            path: '/proPage/profile',
            component: () => import('@/layout/PageView.vue'),
            name: '详情页',
            meta: {
              title: '详情页',
              tagFixed: false,
              tagHidden: false,
              icon: 'gx-xiangqing',
              homePage: 0,
              iconType: 1,
              hideInMenu: false,
              target: '',
              targetStatus: 0
            },
            children: [
              {
                path: '/proPage/profile/profileBasic',
                component: () => import('@/views/proPages/profile/basic/index.vue'),
                name: '基础详情页',
                meta: {
                  title: '基础详情页',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              },
              {
                path: '/proPage/profile/advanced',
                component: () => import('@/views/proPages/profile/advanced/index.vue'),
                name: '高级详情页',
                meta: {
                  title: '高级详情页',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              }
            ]
          },
          {
            path: '/proPage/result',
            component: () => import('@/layout/PageView.vue'),
            name: '结果页',
            meta: {
              title: '结果页',
              tagFixed: false,
              tagHidden: false,
              icon: 'gx-jieguoye',
              homePage: 0,
              iconType: 1,
              hideInMenu: false,
              target: '',
              targetStatus: 0
            },
            children: [
              {
                path: '/proPage/result/success',
                component: () => import('@/views/proPages/result/success/index.vue'),
                name: '成功页',
                meta: {
                  title: '成功页',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              },
              {
                path: '/proPage/result/fail',
                component: () => import('@/views/proPages/result/fail/index.vue'),
                name: '失败页',
                meta: {
                  title: '失败页',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              }
            ]
          },
          {
            path: '/proPage/exception',
            component: () => import('@/layout/PageView.vue'),
            name: '异常页',
            meta: {
              title: '异常页',
              tagFixed: false,
              tagHidden: false,
              icon: 'gx-yichangguanli',
              homePage: 0,
              iconType: 1,
              hideInMenu: false,
              target: '',
              targetStatus: 0
            },
            children: [
              {
                path: '/proPage/exception/403',
                component: () => import('@/views/proPages/exception/403/index.vue'),
                name: '403',
                meta: {
                  title: '403',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              },
              {
                path: '/proPage/exception/404',
                component: () => import('@/views/proPages/exception/404/index.vue'),
                name: '404',
                meta: {
                  title: '404',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              },
              {
                path: '/proPage/exception/500',
                component: () => import('@/views/proPages/exception/500/index.vue'),
                name: '500',
                meta: {
                  title: '500',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: '',
                  targetStatus: 0
                }
              }
            ]
          },
          {
            path: '/proPage/webIframe',
            component: () => import('@/layout/PageView.vue'),
            name: '外部页面',
            meta: {
              title: '外部页面',
              tagFixed: false,
              tagHidden: false,
              icon: 'gx-waibushuju',
              homePage: 0,
              iconType: 1,
              hideInMenu: false,
              target: '',
              targetStatus: 0
            },
            children: [
              {
                path: '/proPage/webIframe/antVue',
                component: () => import('/src/layout/IframeView.vue'),
                name: 'antVue文档(内嵌)',
                meta: {
                  title: 'antVue文档(内嵌)',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: 'https://next.antdv.com/components/overview-cn/',
                  targetStatus: 0
                }
              },
              {
                path: '/proPage/webIframe/undefined',
                component: () => import('/src/layout/IframeView.vue'),
                name: 'procomponents(外链)',
                meta: {
                  title: 'procomponents(外链)',
                  tagFixed: false,
                  tagHidden: false,
                  homePage: 0,
                  iconType: 1,
                  hideInMenu: false,
                  target: 'https://procomponents.ant.design/',
                  targetStatus: 1
                }
              }
            ]
          }
        ]
      },
      {
        path: '/account',
        component: () => import('@/layout/PageView.vue'),
        name: '个人页',
        meta: {
          title: '个人页',
          tagFixed: false,
          tagHidden: false,
          icon: 'gx-gerenziliao',
          homePage: 0,
          iconType: 1,
          hideInMenu: false,
          target: '',
          targetStatus: 0
        },
        children: [
          {
            path: '/account/center',
            component: () => import('@/views/account/center/index.vue'),
            name: '个人中心',
            meta: {
              title: '个人中心',
              tagFixed: false,
              tagHidden: false,
              icon: 'gx-gerenzhongxin2',
              homePage: 0,
              iconType: 1,
              hideInMenu: false,
              target: '',
              targetStatus: 0
            }
          },
          {
            path: '/account/settings',
            component: () => import('@/views/account/settings/index.vue'),
            name: '个人设置',
            meta: {
              title: '个人设置',
              tagFixed: false,
              tagHidden: false,
              icon: 'gx-gerenshezhi',
              homePage: 0,
              iconType: 1,
              hideInMenu: false,
              target: '',
              targetStatus: 0
            }
          }
        ]
      },
      {
        path: '/system',
        component: () => import('@/layout/PageView.vue'),
        name: '系统配置',
        meta: {
          title: '系统配置',
          tagFixed: false,
          tagHidden: false,
          icon: 'gx-xitongpeizhi',
          homePage: 0,
          iconType: 1,
          hideInMenu: false,
          target: '',
          targetStatus: 0
        },
        children: [
          {
            path: '/system/menu',
            component: () => import('@/views/system/menu/index.vue'),
            name: '菜单管理',
            meta: {
              title: '菜单管理',
              tagFixed: false,
              tagHidden: false,
              icon: 'gx-a-zu5',
              homePage: 0,
              iconType: 1,
              hideInMenu: false,
              target: '',
              targetStatus: 0
            }
          }
        ]
      }
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
