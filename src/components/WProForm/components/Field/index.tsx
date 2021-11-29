import type { ExtractPropTypes, FunctionalComponent } from 'vue'
import { omit } from 'lodash-es'
import { Input } from 'ant-design-vue'
import type { SelectProps } from 'ant-design-vue/lib/vc-select'
import ProField from '@wd-design/pro-field'
import type { ProSchema } from '@wd-design/pro-utils'
import { runFunction } from '/@/utils/util'
import createField from '../../BaseForm/createField'
import type { ProFormFieldItemProps } from '../../typings'

export type InputProps = Partial<ExtractPropTypes<typeof Input.props>>;

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
