<template>
  <a-layout-sider
    :collapsed="collapsed"
    :class="[
      'wd-pro-sider',
      isMobile ? 'shadow' : null,
      theme,
      fixSiderbar ? 'wd-pro-sider-fixed' : null,
    ]"
    :style="sideStyle"
    :collapsible="collapsible"
    :trigger="null"
    width="208px"
    collapsedWidth="48"
  >
    <div v-if="sideLoading" class="wd-pro-sider-loading">
      <a-spin :spinning="sideLoading" />
    </div>
    <template v-if="layout === 'side'">
      <slot name="headerLogoRender"></slot>
    </template>
    <div class="wd-pro-sider-menu" style="flex: 1 1 0%; overflow: hidden auto">
      <s-menu
        type="side"
        :iconfontUrl="iconfontUrl"
        :collapsed="collapsed"
        :menu="menus"
        :mode="mode"
        :theme="theme"
        @menuItemClick="menuItemClick"
      />
    </div>
    <template v-if="$slots.collapsedButtonRender">
      <div class="wd-pro-sider-links">
        <slot name="collapsedButtonRender"></slot>
      </div>
    </template>
    <div v-else class="wd-pro-sider-links" @click="handleCollapse">
      <menu-unfold-outlined v-if="collapsed" />
      <menu-fold-outlined v-else />
    </div>
  </a-layout-sider>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import SMenu from './index'

export default defineComponent({
  components: {
    SMenu,
    MenuUnfoldOutlined,
    MenuFoldOutlined
  },
  props: {
    isMobile: {
      type: Boolean,
      required: false,
      default: false
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    iconfontUrl: {
      type: String,
      required: false,
      default: ''
    },
    sideLoading: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menus: {
      type: Array,
      required: true
    }
  },
  setup(props, { emit }) {
    const store = useStore()
    const sideStyle = ref({
      paddingTop:
        store.getters['settings/layout'] === 'side' ||
        props.isMobile ?
          '0' : '49px'
    })
    const onSelect = (obj) => {
      emit('menuSelect', obj)
    }
    return {
      layout: computed(() => store.getters['settings/layout']),
      fixSiderbar: computed(() => store.getters['settings/fixSiderbar']),
      sideStyle,
      onSelect,
      handleCollapse: () => {
        emit('handleCollapse')
      },
      menuItemClick: ({ item, key, selectedKeys }) => {
        emit('menuItemClick', { item, key, selectedKeys })
      }
    }
  }
})
</script>
