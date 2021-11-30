import type { HTMLAttributes } from 'vue'
import type { FormItemProps, ColProps } from 'ant-design-vue'
import type { RequiredMark, ValidationRule } from 'ant-design-vue/lib/form/Form'
import type { Options } from 'scroll-into-view-if-needed'
import { PropTypes } from '/@/utils'
import type { ProRequestData, SizeType } from '@wd-design/pro-utils'
import { tuple } from '@wd-design/pro-utils'
import type { FormInstance, ProFormInstance, GroupProps, FieldProps, Callbacks } from '../typings'
import type { SubmitterProps } from '../components/Submitter'

export const formProps = {
  layout: PropTypes.oneOf(tuple('horizontal', 'inline', 'vertical')),
  labelCol: { type: Object as PropType<ColProps & HTMLAttributes> },
  wrapperCol: { type: Object as PropType<ColProps & HTMLAttributes> },
  colon: PropTypes.looseBool,
  labelAlign: PropTypes.oneOf(tuple('left', 'right')),
  prefixCls: PropTypes.string,
  requiredMark: { type: [ String, Boolean ] as PropType<RequiredMark | ''>, default: undefined },
  /** @deprecated Will warning in future branch. Pls use `requiredMark` instead. */
  hideRequiredMark: PropTypes.looseBool,
  model: PropTypes.object,
  rules: { type: Object as PropType<{ [k: string]: ValidationRule[] | ValidationRule }> },
  validateMessages: PropTypes.object,
  validateOnRuleChange: PropTypes.looseBool,
  // 提交失败自动滚动到第一个错误字段
  scrollToFirstError: { type: [ Boolean, Object ] as PropType<boolean | Options> },
  onSubmit: PropTypes.func,
  name: PropTypes.string,
  validateTrigger: { type: [ String, Array ] as PropType<string | string[]> },
  size: { type: String as PropType<SizeType> },
  onValuesChange: { type: Function as PropType<Callbacks['onValuesChange']> },
  onFieldsChange: { type: Function as PropType<Callbacks['onFieldsChange']> },
  onFinish: { type: Function as PropType<Callbacks['onFinish']> },
  onFinishFailed: { type: Function as PropType<Callbacks['onFinishFailed']> },
  onValidate: { type: Function as PropType<Callbacks['onValidate']> }
}

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
  onValuesChange: Function as PropType<(changedValues: any, values: any) => void>,
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
  ...formProps,
  ...commonProps
}
