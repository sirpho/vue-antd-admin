import type { CSSProperties, PropType } from 'vue'
import { Table as T } from 'ant-design-vue'
import type {
  OptionConfig,
  requsetConfig,
  searchPorps,
  ProCoreActionType,
  ProFieldEmptyText
} from './types/table'
import type { ColumnsState } from './components/ActionColumns'

export const proTableProps = Object.assign({}, T.props, {
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
  params: Object as PropType<Recordable>,
  search: Object as PropType<searchPorps>,
  actionRef: Function as PropType<ProCoreActionType>,
  toolBarBtn: {
    type: [ Array, Function, Object ] as PropType<WithFalse<() => CustomRender>>,
    default: () => undefined
  },
  tableClassName: String as PropType<String>,
  tableStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => {}
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
    type: String as PropType<string>,
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
  beforeSearchSubmit: Function as PropType<(params: Partial<Record<string, any>>) => any>,
  requestError: Function as PropType<(e: Error) => void>,
  columnsStateChange: Function as PropType<(data: ColumnsState[]) => void>,
  postData: Function as PropType<(data: any[]) => void>
})
