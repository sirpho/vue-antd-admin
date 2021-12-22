import type { CSSProperties, PropType } from 'vue'
import type { SizeType } from '@gx-design/pro-utils'
import type {
  TableProps,
  RcTableProps,
  TablePaginationConfig,
  SpinProps,
  TableLocale,
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
  ColumnType,
  TableRowSelection,
  GetPopupContainer,
  ContextSlots,
  SortOrder,
  TooltipProps,
  AlignType
} from './typings'
import type {
  OptionConfig,
  requsetConfig,
  searchPorps,
  ProCoreActionType,
  ProFieldEmptyText
} from './types/table'
import type { ProColumns } from './types/column'
import type { ColumnsState } from './components/ActionColumns'

export const tableProps = {
  prefixCls: { type: String as PropType<string>, default: undefined },
  columns: { type: Array as PropType<ProColumns<RecordType>[]>, default: undefined },
  rowKey: { type: [ String, Function ] as PropType<TableProps['rowKey']>, default: undefined },
  tableLayout: { type: String as PropType<TableProps['tableLayout']>, default: undefined },
  rowClassName: {
    type: [ String, Function ] as PropType<TableProps['rowClassName']>,
    default: undefined
  },
  title: { type: Function as PropType<TableProps['title']>, default: undefined },
  footer: { type: Function as PropType<TableProps['footer']>, default: undefined },
  id: { type: String as PropType<TableProps['id']>, default: undefined },
  showHeader: { type: Boolean as PropType<TableProps['showHeader']>, default: undefined },
  components: { type: Object as PropType<TableProps['components']>, default: undefined },
  customRow: { type: Function as PropType<TableProps['customRow']>, default: undefined },
  customHeaderRow: {
    type: Function as PropType<TableProps['customHeaderRow']>,
    default: undefined
  },
  direction: { type: String as PropType<TableProps['direction']>, default: undefined },
  expandFixed: { type: Boolean as PropType<TableProps['expandFixed']>, default: undefined },
  expandColumnWidth: {
    type: Number as PropType<TableProps['expandColumnWidth']>,
    default: undefined
  },
  expandedRowKeys: {
    type: Array as PropType<TableProps['expandedRowKeys']>,
    default: undefined as TableProps['expandedRowKeys']
  },
  defaultExpandedRowKeys: {
    type: Array as PropType<TableProps['defaultExpandedRowKeys']>,
    default: undefined as TableProps['defaultExpandedRowKeys']
  },
  expandedRowRender: {
    type: Function as PropType<TableProps['expandedRowRender']>,
    default: undefined
  },
  expandRowByClick: {
    type: Boolean as PropType<TableProps['expandRowByClick']>,
    default: undefined
  },
  expandIcon: { type: Function as PropType<TableProps['expandIcon']>, default: undefined },
  onExpand: { type: Function as PropType<TableProps['onExpand']>, default: undefined },
  onExpandedRowsChange: {
    type: Function as PropType<TableProps['onExpandedRowsChange']>,
    default: undefined
  },
  defaultExpandAllRows: {
    type: Boolean as PropType<TableProps['defaultExpandAllRows']>,
    default: undefined
  },
  indentSize: { type: Number as PropType<TableProps['indentSize']>, default: undefined },
  expandIconColumnIndex: {
    type: Number as PropType<TableProps['expandIconColumnIndex']>,
    default: undefined
  },
  expandedRowClassName: {
    type: Function as PropType<TableProps['expandedRowClassName']>,
    default: undefined
  },
  childrenColumnName: {
    type: String as PropType<TableProps['childrenColumnName']>,
    default: undefined
  },
  rowExpandable: { type: Function as PropType<TableProps['rowExpandable']>, default: undefined },
  sticky: { type: [ Boolean, Object ] as PropType<TableProps['sticky']>, default: undefined },

  dropdownPrefixCls: String,
  dataSource: { type: Array as PropType<RcTableProps['data']>, default: undefined },
  pagination: {
    type: [ Boolean, Object ] as PropType<false | TablePaginationConfig>,
    default: undefined
  },
  loading: { type: [ Boolean, Object ] as PropType<false | SpinProps>, default: undefined },
  size: { type: String as PropType<SizeType>, default: undefined },
  bordered: Boolean,
  locale: { type: Object as PropType<TableLocale>, default: undefined },

  onChange: {
    type: Function as PropType<(
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult | SorterResult[],
      extra: TableCurrentDataSource
    ) => void>,
    default: undefined
  },
  onResizeColumn: {
    type: Function as PropType<(w: number, col: ColumnType) => void>,
    default: undefined
  },
  rowSelection: { type: Object as PropType<TableRowSelection>, default: undefined },
  getPopupContainer: { type: Function as PropType<GetPopupContainer>, default: undefined },
  scroll: {
    type: Object as PropType<RcTableProps['scroll'] & {
      scrollToFirstRowOnChange?: boolean;
    }>,
    default: undefined
  },
  sortDirections: { type: Array as PropType<SortOrder[]>, default: undefined },
  showSorterTooltip: {
    type: [ Boolean, Object ] as PropType<boolean | TooltipProps>,
    default: true
  },
  contextSlots: {
    type: Object as PropType<ContextSlots>
  },
  transformCellText: {
    type: Function as PropType<TableProps['transformCellText']>
  }
}

