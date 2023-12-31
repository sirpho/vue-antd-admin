import type { VNodeChild } from 'vue'
import type { TablePaginationConfig, TableRowSelection } from 'ant-design-vue/lib/table/interface'
import type { PaginationProps } from 'ant-design-vue/lib/pagination'

export type ProTableFetchParams = {
  params?: any
  filters?: any
  sorter?: any
  pagination?: ProTablePagination
  removeKeys?: (string | number)[]
  immediate?: boolean
  isPolling?: boolean
}

export type ProFieldEmptyText = string | false

export type ProTableRowSelection<T = any> = TableRowSelection<T> & {
  defaultSelectKeys: (string | number)[]
  defaultSelectRows: T[]
}

export type ProTablePaginationConfig = Omit<TablePaginationConfig, 'position'> & {
  position?: string
}

export type ProTablePagination = ProTablePaginationConfig | false

export declare type SortOrder = 'descend' | 'ascend' | null

export type RequestData = {
  data: any[] | undefined
  success?: boolean
  total?: number
} & RecordType

export type requestConfig = (
  params: {
    pageSize?: number
    current?: number
    keyword?: string
  },
  sort: Record<string, SortOrder>,
  filter: Record<string, any[] | null>
) => Promise<Partial<RequestData>>

export type ColConfig = Partial<Record<Breakpoint, number>>

export type SearchConfig = {
  searchText?: string
  resetText?: string
  className?: string
  defaultCollapsed?: boolean
  showSearch?: boolean
  showReset?: boolean
  collapseRender?: WithFalse<(collapsed?: boolean) => CustomRender>
  span?: ColConfig
  collapse?: boolean
  onCollapse?: () => any
}

export interface OptionConfig {
  reload?: (() => VNodeChild | JSX.Element) | boolean
  density?: boolean
  setting?:
    | boolean
    | {
        draggable?: boolean
        checkable?: boolean
        checkedReset?: boolean
        extra?: VueNode
      }
  fullScreen?: (() => VNodeChild | JSX.Element) | boolean | (() => Promise<void>)
}

export type ProCoreActionTypeConfig = {
  formParams?: RecordType
  pageParams?: RecordType | boolean
  /** @name 刷新 */
  reload?: (info?: ProTableFetchParams) => void
  /** @name 刷新并清空表单，重置为第一页 */
  reloadAndRest?: () => void
  /** @name 设置翻页、排序、筛选*/
  changePageInfo?: (pagination: PaginationProps, filters, sorter) => void
  /** @name 更新TableData属性值 */
  reSetDataList?: (data: RecordType[]) => void
  /** @name 更新TableData属性值 */
  changeDataValue?: ({ key, value }: { key?: string; value: RecordType }) => void
  /** @name 改变loading状态 */
  loadingOperation?: (loading: boolean) => void
  formRef?: any
}

/** 操作类型 */
export type ProCoreActionType = ({
  reload,
  reloadAndRest,
  changeDataValue,
  loadingOperation
}: ProCoreActionTypeConfig) => void
