<template>
  <g-pro-layout
    v-model:collapsed="baseState.collapsed"
    v-model:selectedKeys="baseState.selectedKeys"
    v-model:openKeys="baseState.openKeys"
    v-bind="state"
    :breadcrumb="{ routes: baseState.breadcrumb as any }"
    :footerRender="false"
    @reloadPage="handleReloadPage"
    @handleCollapse="toggleCollapse"
    @menuHeaderClick="menuHeaderClick"
  >
    <ProContent :isRouterAlive="isRouterAlive as boolean" />
    <setting-drawer v-if="isDevEnvironment" :settings="state" @change="handleSettingChange" />
  </g-pro-layout>
</template>
<script setup lang="ts">
import { computed, reactive } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useStore } from '@gx-vuex'
import { RouteContextProps, getMenuData, clearMenuItem, SettingDrawer } from '@gx-design/ProLayout'
import ProContent from './ContentView.vue'
import { isDev } from '@/utils'

const store = useStore()
const router = useRouter()

const isRouterAlive = ref(true)
const routeData: AppRouteModule[] = router.getRoutes() as any

const { menuData } = getMenuData(clearMenuItem(routeData))

const baseState = reactive<Omit<RouteContextProps, 'menuData'>>({
  breadcrumb: [],
  selectedKeys: [],
  openKeys: [],
  collapsed: false
})

const state = reactive({
  menuData,
  logoDirection: 'vertical',
  loading: computed(() => store.routes.routerLoading),
  layout: computed(() => store.settings.layout),
  theme: computed(() => store.settings.theme),
  splitMenus: computed(() => store.settings.splitMenus),
  primaryColor: computed(() => store.settings.primaryColor),
  fixedHeader: computed(() => store.settings.fixedHeader),
  fixSiderbar: computed(() => store.settings.fixSiderbar),
  showTabsBar: computed(() => store.settings.showTabsBar),
  autoHideHeader: computed(() => store.settings.autoHideHeader),
  showProgressBar: computed(() => store.settings.showProgressBar)
})

const isDevEnvironment = isDev()

watch(
  () => router.currentRoute,
  () => {
    const matched = router.currentRoute.value.matched.concat()
    const breadcrumb = matched.map((item) => {
      return {
        path: item.path,
        breadcrumbName: item.meta.title || ''
      }
    })
    baseState.breadcrumb = cloneDeep(breadcrumb)
  },
  {
    deep: true,
    immediate: true
  }
)

watchEffect(() => {
  if (router.currentRoute) {
    const matched = router.currentRoute.value.matched.concat()
    baseState.selectedKeys = matched.filter((r) => r.path !== '/').map((r) => r.path)
    baseState.openKeys = matched
      .filter((r) => r.path !== router.currentRoute.value.path)
      .map((r) => r.path)
  }
})

const handleSettingChange = ({ type, value }) => {
  switch (type) {
    case 'theme':
      store.settings.changeValue('theme', value)
      break
    case 'primaryColor':
      store.settings.changeValue('primaryColor', value)
      break
    case 'layout':
      store.settings.changeValue('layout', value)
      if (value === 'mix') {
        store.settings.changeValue('splitMenus', true)
        store.settings.changeValue('showTabsBar', true)
        store.settings.changeValue('fixedHeader', true)
        store.settings.changeValue('fixSiderbar', true)
      } else if (value === 'simple') {
        store.settings.changeValue('splitMenus', false)
        store.settings.changeValue('showTabsBar', false)
        store.settings.changeValue('fixedHeader', false)
      }
      break
    case 'fixedHeader':
      store.settings.changeValue('fixedHeader', value)
      break
    case 'fixSiderbar':
      store.settings.changeValue('fixSiderbar', value)
      break
    case 'splitMenus':
      store.settings.changeValue('splitMenus', value)
      break
    case 'showTabsBar':
      store.settings.changeValue('showTabsBar', value)
      break
    case 'showProgressBar':
      store.settings.changeValue('showProgressBar', value)
      break
  }
}

const handleReloadPage = () => {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
  })
}

const toggleCollapse = () => {
  store.settings.toggleCollapse()
}
const menuHeaderClick = () => {
  router.push('/')
}

provide('reloadPage', handleReloadPage)
</script>