export const proTableProps = {
  ...tableProps,
  request: {
    type: Function as PropType<requsetConfig>,
    default: null
  },
  defaultData: Array as PropType<any[]>,
  waitRequest: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  polling: Number as PropType<number>,
  debounceTime: {
    type: Number as PropType<number>,
    default: 20
  },
  params: Object as PropType<RecordType>,
  search: Object as PropType<searchPorps>,
  actionRef: Function as PropType<ProCoreActionType>,
  toolBarBtn: {
    type: [ Array, Function, Object, Boolean ] as PropType<WithFalse<() => CustomRender>>,
    default: () => undefined
  },
  pageItemRender: {
    type: [ Function, Object ] as PropType<WithFalse<() => CustomRender>>,
    default: () => undefined
  },
  tableClassName: String as PropType<String>,
  tableStyle: {
    type: Object as PropType<CSSProperties>
  },
  options: {
    type: [ Object, Boolean ] as PropType<OptionConfig | boolean>,
    default: true
  },
  showIndex: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  headerTitle: {
    type: [
      String,
      Function,
      Object
    ] as PropType<string | WithFalse<() => CustomRender>>,
    default: () => undefined
  },
  titleTip: {
    type: [ Boolean, Function, Object ] as PropType<WithFalse<() => CustomRender>>,
    default: () => undefined
  },
  titleTipText: {
    type: String as PropType<string>,
    default: '这是一个标题提示'
  },
  showPagination: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  size: {
    type: String as PropType<string>,
    default: 'middle'
  },
  align: {
    type: String as PropType<AlignType>,
    default: 'left'
  },
  bordered: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  draggabled: Boolean as PropType<boolean>,
  automaticScroll: Boolean as PropType<boolean>,
  neverScroll: Boolean as PropType<boolean>,
  columnEmptyText: {
    type: [ String, Boolean ] as PropType<ProFieldEmptyText>,
    default: false
  },
  reset: Function as PropType<(params?: Partial<Record<string, any>>) => any>,
  submit: Function as PropType<(params: Partial<Record<string, any>>) => any>,
  refresh: Function as PropType<() => any>,
  sizeChange: Function as PropType<(size: string) => any>,
  loadingChange: Function as PropType<(loading: boolean) => any>,
  beforeSearchSubmit: Function as PropType<requsetConfig>,
  requestError: Function as PropType<(e: Error) => void>,
  columnsStateChange: Function as PropType<(data: ColumnsState[]) => void>,
  postData: Function as PropType<(data: any[]) => any>,
  scrollBreakpoint: [ String, Number ] as PropType<string | number>
}
