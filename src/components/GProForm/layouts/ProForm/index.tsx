import type { FunctionalComponent } from 'vue'
import type { FormProps } from 'ant-design-vue'
import type { GroupProps } from '../../typings'
import Group from '../../components/Group'
import type { CommonFormProps } from '../../BaseForm'
import BaseForm from '../../BaseForm'
import ProFormItem from '../../components/FormItem'

export type ProFormProps<T = Record<string, any>> = Omit<FormProps, 'onFinish'> &
  CommonFormProps<T>;

interface ProFormFC extends FunctionalComponent {
  Group: FunctionalComponent<GroupProps>;
  Item: any;
}

const ProForm: ProFormFC = (
  props: ProFormProps,
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

ProForm.Group = Group
ProForm.Item = ProFormItem

export default ProForm
