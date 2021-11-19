import type { FunctionalComponent } from 'vue'
import type { FormProps } from 'ant-design-vue'
import type { CommonFormProps } from '../../BaseForm'
import BaseForm from '../../BaseForm'

export type ProFormProps<T = Record<string, any>> = Omit<FormProps, 'onFinish'> &
  CommonFormProps<T>;

const ProForm: FunctionalComponent<Record<string, any>> = (
  props: ProFormProps<Record<string, any>>,
  { slots }
) => {
  return (
    <BaseForm
      layout="vertical"
      submitter={{
        // 反转按钮，在正常模式下，按钮应该是主按钮在前
        render: (_, dom) => dom.reverse()
      }}
      contentRender={(items, submitter) => {
        return (
          <>
            {items}
            {submitter}
          </>
        )
      }}
      {...props}
    >
      {slots.default?.()}
    </BaseForm>
  )
}

export default ProForm
