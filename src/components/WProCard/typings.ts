import { ExtractPropTypes } from 'vue'
import tabsProps from 'ant-design-vue/es/tabs'
import { cardProps, proCardTabPaneProps } from './props'

export type Gutter = number | Partial<Record<Breakpoint, number>>;

export type ColSpanType = number | string;

export type ProCardTabsProps = Partial<ExtractPropTypes<typeof tabsProps>>;

export type CardProps = Partial<ExtractPropTypes<typeof cardProps>>;

export type ProCardTabPaneProps = Partial<ExtractPropTypes<typeof proCardTabPaneProps>>;

