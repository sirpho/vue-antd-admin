import { CSSProperties, VNodeChild, PropType } from 'vue'
import { Table as T } from 'ant-design-vue'
import { OptionConfig, requsetConfig, searchPorps } from './types/table'
import { ProCoreActionType } from './types/tableAction'

export const proTableProps = Object.assign({}, T.props, {
  request: {
    type: Object as PropType<requsetConfig>,
    required: false,
    default: null,
  },
  params: {
    type: Object as PropType<Recordable>,
    required: false,
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
    type: [Array] as PropType<(() => VNodeChild | JSX.Element)[]>,
    required: false,
    default: () => []
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
    required: false
  },
  showIndex: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true
  },
  headerTitle: {
    type: [String, Function] as PropType<string | (() => VNodeChild | JSX.Element)>,
    required: false
  },
  titleTip: {
    type: Function as PropType<(() => VNodeChild | JSX.Element)>,
    required: false
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
