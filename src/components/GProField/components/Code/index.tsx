import type { ProFieldFC } from '../../index'

const languageFormat = (text: string, language: string) => {
  if (typeof text !== 'string') {
    return text
  }
  try {
    if (language === 'json') {
      return JSON.stringify(JSON.parse(text), null, 2)
    }
  } catch (error) {
    // console.log(error)
  }
  return text
}

/**
 * 代码片段组件 这个组件为了显示简单的配置，复杂的请使用更加重型的组件
 *
 * @param
 */
const FieldCode: ProFieldFC<{
  text: string;
  language?: 'json' | 'text';
}> = ({ text, mode, render, language = 'text', renderFormItem, plain, fieldProps }) => {
  const code = languageFormat(text, language)
  if (mode === 'read') {
    const dom = (
      <pre
        {...fieldProps}
        style={{
          padding: '16px',
          overflow: 'auto',
          fontSize: '85%',
          lineHeight: 1.45,
          backgroundColor: '#f6f8fa',
          borderRadius: '3px',
          width: 'min-content',
          ...fieldProps.style
        }}
      >
        <code>{code}</code>
      </pre>
    )
    if (render) {
      return render(code, { mode, ...fieldProps }, dom)
    }
    return dom
  }
  if (mode === 'edit' || mode === 'update') {
    let dom = <a-textarea rows={5} {...fieldProps} />
    if (plain) {
      dom = <a-input {...fieldProps} />
    }
    if (renderFormItem) {
      return renderFormItem(code, { mode, ...fieldProps }, dom)
    }
    return dom
  }
  return null
}

export default FieldCode
