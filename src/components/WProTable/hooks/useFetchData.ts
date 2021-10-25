import {
  ref,
  unref,
  ComputedRef,
  computed,
  watch
} from 'vue'
import { cloneDeep } from 'lodash-es'
import { PaginationProps } from 'ant-design-vue/lib/pagination'
import type { ProTableProps } from '@wd-pro/pro-table'
import type { ProColumns } from '../types/column'
import { useTimeoutFn } from '/@/hooks/core/useTimeout'
import {
  isFunction,
  isBoolean,
  getSortIndex,
  handleCurrentPage
} from '/@/utils/util'

interface ActionType {
  getPaginationInfo: ComputedRef<boolean | PaginationProps>;
  setPagination: (info: Partial<PaginationProps>) => void;
  setLoading: (loading: boolean) => void;
  setColumns: (columnList: Partial<ProColumns>[]) => void;
  getViewColumns: ComputedRef<ProColumns[]>;
  getFormParamsRef: ComputedRef<Recordable>;
}

export function useFetchData(
  propsRef: ComputedRef<ProTableProps>,
  {
    getPaginationInfo,
    setPagination,
    setLoading,
    setColumns,
    getViewColumns,
    getFormParamsRef
  }: ActionType,
  emit: EmitType
) {

  const dataSourceRef = ref<Recordable[]>([])

  watch(
    () => unref(propsRef).dataSource,
    () => {
      const { dataSource, request } = unref(propsRef)
      !request && dataSource && (dataSourceRef.value = dataSource)
    },
    {
      immediate: true
    }
  )

  watch(
    () => unref(getFormParamsRef),
    (_) => {
      useTimeoutFn(() => {
        fetchData()
      }, 16)
    },
    {
      immediate: true
    }
  )

  const getDataSourceRef = computed(() => {
    const { current = 1, pageSize = 10 } = unref(getPaginationInfo) as PaginationProps
    const dataSource = unref(dataSourceRef)
    if (!dataSource || dataSource.length === 0) {
      return unref(dataSourceRef)
    }
    let tableData = cloneDeep(unref(dataSourceRef))
    tableData = getSortIndex(tableData, {
      current,
      pageSize
    })
    dataSourceRef.value = tableData
    return unref(dataSourceRef)
  })

  function handleTableChange(pagination, filters, sorter) {
    fetchData({ pagination, filters, sorter })
    emit('change', pagination, filters, sorter)
  }

  async function fetchData(info: any = {}) {
    const { request, search } = unref(propsRef)
    const { pagination, filters, sorter, removeTotal = 0, beforeFetch } = info
    if (!request || !isFunction(request)) return
    setLoading(true)
    let pageParams: Recordable = {}
    const { current = 1, pageSize = 10, total } = unref(getPaginationInfo) as PaginationProps
    if ((isBoolean(pagination) && !pagination) || isBoolean(getPaginationInfo)) {
      pageParams = {}
    } else {
      pageParams.pageNum = handleCurrentPage(pagination || {
        current,
        pageSize,
        total
      }, removeTotal)
      pageParams.pageSize = pageSize
    }

    if (sorter && sorter.order) {
      setColumns(unref(getViewColumns).map(item => {
        if (item.dataIndex === sorter.columnKey) {
          item.sortOrder = sorter.order
        } else {
          item.sortOrder = false
        }
        return item
      }))
    } else if (sorter) {
      setColumns(unref(getViewColumns).map(item => {
        if (item.dataIndex === sorter.columnKey) item.sortOrder = false
        return item
      }))
    }

    const actionParams = {
      ...(pageParams || {}),
      ...(search?.type === 'dataSouce' || search?.type === 'columns'
        ? {}
        : {}),
      ...info.params,
      ...getFormParamsRef.value
    }

    if (beforeFetch && isFunction(beforeFetch)) {
      await beforeFetch(actionParams)
    }

    let resultItems: Recordable[] = []

    const response = await request(actionParams, sorter, filters)

    if (response && response.success) {
      resultItems = response.data
      dataSourceRef.value = resultItems
      setPagination({
        current: actionParams.pageNum,
        pageSize: actionParams.pageSize,
        total: response.total || 0
      })
    } else {
    }
    setLoading(false)
  }

  async function reload(opt = {}) {
    return await fetchData(opt)
  }

  // onMounted(() => {
  //   useTimeoutFn(() => {
  //     fetchData()
  //   }, 16)
  // })

  return {
    getDataSourceRef,
    fetchData,
    handleTableChange,
    reload
  }
}
