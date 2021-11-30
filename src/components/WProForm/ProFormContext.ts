import { ComputedRef, inject, InjectionKey, provide } from 'vue'
import type { NamePath } from './typings'

// @ts-ignore
export type ContextType<T> = any;

export interface ProFormContextProps {
  getFieldsFormatValue?: (nameList?: NamePath[] | true) => any;
  getFieldFormatValue?: (nameList?: NamePath) => any;
}

const proFormContextInjectKey: InjectionKey<ProFormContextProps> = Symbol('proForm-context')

export const useContext = <T>(
  contextInjectKey: string | InjectionKey<ContextType<T>> = Symbol(),
  defaultValue?: ContextType<T>
): T => {
  return inject(contextInjectKey, defaultValue || ({} as T))
}

export const provideProFormContext = (value: ProFormContextProps | ComputedRef<ProFormContextProps>) => {
  provide(proFormContextInjectKey, value)
}

export const useProFormContext = () =>
  useContext<Required<ProFormContextProps>>(proFormContextInjectKey, [])
