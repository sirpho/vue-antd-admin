<template>
  <w-pro-layout
    :menus="menus"
    :collapsed="collapsed"
    :device="device"
    v-bind:settings="settings"
    @handleCollapse="toggleCollapse"
    @menuHeaderClick="menuHeaderClick"
  >
    <w-content :animate="animate" :isRouterAlive="isRouterAlive" />
  </w-pro-layout>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  toRefs,
  reactive,
  computed,
  provide,
  nextTick
} from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { convertRoutes } from '/@/utils/routeConvert'
import WContent from './ContentView.vue'

interface stateTypes {
  menus: any[];
  settings: any;
}

export default defineComponent({
  components: {
    WContent
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const isRouterAlive = ref(true)
    const state: stateTypes = reactive({
      menus: [],
      settings: {
        layout: computed(() => store.getters['settings/layout']),
        theme: computed(() => store.getters['settings/theme']),
        fixedHeader: computed(() => store.getters['settings/fixedHeader']),
        fixSiderbar: computed(() => store.getters['settings/fixSiderbar']),
        showTabsBar: computed(() => store.getters['settings/showTabsBar']),
        autoHideHeader: computed(
          () => store.getters['settings/autoHideHeader']
        )
      }
    })
    const routes = convertRoutes(
      store.getters['routes/routes'].find((item) => item.path === '/')
    )
    state.menus = routes || []
    const reload = () => {
      isRouterAlive.value = false
      nextTick(() => {
        isRouterAlive.value = true
      })
    }
    provide('reload', reload)
    return {
      layout: computed(() => store.getters['settings/layout']),
      collapsed: computed(() => store.getters['settings/collapse']),
      device: computed(() => store.getters['settings/device']),
      animate: computed(() => store.getters['settings/animate']),
      isRouterAlive,
      ...toRefs(state),
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
