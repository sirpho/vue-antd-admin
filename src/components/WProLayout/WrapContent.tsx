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
  isChildrenLayout?: boolean;
  location?: string | string[] | any;
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
        <MultiTab loading={props.loading} />
      )}
      {props.loading ? <PageLoading /> : (
        <div class={classNames.value}>
          {slots.default?.()}
        </div>
      )}
    </Content>
  )
}

WrapContent.inheritAttrs = false
WrapContent.displayName = 'wrap-content'
