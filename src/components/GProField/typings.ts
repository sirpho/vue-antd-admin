import type { Moment } from 'moment'
import type { ProSchemaValueEnumMap, ProSchemaValueEnumObj } from '@gx-design/pro-utils'

export type ProFieldFCMode = 'read' | 'edit' | 'update';

export type BaseProFieldFC = {
  /** 值的类型 */
  text: VueNode | VueNode[] | Moment | Moment[];
  /** 放置到组件上 props */
  fieldProps?: any;
  /** 模式类型 */
  mode: ProFieldFCMode;
  /** 简约模式 */
  plain?: boolean;
  /** 轻量模式 */
  light?: boolean;
  /** Label */
  label?: VueNode;
  /** 映射值的类型 */
  valueEnum?: ProSchemaValueEnumObj | ProSchemaValueEnumMap;
  /** 唯一的key，用于网络请求 */
  proFieldKey?: string | number;
};

/** Render 第二个参数，里面包含了一些常用的参数 */
export type ProFieldFCRenderProps = {
  mode?: ProFieldFCMode;
  placeholder?: string | string[];
  value?: any;
  onChange?: (...rest: any[]) => void;
} & BaseProFieldFC;

export type ProRenderFieldPropsType = {
  render?:
    | ((
    text: any,
    props: Omit<ProFieldFCRenderProps, 'value' | 'onChange'>,
    dom: JSX.Element
  ) => JSX.Element)
    | undefined;
  renderFormItem?:
    | ((text: any, props: ProFieldFCRenderProps, dom: JSX.Element) => JSX.Element)
    | undefined;
};
