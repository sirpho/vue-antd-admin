import {
  defineComponent,
  FunctionalComponent,
  isVNode,
  cloneVNode,
  reactive,
  watch
} from 'vue'
import { noteOnce } from 'ant-design-vue/es/vc-util/warning'
import type {
  ProFieldValueType,
  ProFieldValueObjectType,
  ProFieldRequestData,
  ProFieldTextType
} from '/@/components/_util/typings'
import type { ProFieldFCRenderProps, ProRenderFieldPropsType, BaseProFieldFC } from './typings'
import type { FieldMoneyProps } from './components/Money'
import { omitUndefined } from '/@/components/_util'
import pickProProps from '/@/components/_util/pickProProps'
import { proFieldPropsType } from './props'
import FieldImage from './components/Image'
import FieldMoney from './components/Money'
import FieldText from './components/Text'
import FieldColorPicker from './components/ColorPicker'
import FieldDigit from './components/Digit'
import FieldSecond from './components/Second'
import FieldPercent from './components/Percent'
import FieldRate from './components/Rate'
import FieldSelect from './components/Select'

const REQUEST_VALUE_TYPE = [ 'select', 'radio', 'radioButton', 'checkbook' ]

export type ProFieldMoneyProps = FieldMoneyProps;

export type ProFieldEmptyText = string | false;

/** 默认的 Field 需要实现的功能 */
export type ProFieldFC<T> = FunctionalComponent<BaseProFieldFC & ProRenderFieldPropsType & T>;

/** Value type by function */
export type ProFieldValueTypeFunction<T> = (item: T) => ProFieldValueType | ProFieldValueObjectType;

const defaultRenderTextByObject = (
  text: ProFieldTextType,
  valueType: ProFieldValueObjectType,
  props: RenderProps
): any => {
  const pickFormItemProps = pickProProps(props.fieldProps)

  if (valueType.type === 'money') {
    return (
      <FieldMoney
        {...props}
        fieldProps={pickFormItemProps}
        text={text as number}
        moneySymbol={valueType.moneySymbol}
      />
    )
  }

  if (valueType.type === 'image') {
    return <FieldImage {...props} text={text as string} width={valueType.width} />
  }

  return text
}

const defaultRenderText = (
  text: ProFieldTextType,
  valueType: ProFieldValueType | ProFieldValueObjectType,
  props: RenderProps
): VueNode => {
  const { mode = 'read', emptyText = '-' } = props

  if (emptyText !== false && mode === 'read' && valueType !== 'option' && valueType !== 'switch') {
    if (typeof text !== 'boolean' && typeof text !== 'number' && !text) {
      const { fieldProps, render } = props
      if (render) {
        return render(text, { mode, ...fieldProps }, <>{emptyText}</>)
      }
      return <>{emptyText}</>
    }
  }

  delete props.emptyText

  if (typeof valueType === 'object') {
    return defaultRenderTextByObject(text, valueType, props)
  }

  const needValueEnum = REQUEST_VALUE_TYPE.includes(valueType as string)

  const hasValueEnum = !!(
    props.valueEnum ||
    props.request ||
    props.options ||
    props.fieldProps?.options
  )

  noteOnce(
    !needValueEnum || hasValueEnum,
    `如果设置了 valueType 为 ${REQUEST_VALUE_TYPE.join(
      ','
    )}中任意一个，则需要配置options，request, valueEnum 其中之一，否则无法生成选项。`
  )

  noteOnce(
    !needValueEnum || hasValueEnum,
    `If you set valueType to any of ${REQUEST_VALUE_TYPE.join(
      ','
    )}, you need to configure options, request or valueEnum.`
  )

  /** 如果是金额的值 */
  if (valueType === 'money') {
    return <FieldMoney {...props} text={text as number} />
  }

  /** 百分比, 默认展示符号, 不展示小数位 */
  if (valueType === 'percent') {
    return <FieldPercent text={text as number} {...props} />
  }

  if (valueType === 'avatar' && typeof text === 'string' && props.mode === 'read') {
    return <a-avatar src={text as string} size={22} shape="circle" />
  }

  if (valueType === 'digit') {
    return <FieldDigit text={text as number} {...props} />
  }

  if (valueType === 'second') {
    return <FieldSecond text={text as number} {...props} />
  }

  if (valueType === 'select' || (valueType === 'text' && (props.valueEnum || props.request))) {
    return <FieldSelect text={text as string} {...props} />
  }

  if (valueType === 'rate') {
    return <FieldRate text={text as string} {...props} />
  }

  if (valueType === 'image') {
    return <FieldImage text={text as string} {...props} />
  }

  if (valueType === 'color') {
    return <FieldColorPicker text={text as string} {...props} />
  }

  return <FieldText text={text as string} {...props} />
}

