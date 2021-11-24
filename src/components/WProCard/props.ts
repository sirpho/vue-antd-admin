import { Tabs } from 'ant-design-vue'
import { PropTypes } from '/@/utils'
import type { Gutter, ColSpanType, ProCardTabsProps } from './typings'

const TabPane = Tabs.TabPane

export const cardProps = {
  headStyle: PropTypes.style,
  bodyStyle: PropTypes.style,
  headerBordered: PropTypes.looseBool,
  title: {
    type: [ String, Function ] as PropType<CustomRender>,
    default: () => undefined
  },
  subTitle: {
    type: [ String, Function ] as PropType<CustomRender>,
    default: () => undefined
  },
  tooltipIcon: {
    type: [ String, Function ] as PropType<CustomRender>,
    default: () => undefined
  },
  tooltipText: {
    type: [ String, Function ] as PropType<CustomRender>,
    default: () => undefined
  },
  extra: {
    type: [ String, Function ] as PropType<CustomRender>,
    default: () => undefined
  },
  layout: {
    type: String as PropType<'default' | 'center'>
  },
  type: {
    type: String as PropType<'default' | 'inner'>
  },
  direction: {
    type: String as PropType<'column' | 'row'>
  },
  wrap: PropTypes.looseBool,
  size: {
    type: String as PropType<'default' | 'small'>
  },
  loading: {
    type: [ Boolean, Function ] as PropType<CustomRender>,
    default: () => false
  },
  colSpan: {
    type: [ Object, Number ] as PropType<ColSpanType | Partial<Record<Breakpoint, ColSpanType>>>,
    default: () => undefined
  },
  gutter: {
    type: [ Number, Array ] as PropType<Gutter | Gutter[]>
  },
  actions: {
    type: [ Array, Function ] as PropType<CustomRender>,
    default: () => undefined
  },
  split: {
    type: String as PropType<'vertical' | 'horizontal'>
  },
  bordered: PropTypes.looseBool,
  hoverable: PropTypes.looseBool,
  alwaysHoverable: PropTypes.looseBool,
  ghost: PropTypes.looseBool,
  collapsible: PropTypes.looseBool,
  collapsed: PropTypes.looseBool,
  defaultCollapsed: PropTypes.looseBool,
  onCollapse: {
    type: Function as PropType<(collapsed: boolean) => void>
  },
  tabs: {
    type: [ Object ] as PropType<ProCardTabsProps>,
    default: undefined
  },
  prefixCls: PropTypes.string
}

export const proCardTabPaneProps = Object.assign({}, TabPane.props, {
  key: PropTypes.string,
  cardProps: cardProps
})
