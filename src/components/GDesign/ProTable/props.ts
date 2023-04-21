import type { CSSProperties, PropType } from 'vue'
import type { SizeType } from '@gx-admin/utils'
import { tableProps } from '@gx-design/Table/props'
import type { AlignType } from '@gx-design/Table/typings'
import type {
  OptionConfig,
  requestConfig,
  ProCoreActionType,
  ProFieldEmptyText,
  ProTablePagination,
  ProTableRowSelection
} from './types/table'
import type { ProSearchMap } from './types/column'
import type { ColumnsState, ColumnsStateType } from './hooks/useColumnSetting'
import { SearchConfig } from './types/table'
export const defaultSearchProp = {
  resetText: '重置',
  searchText: '查询',
  showSearch: true,
  showReset: true
}

export const defaultProps = {
  ...tableProps(),
  rowSelection: {
    type: Object as PropType<ProTableRowSelection>,
    default: undefined
  },
  columns: { type: Array, default: undefined },
  pagination: { type: [Object, Boolean] as PropType<ProTablePagination>, default: () => undefined }
}

export const proTableProps = {
  ...defaultProps,
  rowKey: { type: String as PropType<string>, default: undefined },
  /**
   * @description 获取 dataSource 的方法
   */
  request: {
    type: Function as PropType<requestConfig>,
    default: null
  },
  // 是否启用虚拟滚动
  virtualScroll: Boolean as PropType<boolean>,
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
   * @description 是否显示搜索表单，传入对象时为搜索表单的配置
   */
  search: {
    type: Object as PropType<SearchConfig>,
    default: () => {
      return defaultSearchProp as SearchConfig
    }
  },
  searchMap: {
    type: Array as PropType<ProSearchMap[]>,
    default: () => []
  },
  /**
   * @description 自定义表格渲染模式：默认表格展示，也可以自定义数据列表展示
   */
  customize: {
    type: [Object, Function] as PropType<WithFalse<(data?: RecordType[]) => CustomRender>>,
    default: () => undefined
  },
  /**
   * @description Table action 的引用，便于自定义触发
   */
  actionRef: Function as PropType<ProCoreActionType>,
  /**
   * @description 添加表格class
   */
  tableClassName: String as PropType<String>,
  /**
   * @description 表格样式
   */
  tableStyle: {
    type: Object as PropType<CSSProperties>
  },
  /**
   * @description 渲染按钮工具栏，支持返回一个 dom 数组，会自动增加 margin-right
   */
  toolBarBtn: {
    type: [Object, Array, Function] as PropType<GProVueNode>,
    default: () => undefined
  },
  // 表格标题
  headerTitle: {
    type: [String, Object, Array, Function] as PropType<string | GProVueNode>,
    default: () => undefined
  },
  // 标题提示
  titleTip: {
    type: [Boolean, String, Object, Array, Function] as PropType<string | boolean | GProVueNode>,
    default: () => undefined
  },
  // 标题提示字
  titleTipText: {
    type: String as PropType<string>,
    default: '这是一个标题提示'
  },
  /**
   * @description table 工具栏，设为 false 时不显示
   */
  options: {
    type: [Object, Boolean] as PropType<OptionConfig | boolean>,
    default: true
  },
  /**
   * @description 列状态配置，可以配置是否浮动和是否展示
   */
  columnsState: {
    type: Object as PropType<ColumnsStateType>
  },
  // table 工具栏 额外的元素
  optionsExtra: {
    type: [Function, Object] as PropType<VueNode>,
    default: () => undefined
  },
  /**
   * @description 列设置额外的元素
   */
  settingExtra: {
    type: [String, Function] as PropType<string | VueNode>,
    default: () => undefined
  },
  /**
   * @description 是否展示序号栏
   */
  showIndex: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  /**
   * @description 翻页item设置
   */
  pageItemRender: {
    type: [Function, Object] as PropType<
      WithFalse<
        (opt: {
          page: number
          type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next'
          originalElement: any
        }) => CustomRender
      >
    >,
    default: () => undefined
  },
  /**
   * @description 表格大小
   */
  size: {
    type: String as PropType<SizeType>,
    default: 'middle'
  },
  /**
   * @description 表格全局对齐方式
   */
  align: {
    type: String as PropType<AlignType>,
    default: 'left'
  },
  /**
   * @description 是否展示外边框和列边框
   */
  bordered: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  /**
   * @description 是否列拖动
   */
  draggabled: Boolean as PropType<boolean>,
  /**
   * @description 根据屏幕大小或者scrollBreakpoint或者scroll?.x是否存在判断action列是否固定
   */
  autoScroll: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  /**
   * @description 滚动断点支持数字（屏幕宽度）；也支持md、xl，xxl等
   */
  scrollBreakpoint: [String, Number] as PropType<string | number>,
  /**
   * @description modalTable时，自动固定滚动高度
   */
  modalScroll: Boolean as PropType<boolean>,
  /**
   * @description 从不滚动
   */
  neverScroll: Boolean as PropType<boolean>,
  /**
   * @description 空值时的显示，不设置时显示 -， false 可以关闭此功能
   */
  columnEmptyText: {
    type: [String, Boolean] as PropType<ProFieldEmptyText>,
    default: false
  },
  /**
   * @description Pro-Table 的方法
   */
  reset: Function as PropType<(params?: Partial<Record<string, any>>) => any>,
  onReload: Function as PropType<(params?: Partial<Record<string, any>>) => any>,
  submit: Function as PropType<(params: Partial<Record<string, any>>) => any>,
  sizeChange: Function as PropType<(size: string) => any>,
  loadingChange: Function as PropType<(loading: boolean) => any>,
  requestError: Function as PropType<(e: Error) => void>,
  beforeSearchSubmit: Function as PropType<requestConfig>,
  afterRequest: Function as PropType<() => any>,
  columnsStateChange: Function as PropType<(data: ColumnsState[]) => void>
}
