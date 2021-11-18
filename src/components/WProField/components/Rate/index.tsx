import type { ProFieldFC } from '../../index'

/**
 * 评分组件
 *
 * @param
 */
const FieldRate: ProFieldFC<{
  text: string;
}> = ({ text, mode, render, renderFormItem, fieldProps }) => {
  if (mode === 'read') {
    const dom = <a-rate allowHalf disabled {...fieldProps} value={Number(text)} />
    if (render) {
      return render(text, { mode, ...fieldProps }, <>{dom}</>)
    }
    return dom
  }
  if (mode === 'edit' || mode === 'update') {
    const dom = <a-rate allowHalf {...fieldProps} value={Number(fieldProps.value)} />
    if (renderFormItem) {
      return renderFormItem(text, { mode, ...fieldProps }, dom)
    }
    return dom
  }
  return null
}

export default FieldRate
