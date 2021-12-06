import type { ProFieldFC } from '../../index'

export type FieldImageProps = {
  text: string;
  width?: number;
  placeholder?: string | string[] | undefined;
};

/**
 * 数字组件
 *
 * @param FieldImageProps {
 *     text: number;
 *     moneySymbol?: string; }
 */
const FieldImage: ProFieldFC<FieldImageProps> = ({
  text,
  mode: type,
  render,
  renderFormItem,
  fieldProps,
  placeholder,
  width
}) => {
  if (type === 'read') {
    const dom = <g-image width={width || 32} fit="cover" src={text} previewSrcList={[ text ]} {...fieldProps} />
    if (render) {
      return render(text, { mode: type, ...fieldProps }, dom)
    }
    return dom
  }
  if (type === 'edit' || type === 'update') {
    const dom = <a-input placeholder={placeholder} {...fieldProps} />
    if (renderFormItem) {
      return renderFormItem(text, { mode: type, ...fieldProps }, dom)
    }
    return dom
  }
  return null
}

export default FieldImage
