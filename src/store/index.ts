import { createPinia } from 'pinia'
import { useStoreDict } from './modules/dict'
import { useStoreUser } from './modules/user'
import { useStoreRoutes } from './modules/routes'
import { useStoreSettings } from './modules/settings'
import { useStorePermission } from './modules/permission'
import { useStoreTabsRouter } from './modules/tabsRouter'
import { useSeed } from "@/store/modules/seed";
import { useStoreNotice } from "@/store/modules/notice";

export {
  useStoreDict,
  useStoreUser,
  useStoreRoutes,
  useStoreSettings,
  useStorePermission,
  useStoreTabsRouter,
  useSeed,
  useStoreNotice
}

export function useStore() {
  return {
    user: useStoreUser(),
    dict: useStoreDict(),
    routes: useStoreRoutes(),
    settings: useStoreSettings(),
    permission: useStorePermission(),
    tabsRouter: useStoreTabsRouter(),
    seed: useSeed(),
    notice: useStoreNotice()
  }
}

export default createPinia()
