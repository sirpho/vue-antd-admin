export type { TableProps, TablePaginationConfig } from 'ant-design-vue/lib/table'
export type {
  TableLocale,
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
  ColumnType,
  TableRowSelection,
  GetPopupContainer,
  SortOrder
} from 'ant-design-vue/lib/table/interface'
export type { ContextSlots } from 'ant-design-vue/lib/table/context'
export type { TableProps as RcTableProps } from 'ant-design-vue/lib/vc-table/Table'
import type {
  GetComponentProps,
  CellEllipsisType,
  AlignType,
  DataIndex,
  RenderedCell
} from 'ant-design-vue/lib/vc-table/interface'

export type { SpinProps, TooltipProps } from '@gx-design/utils'

export {
  AlignType
}

export type ColumnsType<RecordType> = {
  title?: any;
  key?: number | string;
  class?: string;
  className?: string;
  fixed?: 'left' | 'right' | boolean;
  customHeaderCell?: GetComponentProps<ColumnsType<RecordType>>;
  ellipsis?: CellEllipsisType;
  align?: AlignType;

  customFilterDropdown?: boolean;

  /** @deprecated Please use `v-slot:filterIcon` `v-slot:bodyCell` `v-slot:headerCell` instead */
  slots?: {
    filterIcon?: string;
    filterDropdown?: string;
    customRender?: string;
    title?: string;
  };

  /**
   * @private Internal usage.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  __originColumn__?: any;
  children?: ColumnsType<RecordType>;
  colSpan?: number;
  dataIndex?: DataIndex;
  customRender?: (opt: {
    value: any;
    text: any; // 兼容 V2
    record: RecordType;
    index: number;
    column: ColumnsType<RecordType>;
  }) => any | RenderedCell<RecordType>;
  rowSpan?: number;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  customCell?: GetComponentProps<RecordType>;
  /** @deprecated Please use `onCell` instead */
  onCellClick?: (record: RecordType, e: MouseEvent) => void;
}
