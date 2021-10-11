<template>
  <w-pro-layout
    :loading="loading"
    v-model:collapsed="baseState.collapsed"
    v-model:selectedKeys="baseState.selectedKeys"
    v-model:openKeys="baseState.openKeys"
    v-bind="state"
    @reloadPage="handleReloadPage"
    @handleCollapse="toggleCollapse"
    @menuHeaderClick="menuHeaderClick"
  >
    <w-pro-content :animate="animate" :isRouterAlive="isRouterAlive" />
    <setting-drawer :settings="state" @change="handleSettingChange" />
  </w-pro-layout>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  provide,
  reactive,
  watchEffect,
  computed,
  nextTick
} from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import config from '/config/config'
import { RouteContextProps, getMenuData, clearMenuItem, SettingDrawer } from '@wd-pro/pro-layout'
import WProContent from './ContentView.vue'

const { animate } = config

const { preset } = animate

export default defineComponent({
  components: {
    WProContent,
    SettingDrawer
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const isRouterAlive = ref(true)
    const { menuData } = getMenuData(clearMenuItem(router.getRoutes()))
    const baseState = reactive<Omit<RouteContextProps, 'menuData'>>({
      selectedKeys: [],
      openKeys: [],
      collapsed: false
    })
    const state = reactive({
      menuData,
      layout: computed(() => store.getters['settings/layout']),
      theme: computed(() => store.getters['settings/theme']),
      fixedMultiTab: computed(() => store.getters['settings/fixedMultiTab']),
      fixedHeader: computed(() => store.getters['settings/fixedHeader']),
      fixSiderbar: computed(() => store.getters['settings/fixSiderbar']),
      showTabsBar: computed(() => store.getters['settings/showTabsBar']),
      autoHideHeader: computed(() => store.getters['settings/autoHideHeader']),
      showProgressBar: computed(() => store.getters['settings/showProgressBar']),
      animate: computed(() => store.getters['settings/animate'])
    })
    watchEffect(() => {
      if (router.currentRoute) {
        const matched = router.currentRoute.value.matched.concat()
        baseState.selectedKeys = matched.filter(r => r.name !== 'index').map(r => r.path)
        baseState.openKeys = matched
          .filter(r => r.path !== router.currentRoute.value.path)
          .map(r => r.path)
      }
    })
    const handleSettingChange = ({ type, value }) => {
      switch (type) {
        case 'theme':
          store.dispatch('settings/changeTheme', value)
          break
        case 'layout':
          store.dispatch('settings/changeLayout', value)
          if (value === 'mix') {
            store.dispatch('settings/changeFixedHeader', true)
            store.dispatch('settings/changeFixSiderbar', true)
          }
          break
        case 'fixedHeader':
          store.dispatch('settings/changeFixedHeader', value)
          if (state.layout === 'side' && !value) store.dispatch(
            'settings/changeFixedMultiTab',
            value
          )
          break
        case 'fixSiderbar':
          store.dispatch('settings/changeFixSiderbar', value)
          break
        case 'showTabsBar':
          store.dispatch('settings/handleShowTabsBar', value)
          break
        case 'fixedMultiTab':
          store.dispatch('settings/changeFixedMultiTab', value)
          if (state.layout === 'side' && value) store.dispatch(
            'settings/changeFixedHeader',
            value
          )
          break
        case 'showProgressBar':
          store.dispatch('settings/handleShowProgressBar', value)
          break
        case 'showAnimate':
          store.dispatch('settings/handleShowAnimate', !value)
          break
        case 'changeAnimateMode':
          store.dispatch('settings/changeAnimateMode', value)
          store.dispatch(
            'settings/changeAnimateDirections',
            preset.find((el: any) => el.name === value)?.directions.includes('default')
              ? 'default'
              : preset.find((el: any) => el.name === value)?.directions[0]
          )
          break
        case 'changeAnimateDirections':
          store.dispatch('settings/changeAnimateDirections', value)
          break
      }
    }
    const handleReloadPage = () => {
      isRouterAlive.value = false
      nextTick(() => {
        isRouterAlive.value = true
      })
    }
    provide('reloadPage', handleReloadPage)
    return {
      loading: computed(() => store.getters['routes/routerLoading']),
      layout: computed(() => store.getters['settings/layout']),
      collapsed: computed(() => store.getters['settings/collapse']),
      animate: computed(() => store.getters['settings/animate']),
      isRouterAlive,
      state,
      baseState,
      handleReloadPage,
      handleSettingChange,
      toggleCollapse: () => {
        store.dispatch('settings/toggleCollapse')
      },
      menuHeaderClick: () => {
        router.push('/')
      }
    }
  }
})
</script>
