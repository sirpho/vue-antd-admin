import type { CSSProperties, PropType } from 'vue'
import type { SizeType } from '@gx-design/utils'
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
  ProCoreActionType,
  ProFieldEmptyText
} from './types/table'
import type { ProColumns, ProSearchMap } from './types/column'
import type { ColumnsState, ColumnsStateType } from './hooks/useColumnSetting'
import { SearchConfig } from './types/table'

export const tableProps = {
  prefixCls: { type: String as PropType<string>, default: undefined },
  columns: { type: Array as PropType<ProColumns>, default: undefined },
  rowKey: { type: [ String ] as PropType<string>, default: undefined },
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
    default: () => {
      return {}
    }
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
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 获取 dataSource 的方法
   */
  request: {
    type: Function as PropType<requsetConfig>,
    default: null
  },
  // 用于 request 查询的额外参数，一旦变化会触发重新加载
  params: Object as PropType<RecordType>,
  // 对通过 request 获取的数据进行处理
  postData: Function as PropType<(data: any[]) => any>,
  // 等待请求时间设置
  waitRequest: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  // 轮训时间间隔设置
  polling: Number as PropType<number>,
  // 防抖时间设置
  debounceTime: {
    type: Number as PropType<number>,
    default: 20
  },
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 是否显示搜索表单，传入对象时为搜索表单的配置
   */
  search: {
    type: Object as PropType<SearchConfig>,
    default: () => {
      return {
        resetText: '重置',
        searchText: '查询'
      } as SearchConfig
    }
  },
  searchMap: {
    type: Array as PropType<ProSearchMap[]>,
    default: () => []
  },
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 自定义表格渲染模式：默认表格展示，也可以自定义数据列表展示
   */
  customize: {
    type: [ Object, Function ] as PropType<WithFalse<(data?: RecordType[]) => CustomRender>>,
    default: () => undefined
  },
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description Table action 的引用，便于自定义触发
   */
  actionRef: Function as PropType<ProCoreActionType>,
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 添加表格class
   */
  tableClassName: String as PropType<String>,
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 表格样式
   */
  tableStyle: {
    type: Object as PropType<CSSProperties>
  },
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 渲染按钮工具栏，支持返回一个 dom 数组，会自动增加 margin-right
   */
  toolBarBtn: {
    type: [ Object, Array, Function ] as PropType<GProVueNode>,
    default: () => undefined
  },
  // 表格标题
  headerTitle: {
    type: [ String, Object, Array, Function ] as PropType<string | GProVueNode>,
    default: () => undefined
  },
  // 标题提示
  titleTip: {
    type: [ Boolean, String, Object, Array, Function ] as PropType<string | boolean | GProVueNode>,
    default: () => undefined
  },
  // 标题提示字
  titleTipText: {
    type: String as PropType<string>,
    default: '这是一个标题提示'
  },
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description table 工具栏，设为 false 时不显示
   */
  options: {
    type: [ Object, Boolean ] as PropType<OptionConfig | boolean>,
    default: true
  },
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 列状态配置，可以配置是否浮动和是否展示
   */
  columnsState: {
    type: Object as PropType<ColumnsStateType>
  },
  // table 工具栏 额外的元素
  optionsExtra: {
    type: [ Function, Object ] as PropType<VueNode>,
    default: () => undefined
  },
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 列设置额外的元素
   */
  settingExtra: {
    type: [ String, Function ] as PropType<string | VueNode>,
    default: () => undefined
  },
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 是否展示序号栏
   */
  showIndex: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 翻页item设置
   */
  pageItemRender: {
    type: [ Function, Object ] as PropType<VueNode>,
    default: () => undefined
  },
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 表格大小
   */
  size: {
    type: String as PropType<SizeType>,
    default: 'middle'
  },
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 表格全局对齐方式
   */
  align: {
    type: String as PropType<AlignType>,
    default: 'left'
  },
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 是否展示外边框和列边框
   */
  bordered: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 是否列拖动
   */
  draggabled: Boolean as PropType<boolean>,
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 根据屏幕大小或者scrollBreakpoint或者scroll?.x是否存在判断action列是否固定
   */
  autoScroll: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 滚动断点支持数字（屏幕宽度）；也支持md、xl，xxl等
   */
  scrollBreakpoint: [ String, Number ] as PropType<string | number>,
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description modalTable时，自动固定滚动高度
   */
  modalScroll: Boolean as PropType<boolean>,
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 从不滚动
   */
  neverScroll: Boolean as PropType<boolean>,
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description 空值时的显示，不设置时显示 -， false 可以关闭此功能
   */
  columnEmptyText: {
    type: [ String, Boolean ] as PropType<ProFieldEmptyText>,
    default: false
  },
  /**
   * @Author      gx12358
   * @DateTime    2022/2/8
   * @lastTime    2022/2/8
   * @description Pro-Table 的方法
   */
  reset: Function as PropType<(params?: Partial<Record<string, any>>) => any>,
  submit: Function as PropType<(params: Partial<Record<string, any>>) => any>,
  sizeChange: Function as PropType<(size: string) => any>,
  loadingChange: Function as PropType<(loading: boolean) => any>,
  requestError: Function as PropType<(e: Error) => void>,
  beforeSearchSubmit: Function as PropType<requsetConfig>,
  columnsStateChange: Function as PropType<(data: ColumnsState[]) => void>
}
