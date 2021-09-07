import { FunctionalComponent, computed, toRefs, CSSProperties } from 'vue'
import 'ant-design-vue/es/layout/style'
import Layout from 'ant-design-vue/es/layout'
import { useRouteContext } from './RouteContext'
import { getMenuFirstChildren } from './utils'
import PageLoading from './components/PageLoading'
import MultiTab from './components/MultiTab'

const { Content } = Layout

export interface WrapContentProps {
  style?: CSSProperties;
  class?: string | string[] | any;
  loading?: boolean;
  isMobile: boolean;
  collapsed?: boolean;
  isFixedMultiTab?: boolean;
  isChildrenLayout?: boolean;
  location?: string | string[] | any;
  siderWidth?: number;
  contentHeight?: number;
}

export const WrapContent: FunctionalComponent<WrapContentProps> = (props, { slots, attrs }) => {
  if (props.isChildrenLayout) {
    return slots.default?.()
  }
  const context = useRouteContext()
  const flatMenuData = getMenuFirstChildren(context.menuData, context.selectedKeys[0])
  const { getPrefixCls } = toRefs(useRouteContext())
  const prefixCls = getPrefixCls.value('main-content')
  const classNames = computed(() => {
    return {
      [`${prefixCls}`]: true,
      [`${prefixCls}-warp`]: flatMenuData.length === 0
    }
  })

  return (
    <Content {...attrs}>
      {flatMenuData.length > 0 && (
        <MultiTab
          isMobile={props.isMobile}
          loading={props.loading}
          isFixedMultiTab={props.isFixedMultiTab}
          siderWidth={props.siderWidth}
          collapsed={props.collapsed}
        />
      )}
      <PageLoading style={{ display: props.loading ? 'block' : 'none'}} />
      <div class={classNames.value} style={{ display: props.loading ? 'none' : 'block'}}>
        {slots.default?.()}
      </div>
    </Content>
  )
}

WrapContent.inheritAttrs = false
WrapContent.displayName = 'wrap-content'
