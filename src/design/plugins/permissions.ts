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
  if (store.getters['settings/showProgressBar']) NProgress.start()
  message.destroy()
  let hasToken = store.getters['user/accessToken']
  if (!loginInterception) hasToken = true
  if (hasToken) {
    if (to.path === '/user/login') {
      next({ path: '/user/login' })
      NProgress.done()
    } else {
      const hasRoles =
        store.getters['acl/admin'] ||
        store.getters['acl/role'].length > 0 ||
        store.getters['acl/ability'].length > 0
      if (hasRoles) {
        next()
        NProgress.done()
      } else {
        try {
          if (loginInterception) {
            await store.dispatch('user/getUserInfo')
          } else {
            //loginInterception为false（关闭登录拦截时）时，创建虚拟角色
            await store.dispatch('user/setVirtualRoles')
          }
          let accessRoutes = []
          if (authentication === 'intelligence') {
            accessRoutes = await store.dispatch('routes/setRoutes')
          } else if (authentication === 'all') {
            accessRoutes = await store.dispatch('routes/setAllRoutes')
          }
          accessRoutes.forEach((item) => {
            router.addRoute(item)
          })
          store.dispatch('routes/setMeunLoading', false)
          next({ ...to, replace: true })
          NProgress.done()
        } catch (e) {
          await store.dispatch('user/resetAll')
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
      if (recordRoute)
        next({ path: '/user/login', query: { redirect: to.path }, replace: true })
      else next({ path: '/user/login', replace: true })
    }
    NProgress.done()
  }
})
router.afterEach((to) => {
  const { meta }: any = to
  document.title = getPageTitle(meta.title || '')
  NProgress.done()
})
