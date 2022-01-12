import type { FunctionalComponent, CSSProperties } from 'vue'
import { computed, toRefs } from 'vue'
import { Layout } from 'ant-design-vue'
import PageLoading from './PageLoading'
import type { MultiTabProps } from './components/MultiTab'
import MultiTab from './components/MultiTab'
import { useRouteContext } from './RouteContext'
import { getMenuFirstChildren } from './utils'

const { Content } = Layout

export interface WrapContentProps {
  style?: CSSProperties;
  class?: string | string[] | any;
  loading?: boolean;
  isMobile: boolean;
  collapsed?: boolean;
  isShowTabsBar?: boolean;
  isFixedMultiTab?: boolean;
  isChildrenLayout?: boolean;
  location?: string | string[] | any;
  siderWidth?: number;
  contentHeight?: number;
  onReloadPage?: MultiTabProps['onReloadPage'];
}

export const WrapContent: FunctionalComponent<WrapContentProps> = (props, { slots, attrs }) => {
  const {
    isMobile,
    loading,
    collapsed,
    siderWidth,
    isShowTabsBar,
    isFixedMultiTab,
    onReloadPage
  } = props

  if (props.isChildrenLayout) {
    return slots.default?.()
  }
  const context = useRouteContext()
  const flatMenuData = getMenuFirstChildren(context.menuData, context.selectedKeys[0])
  const { getPrefixCls } = toRefs(useRouteContext())
  const prefixCls = getPrefixCls.value({
    suffixCls: 'main-content',
    isPor: true
  })
  const classNames = computed(() => {
    return {
      [`${prefixCls}`]: true,
      [`${prefixCls}-warp`]: flatMenuData.length === 0
    }
  })

  return (
    <Content {...attrs}>
      {flatMenuData.length > 0 && isShowTabsBar && (
        <MultiTab
          isMobile={isMobile}
          loading={loading}
          isFixedMultiTab={isFixedMultiTab}
          siderWidth={siderWidth}
          collapsed={collapsed}
          onReloadPage={onReloadPage}
        />
      )}
      <PageLoading style={{ display: loading ? 'block' : 'none' }} />
      <div class={classNames.value} style={{ display: loading ? 'none' : 'block' }}>
        {slots.default?.()}
      </div>
    </Content>
  )
}

WrapContent.inheritAttrs = false
WrapContent.displayName = 'wrap-content'
