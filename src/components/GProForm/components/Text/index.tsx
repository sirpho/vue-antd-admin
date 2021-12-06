import type { ExtractPropTypes, FunctionalComponent } from 'vue'
import type { EventHandler } from 'ant-design-vue/lib/_util/EventInterface'
import { PropTypes } from '/@/utils'
import { tuple } from '@gx-design/pro-utils'
import ProField from '../Field'
import type { InputProps } from '../Field'
import type { ProFormFieldItemProps } from '../../typings'

const inputNumberProps = {
  prefixCls: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  step: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).def(1),
  defaultValue: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  tabindex: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  disabled: PropTypes.looseBool,
  size: PropTypes.oneOf(tuple('large', 'small', 'default')),
  formatter: PropTypes.func,
  parser: PropTypes.func,
  decimalSeparator: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  precision: PropTypes.number,
  autofocus: PropTypes.looseBool,
  onPressEnter: {
    type: Function as PropType<EventHandler>
  },
  onChange: Function as PropType<(num: number) => void>
}

export type PasswordProps = Partial<ExtractPropTypes<typeof inputNumberProps>>;

const valueType = 'text' as const
/**
 * 文本组件
 *
 * @param
 */
const ProFormText: FunctionalComponent<ProFormFieldItemProps<InputProps>> = ({
  fieldProps,
  proFieldProps,
  ...rest
}: ProFormFieldItemProps<InputProps>) => {
  return (
    <ProField
      mode="edit"
      valueType={valueType}
      fieldProps={fieldProps}
      filedConfig={
        {
          valueType
        } as const
      }
      proFieldProps={proFieldProps}
      {...rest}
    />
  )
}

const Password: FunctionalComponent<ProFormFieldItemProps<PasswordProps>> = ({
  fieldProps,
  proFieldProps,
  ...rest
}: ProFormFieldItemProps<PasswordProps>) => {
  return (
    <ProField
      mode="edit"
      valueType="password"
      fieldProps={fieldProps}
      proFieldProps={proFieldProps}
      filedConfig={
        {
          valueType
        } as const
      }
      {...rest}
    />
  )
}

const WrappedProFormText: typeof ProFormText & {
  Password: typeof Password;
} = ProFormText as any

WrappedProFormText.Password = Password

// @ts-ignore
// eslint-disable-next-line no-param-reassign
WrappedProFormText.displayName = 'ProFormComponent'

export default WrappedProFormText
