/**
 * @author gx12358 2539306317@qq.com
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import { message } from 'ant-design-vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import config from '/config/config'
import router from '/@/router'
import store from '/@/store'
import getPageTitle from '/@/utils/pageTitle'

const {
  authentication,
  loginInterception,
  recordRoute,
  routesWhiteList
} = config.defaultSettings

NProgress.configure({ showSpinner: false })
router.beforeEach(async (to, _, next) => {
  message.destroy()
  if (store.getters['settings/showProgressBar']) NProgress.start()
  if (
    store.getters['routes/routerLoadList'].every(item => item !== to.path) &&
    routesWhiteList.indexOf(to.path) === -1
  ) {
    store.dispatch('routes/setRouterLoadList', to.path)
    store.dispatch('routes/toggleRouterLoading', true)
  }
  let hasToken = store.getters['user/accessToken']
  let hasUserInfo = true
  let accessRoutes: any[] = []
  if (!loginInterception) hasToken = true
  if (hasToken) {
    if (to.path === '/user/login') {
      next({ path: '/', replace: true })
      NProgress.done()
    } else {
      const hasRoles = store.getters['acl/role'].length > 0
      if (hasRoles) {
        next()
        NProgress.done()
      } else {
        try {
          if (loginInterception) {
            hasUserInfo = await store.dispatch('user/getUserInfo')
          } else {
            //loginInterception为false（关闭登录拦截时）时，创建虚拟角色
            hasUserInfo = await store.dispatch('user/setVirtualRoles')
          }
          if (hasUserInfo) {
            if (authentication === 'intelligence') {
              accessRoutes = await store.dispatch('routes/setRoutes')
            } else if (authentication === 'all') {
              accessRoutes = await store.dispatch('routes/setAllRoutes')
            }
          }
          (accessRoutes as any[]).forEach((item) => {
            router.addRoute(item)
          })
          if (hasUserInfo && accessRoutes.length) {
            next({ ...to, replace: true })
            store.dispatch('routes/setMeunLoading', false)
          } else {
            await store.dispatch('user/resetPermissions')
            if (recordRoute)
              next({
                path: '/user/login',
                query: { redirect: to.path },
                replace: true
              })
            else next({ path: '/user/login', replace: true })
          }
          NProgress.done()
        } catch (e) {
          await store.dispatch('user/resetPermissions')
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
      await store.dispatch('user/resetPermissions')
      if (recordRoute) {
        next({ path: '/user/login', query: { redirect: to.path }, replace: true })
      } else next({ path: '/user/login', replace: true })
    }
    NProgress.done()
  }
})
router.afterEach((to) => {
  const { meta }: any = to
  document.title = getPageTitle(meta.title || '')
  NProgress.done()
  setTimeout(() => {
    store.dispatch('routes/toggleRouterLoading', false)
  }, 200)
})
