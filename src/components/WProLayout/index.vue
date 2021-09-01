<template>
  <a-layout class="wd-pro-basic-layout">
    <template v-if="menuList.length > 0">
      <a-drawer
        v-if="isMobile"
        :closable="false"
        :visible="collapsed"
        :width="208"
        :wrapClassName="`drawer-sider ${theme}`"
        placement="left"
        @close="handleCollapse"
      >
        <side-menu
          collapsible
          :isMobile="isMobile"
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
              :show-title="!isMobile && !collapsed"
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
        :isMobile="isMobile"
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
            :show-title="!isMobile && !collapsed"
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
        :isMobile="isMobile"
        :theme="theme"
        :menus="headerList"
        @handleCollapse="handleCollapse"
        @menuItemClick="headerMenuItemClick"
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
            :show-title="!isMobile"
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
        <div
          v-else
          :class="menuList.length > 0  ? 'wd-pro-main-content' : [ 'wd-pro-main-content', 'wd-pro-main-content-warp' ]"
        >
          <slot></slot>
        </div>
      </a-layout-content>
      <a-layout-footer style="padding: 0;">
        <GlobalFooter>
          <template v-if="$slots.footerRender" #footerRender>
            <slot name="footerRender"></slot>
          </template>
        </GlobalFooter>
      </a-layout-footer>
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
  onMounted
} from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import { getFirstLastChild, getLastFirstChild } from '/@/utils/routeConvert'
import { deepCopy } from '/@/utils/util'
import { basicLayoutProps } from './props'
import GlobalHeader from './components/GlobalHeader.vue'
import GlobalFooter from './components/GlobalFooter.vue'
import LogoContent from './components/LogoContent.vue'
import SideMenu from './components/SideMenu.vue'
import MultiTab from './components/MultiTab.vue'
import useMediaQuery from '../_util/useMediaQuery'

export default defineComponent({
  name: 'ProLayout',
  components: {
    LogoContent,
    MultiTab,
    GlobalHeader,
    GlobalFooter,
    SideMenu
  },
  props: basicLayoutProps,
  setup(props, { emit }) {
    const width = ref(document.body.getBoundingClientRect().width)
    const colSize = useMediaQuery()
    const store = useStore()
    const route = useRoute()
    const state = reactive({
      headerList: [],
      menuList: [],
    })
    const routes = computed(() => {
      return props.menuData || []
    })
    onMounted(() => {
      window.addEventListener('resize', handleLayouts)
      state.headerList = routes.value.map((item) => {
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
      store.dispatch('routes/setHeaderRoutes', cloneDeep(state.headerList))
      handleLayouts()
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleLayouts)
    })
    const isMobile = computed(
      () => (colSize.value === 'sm' || colSize.value === 'xs')
    )
    const contentPaddingLeft = computed(() => {
      if (
        !store.getters['settings/fixSiderbar'] ||
        isMobile.value ||
        state.menuList.length === 0
      ) {
        return '0'
      }
      return '48px'
    })
    const handleSideList = () => {
      if (
        store.getters['settings/layout'] === 'side' ||
        isMobile.value
      ) {
        state.menuList = routes.value || []
      } else {
        const currentPath = getLastFirstChild(routes.value, route.fullPath)
        if (currentPath) {
          const currentRouters = routes.value.find(
            (item) => item.path === currentPath
          )
          state.menuList = currentRouters.children || []
        } else {
          state.menuList = []
        }
        store.dispatch('routes/setSiderRoutes', cloneDeep(state.menuList))
      }
    }
    watch(() => route.fullPath, () => {
      handleSideList()
    }, {
      deep: true,
      immediate: true
    })
    const handleLayouts = () => {
      const clientWidth = document.body.getBoundingClientRect().width
      if (width.value !== clientWidth) {
        colSize.value = useMediaQuery().value
        width.value = clientWidth
      }
    }
    const menuItemClick = ({ item, key, selectedKeys }) => {
      emit('menuItemClick', { item, key, selectedKeys })
    }
    const headerMenuItemClick = ({ item, key, selectedKeys }) => {
      emit('menuItemClick', { item, key, selectedKeys })
    }
    return {
      layout: props.layout,
      showTabsBar: props.showTabsBar,
      theme: props.theme,
      fixedHeader: props.fixedHeader,
      fixSiderbar: props.fixSiderbar,
      sidebarOpened: props.sidebarOpened,
      meunLoading: computed(() => store.getters['routes/meunLoading']),
      contentPaddingLeft,
      isMobile,
      ...toRefs(state),
      handleCollapse: () => {
        emit('handleCollapse')
      },
      menuHeaderClick: () => {
        emit('menuHeaderClick')
      },
      menuItemClick,
      headerMenuItemClick
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
