<template>
  <a-layout class="wd-pro-basic-layout">
    <template v-if="menuList.length > 0">
      <a-drawer
        v-if="device === 'mobile'"
        :closable="false"
        :visible="collapsed"
        :width="208"
        :wrapClassName="`drawer-sider ${theme}`"
        placement="left"
        @close="handleCollapse"
      >
        <side-menu
          collapsible
          :iconfontUrl="iconfontUrl"
          :sideLoading="meunLoading"
          :collapsed="false"
          :menus="menuList"
          :theme="theme"
          mode="inline"
          @handleCollapse="handleCollapse"
          @menuItemClick="menuItemClick"
        >
          <template #headerLogoRender>
            <slot v-if="$slots.headerLogoRender" name="headerLogoRender"></slot>
            <logo-content
              v-else
              :title="title"
              :logo="logo"
              :class="theme"
              :layout="layout"
              :show-title="device !== 'mobile' && !collapsed"
              @menuHeaderClick="menuHeaderClick"
            >
              <template v-if="$slots.headerTitleRender" #headerTitleRender>
                <slot name="headerTitleRender"></slot>
              </template>
              <template
                v-if="$slots.collapsedButtonRender"
                #collapsedButtonRender
              >
                <slot name="collapsedButtonRender"></slot>
              </template>
            </logo-content>
          </template>
        </side-menu>
      </a-drawer>
      <side-menu
        v-else
        :iconfontUrl="iconfontUrl"
        :sideLoading="meunLoading"
        collapsible
        :collapsed="collapsed"
        :menus="menuList"
        :theme="theme"
        mode="inline"
        @handleCollapse="handleCollapse"
        @menuItemClick="menuItemClick"
      >
        <template #headerLogoRender>
          <slot v-if="$slots.headerLogoRender" name="headerLogoRender"></slot>
          <logo-content
            v-else
            :title="title"
            :logo="logo"
            :class="theme"
            :layout="layout"
            :show-title="device !== 'mobile' && !collapsed"
            @menuHeaderClick="menuHeaderClick"
          >
            <template v-if="$slots.headerTitleRender" #headerTitleRender>
              <slot name="headerTitleRender"></slot>
            </template>
          </logo-content>
        </template>
        <template v-if="$slots.collapsedButtonRender" #collapsedButtonRender>
          <slot name="collapsedButtonRender"></slot>
        </template>
      </side-menu>
    </template>
    <a-layout :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh' }">
      <a-layout-header
        v-if="fixedHeader"
        style="height: 48px; line-height: 48px; background: transparent"
      />
      <GlobalHeader
        :iconfontUrl="iconfontUrl"
        :headerLoading="meunLoading"
        :layout="layout"
        :collapsed="collapsed"
        :device="device"
        :theme="theme"
        :menus="headerList"
        @handleCollapse="handleCollapse"
      >
        <template v-if="$slots.headerRender" #headerRender>
          <slot name="headerRender"></slot>
        </template>
        <template #headerLogoRender>
          <slot v-if="$slots.headerLogoRender" name="headerLogoRender"></slot>
          <logo-content
            v-else
            :title="title"
            :logo="logo"
            :show-title="device !== 'mobile'"
            @menuHeaderClick="menuHeaderClick"
          >
            <template v-if="$slots.headerTitleRender" #headerTitleRender>
              <slot name="headerTitleRender"></slot>
            </template>
          </logo-content>
        </template>
        <template v-if="$slots.rightContentRender" #rightContentRender>
          <slot name="rightContentRender"></slot>
        </template>
        <template v-if="$slots.collapsedButtonRender" #collapsedButtonRender>
          <slot name="collapsedButtonRender"></slot>
        </template>
      </GlobalHeader>
      <a-layout-content :style="{ height: '100%', ...contentStyle }">
        <multi-tab :loading="loading" v-if="showTabsBar && menuList.length > 0" />
        <div v-if="loading" style="padding-top: 100px; text-align: center">
          <a-spin size="large" :spinning="loading" />
        </div>
        <slot v-else></slot>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  toRefs,
  reactive,
  computed,
  watch,
  onBeforeUnmount,
  onBeforeMount,
  onMounted
} from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import {
  convertRoutes,
  getFirstLastChild,
  getLastFirstChild
} from '/@/utils/routeConvert'
import { deepCopy } from '/@/utils/util'
import GlobalHeader from './components/GlobalHeader.vue'
import LogoContent from './components/LogoContent.vue'
import SideMenu from './components/SideMenu.vue'
import MultiTab from './components/MultiTab.vue'
import { layoutProps } from './utils/config'

export default defineComponent({
  name: 'ProLayout',
  components: {
    LogoContent,
    MultiTab,
    GlobalHeader,
    SideMenu
  },
  props: Object.assign({}, layoutProps, {}),
  setup(_, { attrs, emit }) {
    const settings: any = attrs.settings
    const width = ref(0)
    const store = useStore()
    const route = useRoute()
    const state = reactive({
      headerList: [],
      menuList: []
    })
    const routes = convertRoutes(
      store.getters['routes/routes'].find((item) => item.path === '/')
    )
    onBeforeMount(() => {
      window.addEventListener('resize', handleLayouts)
    })
    onMounted(() => {
      state.headerList = routes.children.map((item) => {
        const listItem = deepCopy(item)
        let linkPath = ''
        if (listItem.children) {
          linkPath = getFirstLastChild(listItem.children)
        }
        delete listItem.children
        delete listItem.component
        return {
          ...listItem,
          linkPath
        }
      })
      handleLayouts()
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleLayouts)
    })
    const contentPaddingLeft = computed(() => {
      if (
        !store.getters['settings/fixSiderbar'] ||
        store.getters['settings/device'] === 'mobile' ||
        state.menuList.length === 0
      ) {
        return '0'
      }
      if (store.getters['settings/sidebarOpened']) {
        return '208px'
      }
      return '48px'
    })
    const handleSideList = () => {
      const currentPath = getLastFirstChild(routes.children, route.fullPath)
      if (currentPath) {
        const currentRouters = routes.children.find(
          (item) => item.path === currentPath
        )
        state.menuList = currentRouters.children || []
      } else {
        state.menuList = []
      }
    }
    watch(
      () => route.fullPath,
      () => {
        if (
          store.getters['settings/layout'] === 'side' ||
          store.getters['settings/device'] === 'mobile'
        ) {
          state.menuList = routes.children || []
        } else {
          handleSideList()
        }
      },
      {
        deep: true,
        immediate: true
      }
    )
    const handleLayouts = () => {
      const clientWidth = document.body.getBoundingClientRect().width
      if (width.value !== clientWidth) {
        const isMobile = clientWidth - 1 < 992
        store.dispatch(
          'settings/toggleDevice',
          isMobile ? 'mobile' : 'desktop'
        )
        width.value = clientWidth
      }
    }
    return {
      layout: settings.layout,
      showTabsBar: settings.showTabsBar,
      theme: settings.theme,
      fixedHeader: settings.fixedHeader,
      fixSiderbar: settings.fixSiderbar,
      sidebarOpened: settings.sidebarOpened,
      meunLoading: computed(() => store.getters['routes/meunLoading']),
      contentPaddingLeft,
      width,
      ...toRefs(state),
      handleCollapse: () => {
        emit('handleCollapse')
      },
      menuHeaderClick: () => {
        emit('menuHeaderClick')
      },
      menuItemClick: () => {
        emit('menuItemClick')
      }
    }
  }
})
</script>

<style lang="less">
@import "./style.less";

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
