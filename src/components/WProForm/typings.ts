import type { CSSProperties, Ref } from 'vue'
import type { SpaceProps, FormItemProps } from 'ant-design-vue'
import type { NamePath, ValidateErrorEntity, RuleError } from 'ant-design-vue/lib/form/interface'
import type {
  validateOptions,
  ValidateInfo,
  Props,
  validateInfos
} from 'ant-design-vue/lib/form/useForm'
import type {
  LabelTooltipType,
  SearchTransformKeyFn,
  ProFieldValueType,
  ProFieldProps
} from '@wd-design/pro-utils'
import { ProFormItemProps } from './components/FormItem'

type namesType = string | string[];

export type InternalNamePath = (string | number)[];

export type ProFormItemCreateConfig = {
  /** 自定义类型 */
  valueType?: ProFieldValueType;
  /** 自定义 lightMode */
  customLightMode?: boolean;
  /** Light mode 自定义的 label 模式 */
  lightFilterLabelFormatter?: (value: any) => string;
  /** 默认的props，如果用户设置会被覆盖 */
  defaultProps?: Record<string, any>;
  /** @name 不使用默认的宽度 */
  ignoreWidth?: boolean;
} & ProFormItemProps;

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
  setFieldsValue: (value: RecursivePartial<Values>) => void;
  submit: () => void;

  modelRef: Props | Ref<Props>;
  rulesRef: Props | Ref<Props>;
  initialModel: Props;
  resetFields: (newValues?: Props) => void;
  validateInfos: validateInfos;
  validate: <T = any>(names?: namesType, option?: validateOptions) => Promise<T>;
  validateField: (
    name: string,
    value: any,
    rules: Record<string, unknown>[],
    option?: validateOptions
  ) => Promise<RuleError[]>;
  mergeValidateInfo: (items: ValidateInfo | ValidateInfo[]) => ValidateInfo;
  clearValidate: (names?: namesType) => void;
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

// 给控件扩展的通用的属性
export type ExtendsProps = {
  secondary?: boolean;
  allowClear?: boolean;
  bordered?: boolean;
  colSize?: number;
  /**
   * 需要与 request 配合使用
   *
   * @name 网络请求用的输出，会触发reload
   */
  params?: ((form: ProFormInstance) => Record<string, any>) | Record<string, any>;

  /** @name 需要放在formItem 时使用 */
  ignoreFormItem?: boolean;

  /**
   * 实验性质，可能 api 会有改动，谨慎使用
   *
   * @name 只读模式
   */
  readonly?: boolean;

  /** @name 提交时转化值，一般用于数组类型 */
  transform?: SearchTransformKeyFn;

  /**
   * 给 protable 开的口子
   *
   * @name 自定义的 formItemProps
   */
  formItemProps?: FormItemProps;
  /** 给自定义组件行为开的口子 */
  filedConfig?: ProFormItemCreateConfig;
}

export type ProFormFieldItemProps<T = Record<string, any>> = {
  fieldProps?: FieldProps & T;
  placeholder?: string | string[];
  secondary?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  /**
   * @type auto 使用组件默认的宽度
   * @type xs=104px 适用于短数字、短文本或选项。
   * @type sm=216px 适用于较短字段录入、如姓名、电话、ID 等。
   * @type md=328px 标准宽度，适用于大部分字段长度。
   * @type lg=440px 适用于较长字段录入，如长网址、标签组、文件路径等。
   * @type xl=552px 适用于长文本录入，如长链接、描述、备注等，通常搭配自适应多行输入框或定高文本域使用。
   */
  width?: number | 'sm' | 'md' | 'xl' | 'xs' | 'lg';
  /** 设置到 ProField 上面的 Props，内部属性 */
  proFieldProps?: ProFieldProps;

  /** QueryFilter 上的footer */
  footerRender?: LightFilterFooterRender;
} & Omit<ProFormItemProps, 'valueType'> &
  ExtendsProps;
