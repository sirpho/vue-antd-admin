import moment from 'moment'
import { DatePicker } from 'ant-design-vue'
import { parseValueToMoment } from '@wd-design/pro-utils'
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
    const momentValue = parseValueToMoment(fieldProps.value) as moment.Moment
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
