import type { CSSProperties } from 'vue'
import { cloneVNode, computed, defineComponent, ref } from 'vue'
import { PropTypes } from '/@/utils'
import useMemo from '/@/hooks/core/useMemo'
import { FieldLabel, FilterDropdown, getPrefixCls } from '@wd-design/pro-utils'
import dateArrayFormatter from '/@/components/_util/dateArrayFormatter'
import { dateFormatterMap } from '/@/components/_util/conversionMomentValue'
import type { LightFilterFooterRender } from '../../typings'

import './index.less'

export type SizeType = 'small' | 'middle' | 'large' | undefined;

export const lightWrapperProps = {
  label: PropTypes.VNodeChild,
  disabled: PropTypes.bool,
  placeholder: PropTypes.VNodeChild,
  size: String as PropType<SizeType>,
  value: PropTypes.any,
  onChange: Function as PropType<(value?: any) => void>,
  onBlur: Function as PropType<(value?: any) => void>,
  style: PropTypes.style,
  class: PropTypes.string,
  customLightMode: PropTypes.bool,
  light: PropTypes.bool,
  labelFormatter: Function as PropType<(value: any) => string>,
  bordered: PropTypes.bool,
  otherFieldProps: PropTypes.any,
  valueType: PropTypes.string,
  allowClear: PropTypes.bool,
  footerRender: {
    type: [ Function, Boolean ] as PropType<LightFilterFooterRender>,
    default: undefined
  }
}

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
  customLightMode?: boolean;
  light?: boolean;
  labelFormatter?: (value: any) => string;
  bordered?: boolean;
  otherFieldProps?: any;
  valueType?: string;
  allowClear?: boolean;
  footerRender?: LightFilterFooterRender;
};

const LightWrapper = defineComponent({
  props: lightWrapperProps,
  setup(props, { slots }) {
    const prefixCls = getPrefixCls({
      suffixCls: 'field-light-wrapper'
    })

    const tempValue = ref<string | undefined>(props.value)
    const open = ref<boolean>(false)

    const setOpen = (value: boolean) => {
      open.value = value
    }

    const setTempValue = (value: string) => {
      tempValue.value = value
    }

    const propsOnChange = (...restParams: any[]) => {
      props.otherFieldProps?.onChange?.(...restParams)
      props.onChange?.(...restParams)
    }

    const labelValue = computed(() => props.value)

    /** DataRange的转化，moment 的 toString 有点不好用 */
    const labelText = useMemo(() => {
      if (props.valueType?.toLowerCase()?.endsWith('range') && !props.labelFormatter) {
        return dateArrayFormatter(
          labelValue.value,
          dateFormatterMap[props.valueType] || 'YYYY-MM-DD'
        )
      }
      return labelValue.value
    }, [ () => labelValue.value, () => props.valueType, () => props.labelFormatter ])

    return () => {
      const {
        label,
        size,
        disabled,
        onChange,
        style,
        placeholder,
        labelFormatter,
        bordered,
        footerRender,
        allowClear,
        otherFieldProps,
        valueType,
        ...rest
      } = props

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
                propsOnChange?.()
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
              propsOnChange?.(tempValue.value)
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
              return cloneVNode((children) as JSX.Element, {
                ...rest,
                onChange: (e: any) => {
                  console.log(e)
                  setTempValue(e?.target ? e.target.value : e)
                },
                ...(children as JSX.Element).props
              })
            })}
          </div>
        </FilterDropdown>
      )
    }
  }
})

export default LightWrapper
