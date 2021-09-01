import {
  ref,
  defineComponent,
  onMounted,
  onBeforeUnmount,
  computed,
  toRefs
} from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { headerViewProps } from './props'
import { DefaultHeader } from './DefaultHeader'
import { useRouteContext } from '../../RouteContext'
import { flatMap } from '../../utils'

export default defineComponent({
  inheritAttrs: false,
  props: headerViewProps,
  setup(props) {
    const {
      theme,
      isMobile,
      fixedHeader,
      headerHeight,
      autoHideHeader,
      layout,
      onCollapse
    } = toRefs(props)
    const context = useRouteContext()
    const needFixedHeader = computed(
      () => fixedHeader.value || context.fixedHeader
    )
    const isMix = computed(() => layout.value === 'mix')
    const className = computed(() => {
      return [
        fixedHeader && 'wd-pro-fixed-header'
      ]
    })
    const needSettingWidth = computed(
      () => needFixedHeader.value && !isMobile.value
    )
    // cache menu
    const clearMenuData = computed(
      () => (context.menuData && flatMap(context.menuData as RouteRecordRaw[])) || []
    )
    const visible = ref(true)
    const ticking = ref(false)
    const oldScrollTop = ref(0)
    const handleScroll = () => {
      if (autoHideHeader.value) {
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
    const width = computed(() => {
      return layout.value === 'side' || !needSettingWidth.value
        ? `calc(100% - ${props.collapsed ? 48 : props.siderWidth}px)`
        : '100%'
    })
    const right = computed(() => (needFixedHeader.value ? 0 : undefined))

    const renderContent = () => {
      const defaultDom = (
        // @ts-ignore
        <DefaultHeader
          theme={theme.value as 'light' | 'dark'}
          mode="horizontal"
          {...props}
          onCollapse={onCollapse.value}
          menuData={clearMenuData.value}>
          {!isMix.value
            ? props.headerContentRender && typeof props.headerContentRender === 'function'
              ? props.headerContentRender(props)
              : props.headerContentRender
            : null}
        </DefaultHeader>
      )
      if (props.headerRender) {
        return props.headerRender(props, defaultDom)
      }
      return defaultDom
    }
    return () => (
      <>
        {needFixedHeader.value && (
          <a-layout-header
            style={{
              height: `${headerHeight.value}px`,
              lineHeight: `${headerHeight.value}px`,
              background: 'transparent'
            }}
          />
        )}
        <a-layout-header
          class={className.value}
          style={{
            padding: 0,
            height: `${headerHeight.value}px`,
            lineHeight: `${headerHeight.value}px`,
            width: width.value,
            zIndex: layout.value === 'side' ? 19 : 100,
            right: right.value
          }}
        >
          {renderContent()}
        </a-layout-header>
      </>
    )
  }
})
