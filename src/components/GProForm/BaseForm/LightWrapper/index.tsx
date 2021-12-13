import type { CSSProperties } from 'vue'
import { cloneVNode, computed, defineComponent, ref, watch } from 'vue'
import { omit } from 'lodash-es'
import { PropTypes } from '/@/utils'
import {
  FieldLabel,
  FilterDropdown,
  getPrefixCls,
  dateFormatterMap,
  dateArrayFormatter
} from '@gx-design/pro-utils'
import { useFieldContext } from '../../FieldContext'
import { useFormItemContext } from '../../components/FormItem/FormItemContext'
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
      suffixCls: 'field-light-wrapper',
      isPor: true
    })

    const { handleChangeModel } = useFieldContext()
    const { name } = useFormItemContext()

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
      const field = {}
      field[name as string] = restParams[0]
      handleChangeModel(field)
    }

    const labelValue = computed(() => props.value)

    const labelText = ref<any>()

    /** DataRange的转化，moment 的 toString 有点不好用 */
    const changeLabelText = (labelValue, valueType, labelFormatter) => {
      if (valueType?.toLowerCase()?.endsWith('range') && !labelFormatter) {
        return dateArrayFormatter(
          labelValue,
          dateFormatterMap[props.valueType] || 'YYYY-MM-DD'
        )
      }
      return labelValue
    }

    watch(() => labelValue.value, (val) => {
      labelText.value = changeLabelText(val, props.valueType, props.labelFormatter)
    }, {
      deep: true,
      immediate: true
    })

    watch(() => props.valueType, (val) => {
      labelText.value = changeLabelText(labelValue.value, val, props.labelFormatter)
    }, {
      deep: true,
      immediate: true
    })

    watch(() => props.labelFormatter, (val) => {
      labelText.value = changeLabelText(labelValue.value, props.valueType, val)
    }, {
      deep: true,
      immediate: true
    })

    const isChildrenSymbol = (children) => {
      return children.length === 1 &&
        (
          String(children[0].type) === String(Symbol('Fragment')) ||
          String(children[0].type) === String(Symbol())
        )
    }

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
            onClear: () => {
              propsOnChange?.()
              setTempValue(undefined)
            },
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
              if (isChildrenSymbol(children)) {
                return cloneVNode((children) as JSX.Element, {
                  ...omit(rest, [ 'customLightMode' ]),
                  onChange: (e: any) => {
                    setTempValue(e?.target ? e.target.value : e)
                  },
                  ...(children as JSX.Element).props
                })
              }
              children.children = (children?.children as any[]).map(item => {
                return cloneVNode((item) as JSX.Element, {
                  ...omit(rest, [ 'customLightMode' ]),
                  onChange: (e: any) => {
                    setTempValue(e?.target ? e.target.value : e)
                  },
                  ...(item as JSX.Element).props
                })
              })
              return children
            })}
          </div>
        </FilterDropdown>
      )
    }
  }
})

export default LightWrapper
