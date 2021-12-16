import { VNodeChild } from 'vue'
import { ColumnsType } from '../typings'

/**
 * @param text 文本框
 * @param date 日期 YYYY-MM-DD
 * @param dateMonth 月选择器
 * @param dateRange 日期范围 YYYY-MM-DD[]
 * @param time: 时间 HH:mm:ss
 * @param select 下拉选择器
 */
export type ProFieldValueType =
  | 'text'
  | 'date'
  | 'select'
  | 'dateMonth'
  | 'dateRange'
  | 'time'

/**
 * @param text 文本框
 * @param date 日期 YYYY-MM-DD
 * @param dateMonth 月选择器
 * @param dateRange 日期范围 YYYY-MM-DD[]
 * @param time: 时间 HH:mm:ss
 * @param select 下拉选择器
 */
export type ProFieldValueFormat =
  | 'data'
  | 'dateMonth'
  | 'dateRange'
  | 'dateMonth'
  | 'time'

export type ProSchemaValueEnumType = {
  /** @name 演示的文案 */
  text: VNodeChild | JSX.Element;

  /** @name 演示的value值 */
  value: any;

  /** @name 是否禁用 */
  disabled?: boolean;
};

export type ProSchemaValueEnumObj = Record<string, ProSchemaValueEnumType | VNodeChild | JSX.Element>;

type ProSchemaValueType<ValueType> = (ValueType | ProFieldValueType);

type ProSchemaValueFormat<ValueType> = (ValueType | ProFieldValueFormat);

export type ProSearchConfig<Entity = RecordType,
  ValueType = 'text',
  ValueFormat = 'date',
  > = {
  name?: string;
  /** 选择如何渲染相应的模式 */
  valueType?: ProSchemaValueType<ValueType>;
  ValueFormat?: ProSchemaValueFormat<ValueFormat>;
  placeholder?: string | boolean;
  /** valueType为select生效 */
  allowClear?: boolean;
  /** valueType为select生效 */
  showSearch?: boolean;
  /** valueType为date|dateMonth|dateRange|time生效 */
  format?: string;
  /** valueType为date生效 */
  showToday?: boolean;
  /** valueType为dateRange生效 */
  rangeStartName?: string;
  /** valueType为dateRange生效 */
  rangeEndName?: string;
  /** valueType为time生效 */
  use12Hours?: boolean;
  /** valueType为select生效 */
  loading?: boolean;
  /** valueType为date|dateMonth|dateRange|time生效 */
  renderExtraFooter?: (mode: 'date' | 'time' | 'year' | 'month' | 'decade') => any;
  showTime?: RecordType | boolean;
  /** 搜索表单的默认值 */
  initialValue?: any;
  /**
   * 支持 object 和Map，Map 是支持其他基础类型作为 key
   *
   * @name 映射值的类型
   */
  valueEnum?:
    | ((row: Entity) => ProSchemaValueEnumObj)
    | ProSchemaValueEnumObj
};

export interface ProColumns<RecordType> extends ColumnsType<RecordType> {
  originAlign?: string;
  uuid?: string;
  fixType?: 'nofixed' | 'fixedLeft' | 'fixedRight';
  checked?: boolean;
  hasTableTree?: boolean;
  /** 表单搜索配置 */
  searchConfig?: ProSearchConfig;
  /** 是否缩略 */
  ellipsis?: boolean;
  /** 是否拷贝 */
  copyable?: boolean;
}
