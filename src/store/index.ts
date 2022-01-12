import { createPinia } from 'pinia'
import { useStoreDict } from './modules/dict'
import { useStoreUser } from './modules/user'
import { useStoreRoutes } from './modules/routes'
import { useStoreSettings } from './modules/settings'
import { useStorePermission } from './modules/permission'
import { useStoreTabsRouter } from './modules/tabsRouter'

export {
  useStoreDict,
  useStoreUser,
  useStoreRoutes,
  useStoreSettings,
  useStorePermission,
  useStoreTabsRouter
}

export function useStore() {
  return {
    user: useStoreUser(),
    dict: useStoreDict(),
    routes: useStoreRoutes(),
    settings: useStoreSettings(),
    permission: useStorePermission(),
    tabsRouter: useStoreTabsRouter(),
  }
}

export default createPinia()