const defaultRenderValue = (
  valueType: ProFieldValueType | ProFieldValueObjectType,
  props: RenderProps
) => {
  if (valueType === 'image') return ''
  if (valueType === 'avatar') return ''
  if (valueType === 'color') return ''
  if (valueType === 'money') return ''
  if (valueType === 'digit') return ''
  if (valueType === 'percent') return ''
  if (valueType === 'second') return ''
  if (valueType === 'select' || (valueType === 'text' && (props.valueEnum || props.request))) return undefined
  return ''
}

const defaultChangeValue = (
  valueType: ProFieldValueType | ProFieldValueObjectType,
  value: any,
  props: RenderProps
) => {
  if (valueType === 'image') return value.target.value
  if (valueType === 'avatar') return value.target.value
  if (valueType === 'color') return value
  if (valueType === 'money') return value
  if (valueType === 'digit') return value
  if (valueType === 'percent') return value
  if (valueType === 'second') return value
  if (valueType === 'select' || (valueType === 'text' && (props.valueEnum || props.request))) return value
  return value.target.value
}

type RenderProps = Omit<ProFieldFCRenderProps, 'text'> &
  ProRenderFieldPropsType & {
  /** 从服务器读取选项 */
  request?: ProFieldRequestData;
  emptyText?: VueNode;
  visible?: boolean;
  onVisible?: (visible: boolean) => void;
  [key: string]: any;
};

export default defineComponent({
  props: proFieldPropsType,
  emits: [ 'change', 'update:value' ],
  setup(props, { emit }) {
    const getFieldProps = (val) => {
      return {
        value: props.value || defaultRenderValue(props.valueType || 'text', props),
        // fieldProps 优先级更高，在类似 LightFilter 场景下需要覆盖默认的 value 和 onChange
        ...omitUndefined(val) as object,
        onChange: (params) => {
          handleChange(params)
        }
      }
    }

    let fieldProps = reactive(getFieldProps(props.fieldProps))

    watch(() => props.value, (val) => {
      fieldProps.value = val || defaultRenderValue(props.valueType || 'text', props)
    }, {
      deep: true,
      immediate: true
    })

    watch(() => props.fieldProps, (val) => {
      fieldProps = getFieldProps(val)
    }, {
      deep: true,
      immediate: true
    })

    const handleChange = (params) => {
      const defaultValue = defaultChangeValue(props.valueType || 'text', params, props)
      fieldProps.value = defaultValue
      emit('change', defaultValue)
      emit('update:value', defaultValue)
      props.value?.onChange(...params)
    }

    return () => {
      const { text, valueType = 'text', onChange, renderFormItem, value, ...rest } = props
      return (
        <>
          {defaultRenderText(
            text ?? fieldProps?.value as any ?? '',
            valueType || 'text',
            {
              ...rest,
              mode: rest.mode || 'read',
              renderFormItem: renderFormItem
                ? (...restProps) => {
                  const newDom = renderFormItem(...restProps)
                  // renderFormItem 之后的dom可能没有props，这里会帮忙注入一下
                  if (isVNode(newDom))
                    return cloneVNode(newDom, {
                      placeholder:
                        rest.placeholder || '请输入',
                      ...fieldProps,
                      ...((newDom.props as any) || {})
                    })
                  return newDom
                }
                : undefined,
              placeholder: rest.placeholder || '请输入',
              fieldProps: pickProProps(fieldProps)
            }
          )}
        </>
      )
    }
  }
})
