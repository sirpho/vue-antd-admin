import { DatePicker } from 'ant-design-vue'
import moment from 'moment'
import { parseValueToMoment } from '@gx-design/pro-utils'

import type { ProFieldFC } from '../../index'

/**
 * 与当前的时间进行比较 http://momentjs.cn/docs/displaying/fromnow.html
 *
 * @param
 */
const FieldFromNow: ProFieldFC<{
  text: string;
  format?: string;
}> = ({ text, mode, render, renderFormItem, format, fieldProps }) => {

  if (mode === 'read') {
    const dom = (
      <a-tooltip title={moment(text).format(fieldProps?.format || format || 'YYYY-MM-DD HH:mm:ss')}>
        {moment(text).fromNow()}
      </a-tooltip>
    )
    if (render) {
      return render(text, { mode, ...fieldProps }, <>{dom}</>)
    }
    return <>{dom}</>
  }
  if (mode === 'edit' || mode === 'update') {
    const placeholder = '请选择'
    const momentValue = parseValueToMoment(fieldProps.value) as moment.Moment
    const dom = (
      <DatePicker placeholder={placeholder} showTime {...fieldProps} value={momentValue} />
    )
    if (renderFormItem) {
      return renderFormItem(text, { mode, ...fieldProps }, dom)
    }
    return dom
  }
  return null
}

export default FieldFromNow
