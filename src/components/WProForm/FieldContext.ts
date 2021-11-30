import { inject, InjectionKey, provide, Ref } from 'vue'
import type { FormItemProps } from 'ant-design-vue'
import type { ProSchemaValueType, SearchTransformKeyFn } from '@wd-design/pro-utils'
import type { GroupProps, FieldProps, ProFormInstance, NamePath } from './typings'

// @ts-ignore
export type ContextType<T> = any;

export interface FieldContextProps {
  fieldProps?: FieldProps;
  lightFilterModelRef?: any;
  formItemProps?: FormItemProps;
  groupProps?: GroupProps;
  setFieldValueType?: (
    name: NamePath,
    obj: {
      valueType?: ProSchemaValueType<'text'>;
      dateFormat?: string;
      /** 数据转化的地方 */
      transform?: SearchTransformKeyFn;
    }
  ) => void;
  formRef?: ProFormInstance;
  handleChangeModel?: (fieldVal: any) => void;
  /** Form 组件的类型 */
  formComponentType?: string;

  /** 表单的 getPopupContainer 控制 */
  getPopupContainer?: (e: HTMLElement) => ParentNode;
}

const fieldContextInjectKey: InjectionKey<FieldContextProps> = Symbol('field-context')

export const useContext = <T>(
  contextInjectKey: string | InjectionKey<ContextType<T>> = Symbol(),
  defaultValue?: ContextType<T>
): T => {
  return inject(contextInjectKey, defaultValue || ({} as T))
}

export const provideFieldContext = (value: FieldContextProps | Ref<FieldContextProps>) => {
  provide(fieldContextInjectKey, value)
}

export const useFieldContext = () =>
  useContext<Required<FieldContextProps>>(fieldContextInjectKey, [])
