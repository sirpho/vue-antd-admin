import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { DatePicker } from 'ant-design-vue'
import { parseValueToMoment } from '@gx-design/pro-utils'
import type { ProFieldFC } from '../../index'

/**
 * 日期范围选择组件
 *
 * @param
 */
const FieldRangePicker: ProFieldFC<{
  text: string[];
  format: string;
  showTime?: boolean;
}> = ({ text, mode, format, render, renderFormItem, plain, showTime, fieldProps }) => {
  const [ startText, endText ] = Array.isArray(text) ? text : []
  const parsedStartText: string = startText
    ? dayjs(startText).format(fieldProps?.format || format || 'YYYY-MM-DD')
    : ''
  const parsedEndText: string = endText
    ? dayjs(endText).format(fieldProps?.format || format || 'YYYY-MM-DD')
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
    const momentValue = parseValueToMoment(fieldProps.value) as (Dayjs | Dayjs[])
    const dom = (
      <DatePicker.RangePicker
        format={format}
        showTime={showTime}
        placeholder={[
          '请选择',
          '请选择'
        ]}
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

export default FieldRangePicker
