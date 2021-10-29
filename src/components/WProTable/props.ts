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
    type: Object as PropType<requsetConfig>,
    required: false,
    default: null
  },
  polling: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  pollingTime: {
    type: Number as PropType<number>,
    required: false,
    default: 3
  },
  params: {
    type: Object as PropType<Recordable>,
    required: false
  },
  search: {
    type: Object as PropType<searchPorps>,
    required: false
  },
  actionRef: {
    type: Object as PropType<ProCoreActionType>,
    required: false
  },
  toolBarBtn: {
    type: [ Array, Function, Object ] as PropType<WithFalse<() => CustomRender>>,
    default: () => undefined
  },
  tableClassName: {
    type: String as PropType<String>,
    required: false
  },
  tableStyle: {
    type: Object as PropType<CSSProperties>,
    required: false,
    default: () => {}
  },
  options: {
    type: [ Object, Boolean ] as PropType<OptionConfig | boolean>,
    required: false,
    default: true
  },
  showIndex: {
    type: Boolean as PropType<boolean>,
    required: false,
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
    required: false,
    default: '这是一个标题提示'
  },
  showPagination: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true
  },
  size: {
    type: String as PropType<string>,
    required: false,
    default: 'middle'
  },
  align: {
    type: String as PropType<string>,
    required: false,
    default: 'left'
  },
  bordered: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true
  },
  draggabled: {
    type: Boolean as PropType<boolean>,
    required: false
  },
  automaticScroll: {
    type: Boolean as PropType<boolean>,
    required: false
  },
  neverScroll: {
    type: Boolean as PropType<boolean>,
    required: false
  },
  columnEmptyText: {
    type: [ String, Boolean ] as PropType<ProFieldEmptyText>,
    default: false
  },
  reset: {
    type: Function as PropType<(params?: Partial<Record<string, any>>) => any>
  },
  submit: {
    type: Function as PropType<(params: Partial<Record<string, any>>) => any>
  },
  refresh: {
    type: Function as PropType<() => any>
  },
  sizeChange: {
    type: Function as PropType<(size: string) => any>
  },
  loadingChange: {
    type: Function as PropType<(loading: boolean) => any>
  },
  beforeSearchSubmit: {
    type: Function as PropType<(params: Partial<Record<string, any>>) => any>
  },
  requestError: {
    type: Function as PropType<(e: Error) => void>
  },
  columnsStateChange: {
    type: Function as PropType<(data: ColumnsState[]) => void>
  },
  postData: {
    type: Function as PropType<(data: any[]) => void>
  }
})
