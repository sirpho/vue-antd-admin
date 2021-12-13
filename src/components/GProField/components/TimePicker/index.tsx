import { ref } from 'vue'
import { TimePicker } from 'ant-design-vue'
import moment from 'moment'
import { getPrefixCls, parseValueToMoment, FieldLabel } from '@gx-design/pro-utils'
import type { ProFieldFC } from '../../index'

/**
 * 日期选择组件
 *
 * @param
 */
const FieldTimePicker: ProFieldFC<{
  text: string | number;
  format: string;
}> = ({ text, mode, light, label, format, render, renderFormItem, plain, fieldProps }) => {
  const prefixCls = getPrefixCls({
    suffixCls: 'field-date-picker',
    isPor: true
  })
  const open = ref<boolean>(false)

  const setOpen = (value: boolean) => {
    open.value = value
  }
  const finalFormat = fieldProps?.format || format || 'HH:mm:ss'

  const isNumberOrMoment = moment.isMoment(text) || typeof text === 'number'

  if (mode === 'read') {
    const dom = (
      <span>
        {text ? moment(text, isNumberOrMoment ? undefined : finalFormat).format(finalFormat) : '-'}
      </span>
    )
    if (render) {
      return render(text, { mode, ...fieldProps }, <span>{dom}</span>)
    }
    return dom
  }
  if (mode === 'edit' || mode === 'update') {
    let dom
    const { disabled, onChange, placeholder, allowClear, value } = fieldProps
    const momentValue = parseValueToMoment(value, finalFormat) as moment.Moment
    if (light) {
      const valueStr: string = (momentValue && momentValue.format(finalFormat)) || ''
      dom = (
        <div
          class={`${prefixCls}-light`}
          onClick={() => {
            setOpen(true)
          }}
        >
          <TimePicker
            value={momentValue}
            format={format}
            {...fieldProps}
            onChange={(v) => {
              onChange?.(v)
              setTimeout(() => {
                setOpen(false)
              }, 0)
            }}
            onOpenChange={setOpen}
            open={open.value}
          />
          <FieldLabel
            label={label}
            disabled={disabled}
            placeholder={placeholder}
            value={valueStr}
            allowClear={allowClear}
            onClear={() => {
              onChange?.(null)
            }}
            expanded={open.value}
          />
        </div>
      )
    } else {
      dom = (
        <TimePicker
          format={format}
          bordered={plain === undefined ? true : !plain}
          {...fieldProps}
          value={momentValue}
        />
      )
    }
    if (renderFormItem) {
      return renderFormItem(text, { mode, ...fieldProps }, dom)
    }
    return dom
  }
  return null
}

/**
 * 时间区间选择
 *
 * @param param0
 * @param ref
 */
const FieldTimeRangePicker: ProFieldFC<{
  text: (string | number)[];
  format: string;
}> = ({ text, mode, format, render, renderFormItem, plain, fieldProps }) => {
  const [ startText, endText ] = Array.isArray(text) ? text : []
  const parsedStartText: string = startText
    ? moment(startText).format(fieldProps?.format || format || 'YYYY-MM-DD')
    : ''
  const parsedEndText: string = endText
    ? moment(endText).format(fieldProps?.format || format || 'YYYY-MM-DD')
    : ''

  if (mode === 'read') {
    const dom = (
      <div>
        <div>{parsedStartText || '-'}</div>
        <div>{parsedEndText || '-'}</div>
      </div>
    )
    if (render) {
      return render(text, { mode, ...fieldProps }, <span>{dom}</span>)
    }
    return dom
  }
  if (mode === 'edit' || mode === 'update') {
    const { value } = fieldProps
    const momentValue = parseValueToMoment(value) as moment.Moment[]

    const dom = (
      <TimePicker.RangePicker
        format={format}
        bordered={plain === undefined ? true : !plain}
        {...fieldProps}
        value={momentValue}
      />
    )
    if (renderFormItem) {
      return renderFormItem(text, { mode, ...fieldProps }, dom)
    }
    return dom
  }
  return null
}

export { FieldTimeRangePicker }

export default FieldTimePicker
