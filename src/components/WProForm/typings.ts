import type { CSSProperties } from 'vue'
import type { SpaceProps } from 'ant-design-vue'
import type { NamePath, ValidateErrorEntity, RuleError } from 'ant-design-vue/lib/form/interface'
import type { validateOptions } from 'ant-design-vue/lib/form/useForm'
import type { LabelTooltipType } from '/@/components/_util/typings'

export declare type InternalNamePath = (string | number)[];

export interface Meta {
  errors: string[];
  warnings: string[];
  name: InternalNamePath;
}

export interface InternalFieldData extends Meta {
  value: StoreValue;
}

/**
 * Used by `setFields` config
 */
export interface FieldData extends Partial<Omit<InternalFieldData, 'name'>> {
  name: NamePath;
}

export type StoreValue = any;

export type RecursivePartial<T> = T extends object ? {
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends object ? RecursivePartial<T[P]> : T[P];
} : any;

export interface FormInstance<Values = any> {
  getFieldValue: (name: NamePath) => StoreValue;

  getFieldsValue(nameList: NamePath[] | true, filterFunc?: (meta: Meta) => boolean): any;

  getFieldsError: () => ValidateErrorEntity;
  resetFields: (fields?: NamePath[]) => void;
  setFieldsValue: (value: RecursivePartial<Values>) => void;
  validateFields: (
    name: string,
    value: any,
    rules: Record<string, unknown>[],
    option?: validateOptions
  ) => Promise<RuleError[]>;
  submit: () => void;
}

export type ProFormInstance<T = any> = FormInstance<T> & {
  /** 获取格式化之后所有数据 */
  getFieldsFormatValue?: (nameList?: NamePath[] | true) => Record<string, any>;
  /** 获取格式化之后的单个数据 */
  getFieldFormatValue?: (nameList?: NamePath) => Record<string, any>;
  /** 校验字段后返回格式化之后的所有数据 */
  validateFieldsReturnFormatValue?: (nameList?: NamePath[]) => Promise<T>;
};

export type FieldProps = {
  style?: CSSProperties;
  width?: string;
  format?: string;
};

export type GroupProps = {
  title?: VueNode;
  label?: VueNode;
  tooltip?: LabelTooltipType | string;
  extra?: VueNode;
  /** 组件之前的间隔 */
  size?: SpaceProps['size'];
  style?: CSSProperties;
  titleStyle?: CSSProperties;
  titleRender?: (title: VueNode, props: GroupProps) => VueNode;
  /** 子项的对齐方式 */
  align?: SpaceProps['align'];
  spaceProps?: SpaceProps;
  /** 子项的排列方式 */
  direction?: SpaceProps['direction'];
  labelLayout?: 'inline' | 'twoLine';
  /** 是否折叠 * */
  collapsed?: boolean;
  /** 是否可折叠 * */
  collapsible?: boolean;
  /** 默认的折叠状态 */
  defaultCollapsed?: boolean;
  /** 折叠修改的事件 */
  onCollapse?: (collapsed: boolean) => void;
  /** 自定选中一个input，只能有一个生效 */
  autoFocus?: boolean;
};

export type LightFilterFooterRender =
  | ((
  onConfirm?: (e?: MouseEvent) => void,
  onClear?: (e?: MouseEvent) => void
) => JSX.Element | false)
  | false;
