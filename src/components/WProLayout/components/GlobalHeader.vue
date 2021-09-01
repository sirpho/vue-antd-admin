<template>
  <a-layout-header
    :class="[
      fixedHeader && 'wd-pro-fixed-header',
      sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed',
    ]"
    :style="headerStyle"
  >
    <div v-if="headerLoading" class="wd-pro-header-loading">
      <a-spin :spinning="headerLoading" />
    </div>
    <div :class="['wd-pro-global-header', theme]">
      <div class="wd-pro-global-header-main">
        <template v-if="$slots.headerRender">
          <div
            v-if="layout === 'side' || isMobile"
            class="wd-pro-global-header-collapsed-button"
          >
            <menu-unfold-outlined @click="handleCollapse" v-if="collapsed" />
            <menu-fold-outlined @click="handleCollapse" v-else />
          </div>
          <slot name="headerRender"></slot>
        </template>
        <template v-else>
          <template v-if="isMobile">
            <slot name="headerLogoRender" ></slot>
            <div
              v-if="layout === 'side' || isMobile"
              class="wd-pro-global-header-collapsed-button"
            >
              <template v-if="$slots.collapsedButtonRender">
                <slot name="collapsedButtonRender" ></slot>
              </template>
              <template v-else>
                <menu-unfold-outlined
                  @click="handleCollapse"
                  v-if="collapsed"
                />
                <menu-fold-outlined @click="handleCollapse" v-else />
              </template>
            </div>
          </template>
          <div v-else class="wd-pro-global-header-main-left">
            <slot v-if="layout === 'mix'" name="headerLogoRender" ></slot>
            <div
              v-if="layout === 'side' || isMobile"
              class="wd-pro-global-header-collapsed-button"
            >
              <template v-if="$slots.collapsedButtonRender">
                <slot name="collapsedButtonRender" ></slot>
              </template>
              <template v-else>
                <menu-unfold-outlined
                  @click="handleCollapse"
                  v-if="collapsed"
                />
                <menu-fold-outlined @click="handleCollapse" v-else />
              </template>
            </div>
          </div>
          <div class="wd-pro-global-header-menu">
            <s-menu
              v-if="!isMobile && layout === 'mix'"
              :menu="menus"
              :theme="theme"
              :collapsed="collapsed"
              :iconfontUrl="iconfontUrl"
              mode="horizontal"
              @menuItemClick="menuItemClick"
            />
          </div>
          <template v-if="$slots.rightContentRender">
            <slot name="rightContentRender" ></slot>
          </template>
          <right-content v-else :isMobile="isMobile" />
        </template>
      </div>
    </div>
  </a-layout-header>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  onMounted,
  onBeforeUnmount,
  computed
} from 'vue'
import { useStore } from 'vuex'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import SMenu from './index'
import RightContent from './RightContent.vue'

export default defineComponent({
  components: {
    SMenu,
    RightContent,
    MenuUnfoldOutlined,
    MenuFoldOutlined
  },
  props: {
    layout: {
      type: String,
      required: false,
      default: 'mix'
    },
    headerLoading: {
      type: Boolean,
      required: false,
      default: false
    },
    iconfontUrl: {
      type: String,
      required: false,
      default: ''
    },
    menus: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    isMobile: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(_: any, { emit }) {
    const store = useStore()
    const headerStyle = ref({
      padding: '0px',
      height: '48px',
      lineHeight: '48px',
      width: '100%',
      zIndex: store.getters['settings/layout'] === 'side' ? 9 : 999,
      right: '0px'
    })
    const visible = ref(true)
    const ticking = ref(false)
    const oldScrollTop = ref(0)
    const handleScroll = () => {
      if (!store.getters['settings/autoHideHeader']) {
        return
      }
      const scrollTop =
        document.body.scrollTop + document.documentElement.scrollTop
      if (!ticking.value) {
        ticking.value = true
        requestAnimationFrame(() => {
          if (oldScrollTop.value > scrollTop) {
            visible.value = true
          } else if (scrollTop > 300 && visible.value) {
            visible.value = false
          } else if (scrollTop < 300 && !visible.value) {
            visible.value = true
          }
          oldScrollTop.value = scrollTop
          ticking.value = false
        })
      }
    }
    onMounted(() => {
      document.addEventListener('scroll', handleScroll, { passive: true })
    })
    onBeforeUnmount(() => {
      document.body.removeEventListener('scroll', handleScroll, true)
    })
    return {
      sidebarOpened: computed(() => store.getters['settings/sidebarOpened']),
      fixedHeader: computed(() => store.getters['settings/fixedHeader']),
      ticking,
      headerStyle,
      oldScrollTop,
      visible,
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

<style lang="less">
  .showHeader-enter-active {
    transition: all 0.25s ease;
  }

  .showHeader-leave-active {
    transition: all 0.5s ease;
  }

  .showHeader-enter,
  .showHeader-leave-to {
    opacity: 0;
  }
</style>
