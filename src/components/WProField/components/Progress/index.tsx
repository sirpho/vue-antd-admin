import { toNumber } from 'lodash-es'
import { useMemo } from '@wd-design/pro-hooks/core'
import type { ProFieldFC } from '../../index'

export function getProgressStatus(text: number): 'success' | 'exception' | 'normal' | 'active' {
  if (typeof text !== 'number') {
    return 'exception'
  }
  if (text === 100) {
    return 'success'
  }
  if (text < 0) {
    return 'exception'
  }
  if (text < 100) {
    return 'active'
  }

  return 'normal'
}

/**
 * 进度条组件
 *
 * @param
 */
const FieldProgress: ProFieldFC<{
  text: number | string;
  placeholder?: any;
}> = ({
  text,
  mode,
  render,
  plain,
  renderFormItem,
  fieldProps,
  placeholder
}) => {
  const realValue = useMemo(
    () =>
      typeof text === 'string' && (text as string).includes('%')
        ? toNumber((text as string).replace('%', ''))
        : toNumber(text),
    [ () => text ]
  )
  if (mode === 'read') {
    const dom = (
      <a-progress
        size="small"
        style={{ minWidth: '100px', maxWidth: '320px' }}
        percent={realValue.value}
        steps={plain ? 10 : undefined}
        status={getProgressStatus(realValue.value as number)}
        {...fieldProps}
      />
    )
    if (render) {
      return render(realValue, { mode, ...fieldProps }, dom)
    }
    return dom
  }

  if (mode === 'edit' || mode === 'update') {
    const dom = (
      <a-input-number
        placeholder={placeholder}
        {...fieldProps}
      />
    )
    if (renderFormItem) {
      return renderFormItem(text, { mode, ...fieldProps }, dom)
    }
    return dom
  }
  return null
}

export default FieldProgress
