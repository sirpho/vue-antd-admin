<template>
  <g-pro-layout
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
  </g-pro-layout>
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
import config from '/config/config'
import { useStore } from '@gx-vuex'
import { RouteContextProps, getMenuData, clearMenuItem, SettingDrawer } from '@gx-design/ProLayout'
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
      layout: computed(() => store.settings.layout),
      theme: computed(() => store.settings.theme),
      primaryColor: computed(() => store.settings.primaryColor),
      fixedMultiTab: computed(() => store.settings.fixedMultiTab),
      fixedHeader: computed(() => store.settings.fixedHeader),
      fixSiderbar: computed(() => store.settings.fixSiderbar),
      showTabsBar: computed(() => store.settings.showTabsBar),
      autoHideHeader: computed(() => store.settings.autoHideHeader),
      showProgressBar: computed(() => store.settings.showProgressBar),
      animate: computed(() => store.settings.animate)
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
          store.settings.changeValue('theme', value)
          break
        case 'primaryColor':
          store.settings.changeValue('primaryColor', value)
          break
        case 'layout':
          store.settings.changeValue('layout', value)
          if (value === 'mix') {
            store.settings.changeValue('fixedHeader', true)
            store.settings.changeValue('fixSiderbar', true)
          }
          break
        case 'fixedHeader':
          store.settings.changeValue('fixedHeader', value)
          if (state.layout === 'side' && !value) store.settings.changeValue(
            'fixedMultiTab',
            value
          )
          break
        case 'fixSiderbar':
          store.settings.changeValue('fixSiderbar', value)
          break
        case 'showTabsBar':
          store.settings.changeValue('showTabsBar', value)
          break
        case 'fixedMultiTab':
          store.settings.changeValue('fixedMultiTab', value)
          if (state.layout === 'side' && value) store.settings.changeValue(
            'fixedHeader',
            value
          )
          break
        case 'showProgressBar':
          store.settings.changeValue('showProgressBar', value)
          break
        case 'showAnimate':
          store.settings.handleShowAnimate(!value)
          break
        case 'changeAnimateMode':
          store.settings.changeAnimateMode(value)
          store.settings.changeAnimateDirections(
            preset.find((el: any) => el.name === value)?.directions.includes('default')
              ? 'default'
              : preset.find((el: any) => el.name === value)?.directions[0]
          )
          break
        case 'changeAnimateDirections':
          store.settings.changeAnimateDirections(value)
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
      loading: computed(() => store.routes.routerLoading),
      layout: computed(() => store.settings.layout),
      collapsed: computed(() => store.settings.collapse),
      animate: computed(() => store.settings.animate),
      isRouterAlive,
      state,
      baseState,
      handleReloadPage,
      handleSettingChange,
      toggleCollapse: () => {
        store.settings.toggleCollapse()
      },
      menuHeaderClick: () => {
        router.push('/')
      }
    }
  }
})
</script>
