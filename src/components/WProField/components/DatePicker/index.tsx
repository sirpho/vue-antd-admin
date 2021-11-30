import { ref } from 'vue'
import moment from 'moment'
import { DatePicker, DatePickerProps } from 'ant-design-vue'
import { FieldLabel, getPrefixCls, parseValueToMoment } from '@wd-design/pro-utils'
import type { ProFieldFC } from '../../index'
import './index.less'


/**
 * 日期选择组件
 *
 * @param
 */
const FieldDatePicker: ProFieldFC<{
  text: string | number;
  format: string;
  showTime?: boolean;
  bordered?: boolean;
  picker?: DatePickerProps['picker'];
}> = (
  {
    text,
    mode,
    format,
    label,
    light,
    render,
    renderFormItem,
    plain,
    showTime,
    fieldProps,
    picker,
    bordered
  }
) => {
  const prefixCls = getPrefixCls({
    suffixCls: 'field-date-picker'
  })
  const open = ref<boolean>(false)
  const setOpen = (value: boolean) => {
    open.value = value
  }
  if (mode === 'read') {
    const dom = (
      <span>
        {text ? moment(text).format(fieldProps.format || format || 'YYYY-MM-DD') : '-'}
      </span>
    )
    if (render) {
      return render(text, { mode, ...fieldProps }, <span>{dom}</span>)
    }
    return dom
  }
  if (mode === 'edit' || mode === 'update') {
    let dom
    const {
      disabled,
      value,
      onChange,
      allowClear,
      placeholder = '请选择'
    } = fieldProps

    const momentValue = parseValueToMoment(value) as moment.Moment

    if (light) {
      const valueStr: string = (momentValue && momentValue.format(format)) || ''
      dom = (
        <div
          class={`${prefixCls}-light`}
          onClick={() => {
            setOpen(true)
          }}
        >
          <DatePicker
            picker={picker}
            showTime={showTime}
            format={format}
            {...fieldProps}
            value={momentValue}
            onChange={(v) => {
              onChange?.(v)
              setTimeout(() => {
                setOpen(false)
              }, 0)
            }}
            onOpenChange={setOpen}
            open={open}
          />
          <FieldLabel
            label={label}
            disabled={disabled}
            placeholder={placeholder}
            value={valueStr}
            onClear={() => {
              onChange?.(null)
            }}
            allowClear={allowClear}
            bordered={bordered}
            expanded={open.value}
          />
        </div>
      )
    } else {
      dom = (
        <DatePicker
          picker={picker}
          showTime={showTime}
          format={format}
          placeholder={placeholder}
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

export default FieldDatePicker
