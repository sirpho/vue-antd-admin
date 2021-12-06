import type { ProFieldFC } from '../../index'

export const DEFAULT_COLORS = [
  '#FF9D4E', // 0 - 橘黄色
  '#5BD8A6', // 1 - 绿色
  '#5B8FF9', // 2 - 蓝色
  '#F7664E', // 3 - 红色
  '#FF86B7', // 4 - 水红色
  '#2B9E9D', // 5 - 墨绿色
  '#9270CA', // 6 - 紫色
  '#6DC8EC', // 7 - 浅蓝色
  '#667796', // 8 - 黛蓝色
  '#F6BD16' // 9 - 黄色
]

/**
 * 颜色组件
 *
 * @param FieldColorPicker {
 *     text: number;
 *     moneySymbol?: string; }
 */
const FieldColorPicker: ProFieldFC<{
  text: string;
}> = ({ text, mode: type, render, renderFormItem, fieldProps }) => {
  if (type === 'read') {
    const dom = <g-color value={text} readonly />
    if (render) {
      return render(text, { mode: type, ...fieldProps }, dom)
    }
    return dom
  }
  if (type === 'edit' || type === 'update') {
    const dom = <g-color {...fieldProps} predefine={fieldProps?.predefine || DEFAULT_COLORS} />
    if (renderFormItem) {
      return renderFormItem(text, { mode: type, ...fieldProps }, dom)
    }
    return dom
  }
  return null
}

export default FieldColorPicker
