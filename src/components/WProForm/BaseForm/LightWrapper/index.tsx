import type { FunctionalComponent, CSSProperties } from 'vue'
import { cloneVNode, ref } from 'vue'
import useMemo from '/@/hooks/core/useMemo'
import { getPrefixCls } from '/@/components/_util'
import dateArrayFormatter from '/@/components/_util/dateArrayFormatter'
import { dateFormatterMap } from '/@/components/_util/conversionMomentValue'
import FilterDropdown from '/@/components/_util/components/FilterDropdown'
import FieldLabel from '/@/components/_util/components/FieldLabel'
import type { LightFilterFooterRender } from '../../typings'

import './index.less'

export type SizeType = 'small' | 'middle' | 'large' | undefined;

export type LightWrapperProps = {
  label?: VueNode;
  disabled?: boolean;
  placeholder?: VueNode;
  size?: SizeType;
  value?: any;
  onChange?: (value?: any) => void;
  onBlur?: (value?: any) => void;
  style?: CSSProperties;
  class?: string;
  children?: VueNode;
  valuePropName?: string;
  customLightMode?: boolean;
  light?: boolean;
  labelFormatter?: (value: any) => string;
  bordered?: boolean;
  otherFieldProps?: any;
  valueType?: string;
  allowClear?: boolean;
  footerRender?: LightFilterFooterRender;
};

const LightWrapper: FunctionalComponent<LightWrapperProps> = (props, { slots }) => {
  const {
    label,
    size,
    disabled,
    onChange: propsOnChange,
    style,
    valuePropName,
    placeholder,
    labelFormatter,
    bordered,
    footerRender,
    allowClear,
    otherFieldProps,
    valueType,
    ...rest
  } = props

  const prefixCls = getPrefixCls({
    suffixCls: 'field-light-wrapper'
  })

  const tempValue = ref<string | undefined>(props[valuePropName!])
  const open = ref<boolean>(false)

  const setOpen = (value: boolean) => {
    open.value = value
  }

  const setTempValue = (value: string) => {
    tempValue.value = value
  }

  const onChange = (...restParams: any[]) => {
    otherFieldProps?.onChange?.(...restParams)
    propsOnChange?.(...restParams)
  }

  const labelValue = props[valuePropName!]

  /** DataRange的转化，moment 的 toString 有点不好用 */
  const labelText = useMemo(() => {
    if (valueType?.toLowerCase()?.endsWith('range') && !labelFormatter) {
      return dateArrayFormatter(labelValue, dateFormatterMap[valueType] || 'YYYY-MM-DD')
    }
    return labelValue
  }, [ () => labelValue, () => valueType, () => labelFormatter ])


  return (
    <FilterDropdown
      disabled={disabled}
      onVisibleChange={setOpen}
      visible={open.value}
      label={
        <FieldLabel
          ellipsis
          size={size}
          onClear={() => {
            onChange?.()
            setTempValue(undefined)
          }}
          bordered={bordered}
          style={style}
          class={props.class}
          label={label}
          placeholder={placeholder}
          value={labelText.value}
          disabled={disabled}
          expanded={open.value}
          formatter={labelFormatter}
          allowClear={allowClear}
        />
      }
      footer={{
        onClear: () => setTempValue(undefined),
        onConfirm: () => {
          onChange?.(tempValue)
          setOpen(false)
        }
      }}
      footerRender={footerRender}
    >
      <div
        class={{
          [`${prefixCls}-container`]: true,
          [`${props.class}`]: props.class
        }}
        style={style}
      >
        {slots.default?.().map(children => {
          return cloneVNode(children as JSX.Element, {
            ...rest,
            [valuePropName!]: tempValue,
            onChange: (e: any) => {
              setTempValue(e?.target ? e.target.value : e)
            },
            ...(children as JSX.Element).props
          })
        })}
      </div>
    </FilterDropdown>
  )
}

export default LightWrapper
