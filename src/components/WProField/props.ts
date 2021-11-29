import type {
  ProFieldTextType,
  ProFieldValueType,
  ProFieldValueObjectType,
  ProSchemaValueEnumObj,
  ProSchemaValueEnumMap,
  ProFieldRequestData,
} from '@wd-design/pro-utils'
import { PropTypes } from '/@/utils'
import type { ProFieldFCMode, ProRenderFieldPropsType } from './typings'

export const proFieldPropsType = {
  text: [ Object, Array, String, Number, Boolean ] as PropType<ProFieldTextType>,
  valueType: [ String, Object ] as PropType<ProFieldValueType | ProFieldValueObjectType>,
  fieldProps: PropTypes.any,
  mode: [ String ] as PropType<ProFieldFCMode>,
  placeholder: [ String, Array ] as PropType<string | string[]>,
  value: PropTypes.any,
  onChange: Function as PropType<(value: any) => void>,
  plain: PropTypes.bool,
  light: PropTypes.bool,
  visible: PropTypes.bool,
  onVisible: Function as PropType<(visible: boolean) => void>,
  label: [ Object, String ] as PropType<VueNode | string>,
  emptyText: [ Object, String ] as PropType<VueNode | string>,
  valueEnum: [ Object, Map ] as PropType<ProSchemaValueEnumObj | ProSchemaValueEnumMap>,
  proFieldKey: [ String, Number ] as PropType<string | number>,
  render: Function as PropType<ProRenderFieldPropsType['render']>,
  renderFormItem: Function as PropType<ProRenderFieldPropsType['renderFormItem']>,
  request: Function as PropType<ProFieldRequestData>,
}
