import type { CSSProperties } from 'vue'
import type { NamePath } from 'ant-design-vue/lib/form/interface'
import type { ProSchema, ProSchemaComponentTypes } from '../_util/typings'

export type RowEditableConfig<DataType> = {
  onChange?: (editableKeys: string | number, editableRows: DataType[] | DataType) => void;
  onValuesChange?: (record: DataType, dataSource: DataType[]) => void;
  /** 行保存的时候 */
  onSave?: (
    /** 行 id，一般是唯一id */
    key: string | number,
    /** 当前修改的行的值，只有 form 在内的会被设置 */
    record: DataType & { index?: number },
    /** 原始值，可以用于判断是否修改 */
    originRow: DataType & { index?: number },
  ) => Promise<any | void>;

  /** 行保存的时候 */
  onCancel?: (
    /** 行 id，一般是唯一id */
    key: string | number,
    /** 当前修改的行的值，只有 form 在内的会被设置 */
    record: DataType & { index?: number },
    /** 原始值，可以用于判断是否修改 */
    originRow: DataType & { index?: number },
  ) => Promise<any | void>;
  /** 行删除的时候 */
  onDelete?: (key: string | number, row: DataType & { index?: number }) => Promise<any | void>;
  /** 删除行时的确认消息 */
  deletePopconfirmMessage?: VueNode;
  /** 只能编辑一行的的提示 */
  onlyOneLineEditorAlertMessage?: VueNode;
  /** 同时只能新增一行的提示 */
  onlyAddOneLineAlertMessage?: VueNode;
  /** Table 上设置的name，用于拼接name来获取数据 */
  tableName?: NamePath;
  /** 保存一行的文字 */
  saveText?: VueNode;
  /** 取消编辑一行的文字 */
  cancelText?: VueNode;
  /** 删除一行的文字 */
  deleteText?: VueNode;
}

export interface DescriptionsItemProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  label?: VueNode;
  labelStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  children: VueNode;
  span?: number;
}

export type ProDescriptionsItemProps<T = RecordType, ValueType = 'text'> = ProSchema<T,
  Omit<DescriptionsItemProps, 'children'> & {
  // 隐藏这个字段，是个语法糖，方便一下权限的控制
  hide?: boolean;
  plain?: boolean;
  copyable?: boolean;
  ellipsis?: boolean;
  mode?: ProFieldFCMode;
  children?: VueNode;
  order?: number;
},
  ProSchemaComponentTypes,
  ValueType>;

export type ProFieldFCMode = 'read' | 'edit' | 'update';
