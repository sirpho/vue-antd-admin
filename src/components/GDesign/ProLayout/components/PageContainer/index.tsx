import type { ExtractPropTypes, VNodeChild } from 'vue'
import { omit } from 'lodash-es'
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { Card, PageHeader } from 'ant-design-vue'
import config from '/config/config'
import ProWatermark from '@gx-design/ProWatermark'
import { useMemo } from '@gx-admin/hooks/core'
import { getPrefixCls, getSlotVNode } from '@gx-admin/utils'
import { PropTypes } from '@/utils'
import { pageContainerProps } from './props'
import { useRouteContext } from '../../RouteContext'
import type { RouteContextProps } from '../../RouteContext'
import type { DefaultPropRender } from '../../RenderTypings'

export type PageContainerProps = Partial<ExtractPropTypes<typeof pageContainerProps>>

const { waterMark } = config.defaultSettings

const renderPageHeader = (
  content: CustomRender,
  extraContent: CustomRender,
  prefixedClassName: string
): VNodeChild | JSX.Element | null => {
  if (!content && !extraContent) {
    return null
  }
  return (
    <div class={`${prefixedClassName}-detail`}>
      <div class={`${prefixedClassName}-main`}>
        <div class={`${prefixedClassName}-row`}>
          {content && (
            <div class={`${prefixedClassName}-content`}>
              {(typeof content === 'function' && content()) || content}
            </div>
          )}
          {extraContent && (
            <div class={`${prefixedClassName}-extraContent`}>
              {(typeof extraContent === 'function' && extraContent()) || extraContent}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const defaultPageHeaderRender = (
  props: PageContainerProps,
  value: Required<RouteContextProps> & { prefixedClassName: string }
) => {
  const { title, content, pageHeaderRender, header, extraContent, ...restProps } = omit(props, [
    'prefixCls'
  ])
  if (pageHeaderRender) {
    return pageHeaderRender({ ...props, ...value })
  }
  let pageHeaderTitle = title
  if (!title && title !== false) {
    pageHeaderTitle = value.title
  }
  const unrefBreadcrumb = unref(value.breadcrumb || {})
  const breadcrumb = restProps.breadcrumb || {
    ...unrefBreadcrumb,
    itemRender:
      unrefBreadcrumb.itemRender ||
      (({ route }) => {
        return <RouterLink to={route.path}>{route.breadcrumbName}</RouterLink>
      })
  }
  // inject value
  return (
    <PageHeader {...restProps} title={pageHeaderTitle} breadcrumb={breadcrumb}>
      {header || renderPageHeader(content, extraContent, value.prefixedClassName)}
    </PageHeader>
  )
}

const PageContainer = defineComponent({
  name: 'GProPageContainer',
  inheritAttrs: false,
  props: {
    contentStyle: PropTypes.style,
    useCard: PropTypes.bool.def(true)
  },
  setup(props, { slots }) {
    const value = useRouteContext()

    const prefixedClassName = getPrefixCls({
      suffixCls: 'page-container',
      isPor: true
    })

    const gridPrefixCls = getPrefixCls({
      suffixCls: 'grid-content',
      isPor: true
    })

    const headerDom = computed(() => {
      const tags = getSlotVNode<DefaultPropRender>(slots, props, 'tags')
      const headerContent = getSlotVNode<DefaultPropRender>(slots, props, 'content')
      const extra = getSlotVNode<DefaultPropRender>(slots, props, 'extra')
      const extraContent = getSlotVNode<DefaultPropRender>(slots, props, 'extraContent')
      return (
        <div class={`${prefixedClassName}-warp`}>
          {defaultPageHeaderRender(
            {
              ...omit(props, 'useCard'),
              tags,
              content: headerContent,
              extra,
              extraContent,
              prefixCls: undefined
            },
            {
              ...value,
              prefixedClassName: prefixedClassName
            }
          )}
        </div>
      )
    })

    const slotsDom = useMemo(() => (
      <>{props.useCard ? <Card bordered={false}>{slots.default?.()}</Card> : slots.default?.()}</>
    ))

    const content = useMemo(() => (
      <div class={`${prefixedClassName}-children-content`}>{slotsDom.value}</div>
    ))

    const renderContentDom = useMemo(() => (
      <>{waterMark ? <ProWatermark>{content.value}</ProWatermark> : content.value}</>
    ))

    return () => {
      return (
        <div class={prefixedClassName}>
          {headerDom.value}
          <div class={gridPrefixCls}>
            <g-bars>
              <div class={`${gridPrefixCls}-children`} style={props.contentStyle}>
                {renderContentDom.value}
              </div>
            </g-bars>
          </div>
        </div>
      )
    }
  }
})

export default PageContainer
