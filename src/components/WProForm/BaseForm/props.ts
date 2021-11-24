import type { FormItemProps } from 'ant-design-vue'
import { Form } from 'ant-design-vue'
import type { ProRequestData } from '/@/components/_util/useFetchData'
import type { FormInstance, ProFormInstance, GroupProps, FieldProps } from '../typings'
import type { SubmitterProps } from '../components/Submitter'

export const commonProps = {
  onFinish: Function as PropType<(formData: Record<string, any>) => Promise<boolean | void>>,
  onReset: Function as PropType<(value?: Record<string, any>) => void>,
  submitter: [ Object, Boolean ] as PropType<| SubmitterProps<{
    form?: FormInstance<any>;
  }>
    | false>,
  dateFormatter: [ Boolean, String ] as PropType<'number' | 'string' | false>,
  formRef: Function as PropType<(ref: ProFormInstance<Record<string, any>> | undefined) => void>,
  /** 发起网络请求的参数 */
  params: Object as PropType<Record<string, any>>,
  /** 发起网络请求的参数,返回值会覆盖给 initialValues */
  onInit: Function as PropType<(values: Record<string, any>, form: ProFormInstance<any>) => void>,
  request: Function as PropType<ProRequestData<Record<string, any>, Record<string, any>>>,
  contentRender: Function as PropType<(
    items: VueNode[],
    submitter: VueNode | undefined,
    form: FormInstance<any>
  ) => VueNode>,
  omitNil: Boolean as PropType<boolean>,
  isKeyPressSubmit: Boolean as PropType<boolean>,
  autoFocusFirstInput: Boolean as PropType<boolean>,
  fieldProps: Object as PropType<FieldProps>,
  formItemProps: Object as PropType<FormItemProps>,
  groupProps: Object as PropType<GroupProps>,
  formComponentType: String as PropType<'DrawerForm' | 'ModalForm' | 'QueryFilter'>
}

export const proFormProps = {
  ...Form.props,
  ...commonProps
}
