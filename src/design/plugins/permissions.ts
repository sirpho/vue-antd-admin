/**
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import { message } from 'ant-design-vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import config from '/config/config'
import router from '@/router'
import { useStoreUser, useStoreRoutes, useStoreSettings } from '@gx-vuex'
import getPageTitle from '@/utils/pageTitle'

const {
  authentication,
  recordRoute,
  routerLoadTime,
  routesWhiteList
} = config.defaultSettings

NProgress.configure({ showSpinner: false })
router.beforeEach(async (to, _, next) => {
  const user = useStoreUser()
  const routes = useStoreRoutes()
  const settings = useStoreSettings()
  message.destroy()
  if (settings.showProgressBar) NProgress.start()
  if (
    routes.routerLoadList.every(item => item !== to.path) &&
    routesWhiteList.indexOf(to.path) === -1
  ) {
    routes.addRouterLoadList(to.path)
    routes.changeValue('routerLoading', true)
  }
  const hasToken = !!user.accessToken
  let accessRoutes: AppRouteModule[] = []
  if (hasToken) {
    if (to.path === '/user/login') {
      next({ path: '/', replace: true })
      NProgress.done()
    } else {
      const isInitialized = routes.initialized
      if (isInitialized) {
        next()
        NProgress.done()
      } else {
        try {
          if (authentication === 'intelligence') {
            accessRoutes = await routes.setRoutes()
          } else if (authentication === 'all') {
            accessRoutes = await routes.setAllRoutes()
          }
          if (accessRoutes.length) {
            accessRoutes.forEach((item: any) => {
              router.addRoute(item)
            })
            routes.changeValue('initialized', true)
            next({...to, replace: true})
          } else {
            next({path: '/exception/403'})
          }
          routes.changeValue('menuLoading', false)

          NProgress.done()
        } catch (e) {
          user.resetPermissions()
          if (recordRoute)
            next({
              path: '/user/login',
              query: { redirect: to.path },
              replace: true
            })
          else next({ path: '/user/login', replace: true })
          NProgress.done()
        }
      }
    }
  } else {
    if (routesWhiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      user.resetPermissions()
      if (recordRoute) {
        next({ path: '/user/login', query: { redirect: to.path }, replace: true })
      } else next({ path: '/user/login', replace: true })
    }
    NProgress.done()
  }
})
router.afterEach((to) => {
  const routes = useStoreRoutes()
  const { meta }: any = to
  document.title = getPageTitle(meta.title || '')
  NProgress.done()
  setTimeout(() => {
    routes.changeValue('routerLoading', false)
  }, routerLoadTime || 200)
})
