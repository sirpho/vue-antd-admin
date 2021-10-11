import { FunctionalComponent, computed, toRefs, CSSProperties } from 'vue'
import 'ant-design-vue/es/layout/style'
import { useRouteContext } from './RouteContext'
import { getMenuFirstChildren } from './utils'
import type { MultiTabProps } from './components/MultiTab'
import MultiTab from './components/MultiTab'
import PageLoading from './components/PageLoading'

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
    suffixCls: 'main-content'
  })
  const classNames = computed(() => {
    return {
      [`${prefixCls}`]: true,
      [`${prefixCls}-warp`]: flatMenuData.length === 0
    }
  })

  return (
    <a-layout-content {...attrs}>
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
    </a-layout-content>
  )
}

WrapContent.inheritAttrs = false
WrapContent.displayName = 'wrap-content'
