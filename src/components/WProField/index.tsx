import type { FunctionalComponent } from 'vue'
import {
  defineComponent,
  isVNode,
  cloneVNode,
  watch,
  ref,
  computed,
  unref
} from 'vue'
import { noteOnce } from 'ant-design-vue/es/vc-util/warning'
import type {
  ProFieldValueType,
  ProFieldValueObjectType,
  ProFieldRequestData,
  ProFieldTextType
} from '@wd-design/pro-utils'
import { omitUndefined, pickProProps } from '@wd-design/pro-utils'
import type { ProFieldFCRenderProps, ProRenderFieldPropsType, BaseProFieldFC } from './typings'
import type { FieldMoneyProps } from './components/Money'
import { proFieldPropsType } from './props'
import FieldImage from './components/Image'
import FieldMoney from './components/Money'
import FieldDatePicker from './components/DatePicker'
import FieldFromNow from './components/FromNow'
import FieldRangePicker from './components/RangePicker'
import FieldTimePicker, { FieldTimeRangePicker } from './components/TimePicker'
import FieldText from './components/Text'
import FieldPassword from './components/Password'
import FieldDigit from './components/Digit'
import FieldSecond from './components/Second'
import FieldProgress from './components/Progress'
import FieldPercent from './components/Percent'
import FieldRate from './components/Rate'
import FieldSelect from './components/Select'
import FieldCheckbox from './components/Checkbox'
import FieldRadio from './components/Radio'
import FieldCascader from './components/Cascader'
import FieldColorPicker from './components/ColorPicker'
import FieldCode from './components/Code'

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

  if (valueType.type === 'progress') {
    return (
      <FieldProgress
        {...props}
        text={text as number}
        fieldProps={{
          status: valueType.status ? valueType.status : undefined,
          ...pickFormItemProps
        }}
      />
    )
  }

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

  if (valueType.type === 'percent') {
    return (
      <FieldPercent
        {...props}
        text={text as number}
        showSymbol={valueType.showSymbol}
        precision={valueType.precision}
        fieldProps={pickFormItemProps}
        showColor={valueType.showColor}
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

  /** 如果是日期的值 */
  if (valueType === 'date') {
    return <FieldDatePicker text={text as string} format="YYYY-MM-DD" {...props} />
  }

  /** 如果是周的值 */
  if (valueType === 'dateWeek') {
    return <FieldDatePicker text={text as string} format="YYYY-wo" picker="week" {...props} />
  }

  /** 如果是月的值 */
  if (valueType === 'dateMonth') {
    return <FieldDatePicker text={text as string} format="YYYY-MM" picker="month" {...props} />
  }

  /** 如果是季度的值 */
  if (valueType === 'dateQuarter') {
    return <FieldDatePicker text={text as string} format="YYYY-\QQ" picker="quarter" {...props} />
  }

  /** 如果是年的值 */
  if (valueType === 'dateYear') {
    return <FieldDatePicker text={text as string} format="YYYY" picker="year" {...props} />
  }

  /** 如果是日期范围的值 */
  if (valueType === 'dateRange') {
    return <FieldRangePicker text={text as string[]} format="YYYY-MM-DD" {...props} />
  }

  /** 如果是日期加时间类型的值 */
  if (valueType === 'dateTime') {
    return (
      <FieldDatePicker text={text as string} format="YYYY-MM-DD HH:mm:ss" showTime {...props} />
    )
  }

  /** 如果是日期加时间类型的值的值 */
  if (valueType === 'dateTimeRange') {
    // 值不存在的时候显示 "-"
    return (
      <FieldRangePicker text={text as string[]} format="YYYY-MM-DD HH:mm:ss" showTime {...props} />
    )
  }

  /** 如果是时间类型的值 */
  if (valueType === 'time') {
    return <FieldTimePicker text={text as string} format="HH:mm:ss" {...props} />
  }

  /** 如果是时间类型的值 */
  if (valueType === 'timeRange') {
    return <FieldTimeRangePicker text={text as string[]} format="HH:mm:ss" {...props} />
  }

  if (valueType === 'fromNow') {
    return <FieldFromNow text={text as string} {...props} />
  }

  if (valueType === 'progress') {
    return <FieldProgress {...props} text={text as number} />
  }

  /** 百分比, 默认展示符号, 不展示小数位 */
  if (valueType === 'percent') {
    return <FieldPercent text={text as number} {...props} />
  }

  if (valueType === 'avatar' && typeof text === 'string' && props.mode === 'read') {
    return <a-avatar src={text as string} size={22} shape="circle" />
  }

  if (valueType === 'code') {
    return <FieldCode text={text as string} {...props} />
  }

  if (valueType === 'jsonCode') {
    return <FieldCode text={text as string} language="json" {...props} />
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

  if (valueType === 'checkbox') {
    return <FieldCheckbox text={text as string} {...props} />
  }

  if (valueType === 'radio') {
    return <FieldRadio text={text as string} {...props} />
  }

  if (valueType === 'radioButton') {
    return <FieldRadio radioType="button" text={text as string} {...props} />
  }

  if (valueType === 'rate') {
    return <FieldRate text={text as string} {...props} />
  }

  if (valueType === 'password') {
    return <FieldPassword text={text as string} {...props} />
  }

  if (valueType === 'image') {
    return <FieldImage text={text as string} {...props} />
  }

  if (valueType === 'cascader') {
    return <FieldCascader text={text as string} {...props} />
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
  const renderNull = [
    'date',
    'dateWeek',
    'dateMonth',
    'dateQuarter',
    'dateYear',
    'dateTime',
    'fromNow',
    'time'
  ]
  const renderAarray = [ 'cascader', 'dateRange', 'dateTimeRange', 'timeRange' ]
  let type = valueType
  if (typeof valueType === 'object') {
    type = valueType.type
  }
  if (type === 'select' || (type === 'text' && (props.valueEnum || props.request))) return undefined
  if (renderAarray.includes(type as string)) return []
  if (renderNull.includes(type as string)) return null
  return ''
}

const defaultChangeValue = (
  valueType: ProFieldValueType | ProFieldValueObjectType,
  value: any,
  props: RenderProps
) => {
  const renderValue: string[] = [
    'color',
    'money',
    'digit',
    'percent',
    'second',
    'checkbox',
    'cascader',
    'progress',
    'date',
    'dateWeek',
    'dateMonth',
    'dateQuarter',
    'dateYear',
    'dateTime',
    'fromNow',
    'dateRange',
    'dateTimeRange',
    'time',
    'timeRange'
  ]
  let type = valueType
  if (typeof valueType === 'object') {
    type = valueType.type
  }
  if (renderValue.includes(type as string)) return value
  if (type === 'select' || (type === 'text' && (props.valueEnum || props.request))) return value
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
  emits: [ 'change', 'update:value', 'blur' ],
  setup(props, { emit }) {
    const fieldValue = ref<any>()

    const getFieldProps = computed(() => {
      return {
        value: fieldValue.value,
        // fieldProps 优先级更高，在类似 LightFilter 场景下需要覆盖默认的 value 和 onChange
        ...omitUndefined(props.fieldProps) as object,
        onChange: (params) => {
          handleChange(params)
        }
      }
    })

    watch(() => props.value, (val) => {
      fieldValue.value = val || defaultRenderValue(props.valueType || 'text', props)
    }, {
      deep: true,
      immediate: true
    })

    watch(() => props.mode, (_) => {
      fieldValue.value = props.value || defaultRenderValue(props.valueType || 'text', props)
    }, {
      deep: true,
      immediate: true
    })

    const handleChange = (params) => {
      const defaultValue = defaultChangeValue(props.valueType || 'text', params, props)
      fieldValue.value = defaultValue
      emit('change', defaultValue)
      emit('update:value', defaultValue)
    }

    return () => {
      const { text, valueType = 'text', onChange, renderFormItem, value, ...rest } = props
      return (
        <>
          {defaultRenderText(
            text ?? unref(getFieldProps)?.value as any ?? '',
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
                      ...unref(getFieldProps),
                      ...((newDom.props as any) || {})
                    })
                  return newDom
                }
                : undefined,
              placeholder: rest.placeholder || '请输入',
              fieldProps: pickProProps(unref(getFieldProps))
            }
          )}
        </>
      )
    }
  }
})
