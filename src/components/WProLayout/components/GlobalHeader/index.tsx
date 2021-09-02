import {
  defineComponent,
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
      layout,
      onCollapse
    } = toRefs(props)
    const context = useRouteContext()
    const needFixedHeader = computed(
      () => fixedHeader.value || context.fixedHeader
    )
    const className = computed(() => {
      return [
        needFixedHeader.value && 'wd-pro-fixed-header'
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
        ? `calc(100% - ${props.collapsed ? 48 : props.siderWidth}px)`
        : '100%'
    })
    const right = computed(() => (needFixedHeader.value ? 0 : undefined))

    const renderContent = () => {
      const defaultDom = (
        <DefaultHeader
          theme={theme.value as 'light' | 'dark'}
          mode="horizontal"
          {...props}
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
