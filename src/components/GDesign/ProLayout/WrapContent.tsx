import type { FunctionalComponent, CSSProperties } from 'vue'
import { computed } from 'vue'
import { Layout } from 'ant-design-vue'
import PageLoading from './PageLoading'
import type { MultiTabProps } from './components/MultiTab'
import MultiTab from './components/MultiTab'
import { useRouteContext } from './RouteContext'

const { Content } = Layout

export interface WrapContentProps {
  style?: CSSProperties
  class?: string | string[] | any
  loading?: boolean
  isMobile: boolean
  collapsed?: boolean
  isShowTabsBar?: boolean
  isChildrenLayout?: boolean
  location?: string | string[] | any
  siderWidth?: number
  contentHeight?: number
  onReloadPage?: MultiTabProps['onReloadPage']
}

export const WrapContent: FunctionalComponent<WrapContentProps> = (props, { slots, attrs }) => {
  const { isMobile, loading, collapsed, siderWidth, isShowTabsBar, onReloadPage } = props

  if (props.isChildrenLayout) {
    return slots.default?.()
  }
  const context = useRouteContext()
  const { getPrefixCls } = useRouteContext()

  const prefixCls = getPrefixCls({
    suffixCls: 'basic-layout',
    isPor: true
  })

  const classNames = computed(() => {
    return {
      [`${prefixCls}-content`]: true,
      [`${prefixCls}-warp`]: context.flatMenuData.length === 0
    }
  })

  return (
    <>
      {isShowTabsBar && (
        <MultiTab
          isMobile={isMobile}
          loading={loading}
          siderWidth={siderWidth}
          collapsed={collapsed}
          onReloadPage={onReloadPage}
        />
      )}
      <Content style={attrs.style} class={classNames.value}>
        {loading && <PageLoading />}
        <div
          style={{ display: loading ? 'none' : 'flex', flexDirection: 'column', height: '100%' }}
        >
          {slots.default?.()}
        </div>
      </Content>
    </>
  )
}

WrapContent.inheritAttrs = false
WrapContent.displayName = 'wrap-content'
