import { ExtractPropTypes } from 'vue'
import { Tabs } from 'ant-design-vue'
import { cardProps, proCardTabPaneProps } from './props'

export type Gutter = number | Partial<Record<Breakpoint, number>>;

export type ColSpanType = number | string;

export type ProCardTabsProps = Partial<ExtractPropTypes<typeof Tabs.props>>;

export type CardProps = Partial<ExtractPropTypes<typeof cardProps>>;

export type ProCardTabPaneProps = Partial<ExtractPropTypes<typeof proCardTabPaneProps>>;

