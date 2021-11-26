import { Descriptions as T } from 'ant-design-vue'
import type { FormProps } from 'ant-design-vue'
import { PropTypes } from '/@/utils'
import type { ProCoreActionType, LabelTooltipType } from '../_util/typings'
import type { ProDescriptionsItemProps, RowEditableConfig } from './typings'

export const proDescriptionsProps = Object.assign({}, T.props, {
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
})
