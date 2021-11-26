import type { ProFormProps } from './layouts/ProForm'
import ProForm from './layouts/ProForm'
import LightFilter from './layouts/LightFilter';
import ProFormItem from './components/FormItem'
import ProFormText from './components/Text'

export type {
  ProFormProps
}

const ProFormGroup = ProForm.Group

export {
  ProFormItem,
  ProFormText,
  ProFormGroup,
  // layouts
  LightFilter
}

export default ProForm
