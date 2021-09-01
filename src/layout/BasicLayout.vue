<template>
  <w-pro-layout
    :loading="loading"
    v-model:collapsed="baseState.collapsed"
    v-model:selectedKeys="baseState.selectedKeys"
    v-model:openKeys="baseState.openKeys"
    v-bind="state"
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
  provide,
  nextTick
} from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getMenuData, clearMenuItem } from '/@/components/WProLayout/utils/getMenuData'
import { RouteContextProps } from '/@/components/WProLayout/RouteContext'
import WProContent from './ContentView.vue'

interface stateTypes {
  menuData: any[];
  settings: any;
}

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
    const state: stateTypes = reactive({
      menuData,
      layout: computed(() => store.getters['settings/layout']),
      theme: computed(() => store.getters['settings/theme']),
      fixedHeader: computed(() => store.getters['settings/fixedHeader']),
      fixSiderbar: computed(() => store.getters['settings/fixSiderbar']),
      showTabsBar: computed(() => store.getters['settings/showTabsBar']),
      autoHideHeader: computed(
        () => store.getters['settings/autoHideHeader']
      )
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
    const reload = () => {
      isRouterAlive.value = false
      nextTick(() => {
        isRouterAlive.value = true
      })
    }
    provide('reload', reload)
    return {
      loading: computed(() => store.getters['routes/routerLoading']),
      layout: computed(() => store.getters['settings/layout']),
      collapsed: computed(() => store.getters['settings/collapse']),
      animate: computed(() => store.getters['settings/animate']),
      isRouterAlive,
      state,
      baseState,
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
