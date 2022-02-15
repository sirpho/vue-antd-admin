import {
  defineComponent,
  computed,
  toRefs
} from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { Layout } from 'ant-design-vue'
import { headerViewProps } from './props'
import { DefaultHeader } from './DefaultHeader'
import { flatMap } from '../../utils'
import { useRouteContext } from '../../RouteContext'

const { Header } = Layout

export default defineComponent({
  inheritAttrs: false,
  props: headerViewProps,
  setup(props) {
    const {
      theme,
      isMobile,
      fixedHeader,
      headerHeight,
      layout,
      onCollapse
    } = toRefs(props)
    const context = useRouteContext()
    const needFixedHeader = computed(
      () => fixedHeader.value || context.fixedHeader
    )
    const hTheme = computed(() => (layout.value === 'side' && 'light') || theme.value)
    const className = computed(() => {
      return [
        needFixedHeader.value && 'gx-pro-fixed-header'
      ]
    })
    const needSettingWidth = computed(
      () => needFixedHeader.value && !isMobile.value
    )
    // cache menu
    const clearMenuData = computed(
      () => (context.menuData && flatMap(context.menuData as RouteRecordRaw[])) || []
    )
    const width = computed(() => {
      return layout.value === 'side' && needSettingWidth.value
        ? `calc(100% - ${props.collapsed ? props.collapsedWidth : props.siderWidth}px)`
        : '100%'
    })
    const right = computed(() => (needFixedHeader.value ? 0 : undefined))

    const renderContent = () => {
      const defaultDom = (
        <DefaultHeader
          {...props}
          theme={hTheme.value as 'light' | 'dark'}
          mode="horizontal"
          onCollapse={onCollapse.value}
          menuData={clearMenuData.value}
        />
      )
      if (props.headerRender) {
        return props.headerRender(props, defaultDom)
      }
      return defaultDom
    }
    return () => (
      <>
        {needFixedHeader.value && (
          <Header
            style={{
              height: `${headerHeight.value}px`,
              lineHeight: `${headerHeight.value}px`,
              background: 'transparent'
            }}
          />
        )}
        <Header
          class={className.value}
          style={{
            padding: 0,
            height: `${headerHeight.value}px`,
            lineHeight: `${headerHeight.value}px`,
            width: width.value,
            zIndex: layout.value === 'side' ? 100 : 101,
            right: right.value
          }}
        >
          {renderContent()}
        </Header>
      </>
    )
  }
})