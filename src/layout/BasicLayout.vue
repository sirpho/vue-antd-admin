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
  </w-pro-layout>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  watchEffect,
  computed,
  nextTick
} from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { RouteContextProps, getMenuData, clearMenuItem } from '@wd-pro/pro-layout'
import WProContent from './ContentView.vue'

export default defineComponent({
  components: {
    WProContent
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
      autoHideHeader: computed(() => store.getters['settings/autoHideHeader'])
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
    const handleReloadPage = () => {
      isRouterAlive.value = false
      nextTick(() => {
        isRouterAlive.value = true
      })
    }
    return {
      loading: computed(() => store.getters['routes/routerLoading']),
      layout: computed(() => store.getters['settings/layout']),
      collapsed: computed(() => store.getters['settings/collapse']),
      animate: computed(() => store.getters['settings/animate']),
      isRouterAlive,
      state,
      baseState,
      handleReloadPage,
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
