import { ComputedRef, inject, InjectionKey, provide } from 'vue'
import type { NamePath } from 'ant-design-vue/lib/form/interface'

// @ts-ignore
export type ContextType<T> = any;

export interface FormItemContextProps {
  name?: NamePath;
  label?: VueNode;
}

const formItemContextInjectKey: InjectionKey<FormItemContextProps> = Symbol('formItem-context')

export const useContext = <T>(
  contextInjectKey: string | InjectionKey<ContextType<T>> = Symbol(),
  defaultValue?: ContextType<T>
): T => {
  return inject(contextInjectKey, defaultValue || ({} as T))
}

export const provideFormItemContext = (value: FormItemContextProps | ComputedRef<FormItemContextProps>) => {
  provide(formItemContextInjectKey, value)
}

export const useFormItemContext = () =>
  useContext<Required<FormItemContextProps>>(formItemContextInjectKey, [])
