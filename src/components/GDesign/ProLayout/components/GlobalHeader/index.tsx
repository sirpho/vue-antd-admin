import { defineComponent, computed, toRefs } from 'vue'
import { Layout } from 'ant-design-vue'
import { headerViewProps } from './props'
import { DefaultHeader } from './DefaultHeader'
import { flatMap } from '../../utils'
import { useRouteContext } from '../../RouteContext'
import { omit } from 'lodash-es'

const { Header } = Layout

export default defineComponent({
  inheritAttrs: false,
  props: headerViewProps,
  setup(props) {
    const { theme, isMobile, fixedHeader, headerHeight, layout, onCollapse, splitMenus } =
      toRefs(props)
    const context = useRouteContext()
    const baseClassName = context.getPrefixCls({
      suffixCls: 'fixed-header',
      isPor: true
    })
    const needFixedHeader = computed(() => fixedHeader.value || context.fixedHeader)
    const isMix = computed(() => layout.value === 'mix')
    const layoutSide = computed(() => layout.value === 'side' || layout.value === 'simple')
    const hTheme = computed(() => (layoutSide.value && 'light') || theme.value)
    const className = computed(() => [needFixedHeader.value && baseClassName])
    const needSettingWidth = computed(() => needFixedHeader.value && !isMobile.value)

    // cache menu
    const clearMenuData = computed(() =>
      splitMenus.value ? (context.menuData && flatMap(context.menuData as any[])) || [] : []
    )
    const width = computed(() => {
      return layoutSide.value && needSettingWidth.value
        ? `calc(100% - ${props.collapsed ? props.collapsedWidth : props.sidebarWidth}px)`
        : '100%'
    })
    const right = computed(() => (needFixedHeader.value ? 0 : undefined))

    const renderContent = () => {
      const resetProps = omit(props, ['headerContentRender'])
      const defaultDom = (
        <DefaultHeader
          {...resetProps}
          theme={hTheme.value as 'light' | 'dark'}
          mode="horizontal"
          onCollapse={onCollapse.value}
          menuData={clearMenuData.value}
        >
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
            zIndex: layoutSide.value ? 100 : 101,
            right: right.value
          }}
        >
          {renderContent()}
        </Header>
      </>
    )
  }
})
