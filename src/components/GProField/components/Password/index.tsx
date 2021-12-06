import { ref, watch } from 'vue'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue'
import type { ProFieldFC } from '../../index'

/**
 * 最基本的组件，就是个普通的 Input.Password
 *
 * @param
 */
const FieldPassword: ProFieldFC<{
  text: string;
  visible?: boolean;
  onVisible?: (visible: boolean) => void;
}> = ({ text, mode, render, renderFormItem, fieldProps, proFieldKey, ...rest }) => {
  const visible = ref<boolean>(rest.visible || false)

  const setVisible = (value: boolean) => {
    visible.value = value
    rest.onVisible(value)
  }

  watch(
    () => rest.visible,
    (value) => {
      visible.value = value
    },
    {
      deep: true,
      immediate: true
    }
  )

  if (mode === 'read') {
    let dom = <>-</>
    if (text) {
      dom = (
        <a-space>
          <span>{visible.value ? text : '＊ ＊ ＊ ＊ ＊'}</span>
          <a onClick={() => setVisible(!visible.value)}>
            {visible.value ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </a>
        </a-space>
      )
    }
    if (render) {
      return render(text, { mode, ...fieldProps }, dom)
    }
    return dom
  }
  if (mode === 'edit' || mode === 'update') {
    const dom = (
      <a-input-password
        placeholder="请输入"
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

export default FieldPassword
