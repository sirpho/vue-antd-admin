import type { FormProps } from 'ant-design-vue'
import { PropTypes } from '/@/utils'
import { tuple } from '@gx-design/pro-utils'
import type { ProCoreActionType, LabelTooltipType } from '../_util/typings'
import type { ProDescriptionsItemProps, RowEditableConfig } from './typings'

const DEFAULT_COLUMN_MAP: Partial<Record<Breakpoint, number>> = {
  xxl: 3,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1
}

export const descriptionsProps = {
  prefixCls: PropTypes.string,
  bordered: PropTypes.looseBool,
  size: PropTypes.oneOf(tuple('default', 'middle', 'small')).def('default'),
  title: PropTypes.VNodeChild,
  extra: PropTypes.VNodeChild,
  column: {
    type: [ Number, Object ] as PropType<number | Partial<Record<Breakpoint, number>>>,
    default: (): number | Partial<Record<Breakpoint, number>> => DEFAULT_COLUMN_MAP
  },
  layout: PropTypes.oneOf(tuple('horizontal', 'vertical')),
  colon: PropTypes.looseBool,
  labelStyle: PropTypes.style,
  contentStyle: PropTypes.style
}

export const proDescriptionsProps = {
  ...descriptionsProps,
  params: {
    type: Object as PropType<Record<string, any>>
  },
  onRequestError: {
    type: Function as PropType<(e: Error) => void>
  },
  request: {
    type: Function as PropType<(params: Record<string, any>) => Promise<any>>
  },
  columns: {
    type: Array as PropType<ProDescriptionsItemProps<Record<string, any>, string>[]>
  },
  actionRef: Function as PropType<ProCoreActionType>,
  loading: PropTypes.bool,
  onLoadingChange: Function as PropType<(loading?: boolean) => void>,
  tooltip: [ Object, String ] as PropType<LabelTooltipType | string>,
  tip: PropTypes.string,
  formProps: Object as PropType<FormProps>,
  editable: Object as PropType<RowEditableConfig<Record<string, any>>>,
  dataSource: Array as PropType<Record<string, any>>,
  onDataSourceChange: Function as PropType<(value: Record<string, any>) => void>
}
