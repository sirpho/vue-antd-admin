import { CSSProperties, PropType } from 'vue'
import { Table as T } from 'ant-design-vue'
import { OptionConfig, requsetConfig, searchPorps, ProCoreActionType } from './types/table'

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
  }
})
