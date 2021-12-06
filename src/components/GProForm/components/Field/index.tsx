import type { ExtractPropTypes, FunctionalComponent } from 'vue'
import { omit } from 'lodash-es'
import type { SelectProps } from 'ant-design-vue/lib/vc-select'
import { PropTypes } from '/@/utils'
import type { ProSchema, SizeType } from '@gx-design/pro-utils'
import { runFunction } from '/@/utils/util'
import ProField from '@gx-design/pro-field'
import createField from '../../BaseForm/createField'
import type { ProFormFieldItemProps } from '../../typings'

export const inputProps = {
  id: PropTypes.string,
  prefixCls: PropTypes.string,
  inputPrefixCls: PropTypes.string,
  defaultValue: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  placeholder: {
    type: [ String, Number ] as PropType<string | number>
  },
  type: PropTypes.string.def('text'),
  name: PropTypes.string,
  size: { type: String as PropType<SizeType> },
  disabled: PropTypes.looseBool,
  readonly: PropTypes.looseBool,
  addonBefore: PropTypes.VNodeChild,
  addonAfter: PropTypes.VNodeChild,
  prefix: PropTypes.VNodeChild,
  suffix: PropTypes.VNodeChild,
  autofocus: PropTypes.looseBool,
  allowClear: PropTypes.looseBool,
  lazy: PropTypes.looseBool.def(true),
  maxlength: PropTypes.number,
  loading: PropTypes.looseBool,
  onPressEnter: PropTypes.func,
  onKeydown: PropTypes.func,
  onKeyup: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onInput: PropTypes.func,
  'onUpdate:value': PropTypes.func
}

export type InputProps = Partial<ExtractPropTypes<typeof inputProps>>;

export type ProFormFieldProps<T = any, FiledProps = InputProps & SelectProps<string>> = ProSchema<T,
  ProFormFieldItemProps<FiledProps> & {
  mode?: 'edit' | 'read' | 'update';
  // 用来判断是不是被嵌套渲染的 dom
  isDefaultDom?: boolean;
  ref?: any;
  plain?: boolean;
  text?: any;
},
  any,
  any>;

/**
 * 最普通的 Text 组件
 *
 * @param
 */
const ProFormField: FunctionalComponent<ProFormFieldProps<any> & {
  onChange?: Function;
  autoFocus?: boolean;
}> = ((props, { slots }) => {
  const {
    fieldProps,
    labelCol,
    label,
    autoFocus,
    isDefaultDom,
    render,
    proFieldProps,
    renderFormItem,
    valueType,
    onChange,
    valueEnum,
    params,
    name,
    ...restProps
  } = props

  // 防止 formItem 的值被吃掉
  if (slots.default?.()) {
    return slots.default?.()
  }

  const renderDom = (values?: Record<string, any>) => {
    const propsParams = values ? { ...params, ...(values || {}) } : params
    return (
      <ProField
        text={fieldProps?.value}
        render={render as any}
        renderFormItem={renderFormItem as any}
        valueType={(valueType as 'text') || 'text'}
        fieldProps={{
          autoFocus,
          ...fieldProps,
          onChange: (...restParams: any) => {
            if (fieldProps?.onChange) {
              (fieldProps?.onChange as any)?.(...restParams)
              return
            }
            onChange?.(...restParams)
          }
        }}
        valueEnum={runFunction(valueEnum)}
        {...proFieldProps}
        {...omit(restProps, [ 'id', 'onBlur' ])}
        mode={proFieldProps?.mode || 'edit'}
        params={propsParams}
      />
    )
  }

  return renderDom()
})

export default createField<ProFormFieldProps>(ProFormField) as <FiledProps, DataType = {}>(
  props: ProFormFieldProps<DataType, FiledProps>
) => any
