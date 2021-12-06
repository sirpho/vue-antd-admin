import { ref, watch } from 'vue'
import type { ProFieldFC } from '../../index'

/**
 * 最基本的组件，就是个普通的 Input
 *
 * @param
 */

const FieldText: ProFieldFC<{
  text: string;
  emptyText?: VueNode;
}> = ({
  text,
  mode,
  render,
  renderFormItem,
  fieldProps,
  emptyText = '-'
}) => {
  const inputRef = ref<HTMLInputElement>()

  watch(() => fieldProps.autoFocus, (val) => {
    if (val) {
      inputRef?.value?.focus()
    }
  }, {
    deep: true,
    immediate: true
  })

  if (mode === 'read') {
    const dom = text ?? emptyText

    if (render) {
      return (
        render(
          text,
          { mode, ...fieldProps },
          <>
            {fieldProps?.prefix || ''}
            {dom}
            {fieldProps?.suffix || ''}
          </>
        ) ?? emptyText
      )
    }
    return (
      <>
        {fieldProps?.prefix || ''}
        {dom}
        {fieldProps?.suffix || ''}
      </>
    )
  }

  if (mode === 'edit' || mode === 'update') {
    const placeholder = '请输入'
    const dom = <a-input
      ref={e => inputRef.value = e}
      placeholder={placeholder}
      allowClear
      {...fieldProps}
    />

    if (renderFormItem) {
      return renderFormItem(text, { mode, ...fieldProps }, dom)
    }
    return dom
  }
  return null
}

export default FieldText
