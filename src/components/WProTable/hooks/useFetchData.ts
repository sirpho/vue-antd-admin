import {
  ref,
  unref,
  ComputedRef,
  computed,
  watch,
  onMounted
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
      if (!unref(propsRef).search?.showSearch) {
        useTimeoutFn(() => {
          fetchData()
        }, 16)
      }
    },
    {
      immediate: true
    }
  )

  const getDataSourceRef = computed(() => {
    const { current = 1, pageSize = 10 } = unref(getPaginationInfo) as PaginationProps
    const dataSource = unref(dataSourceRef)
    if (
      !dataSource ||
      dataSource.length === 0 ||
      !unref(getViewColumns) ||
      unref(getViewColumns).length === 0
    ) {
      return []
    }
    let tableData = cloneDeep(unref(dataSourceRef))
    tableData = getSortIndex(tableData, {
      current,
      pageSize
    })
    dataSourceRef.value = tableData
    return unref(dataSourceRef)
  })

  const isTreeDataRef = computed(() => unref(dataSourceRef)
    .some(item => item.children && item.children.length > 0))

  function handleTableChange(pagination, filters, sorter) {
    fetchData({ pagination, filters, sorter })
    emit('change', pagination, filters, sorter)
  }

  async function fetchData(info: any = {}) {
    const { request, search, beforeSearchSubmit, postData } = unref(propsRef)
    const { pagination, filters, sorter, removeTotal = 0 } = info
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

    let actionParams = {
      ...(pageParams || {}),
      ...(search?.type === 'dataSouce' || search?.type === 'columns'
        ? {}
        : {}),
      ...info.params,
      ...getFormParamsRef.value
    }

    if (beforeSearchSubmit && isFunction(beforeSearchSubmit)) {
      actionParams = await beforeSearchSubmit(actionParams, sorter, filters)
    }

    let resultItems: Recordable[] = []

    const response = await request(actionParams, sorter, filters)

    if (response && response.success) {
      resultItems = response.data
      if (postData && isFunction(postData)) {
        resultItems = (await postData(resultItems)) || resultItems
      }
      dataSourceRef.value = resultItems
      setPagination({
        current: actionParams.pageNum,
        pageSize: actionParams.pageSize,
        total: response.total || 0
      })
    } else {
      emit('requestError', response)
    }
    setLoading(false)
  }

  async function reload(opt = {}) {
    return await fetchData(opt)
  }

  onMounted(() => {
    if (unref(propsRef).search?.showSearch) {
      useTimeoutFn(() => {
        fetchData()
      }, 16)
    }
  })

  return {
    getDataSourceRef,
    isTreeDataRef,
    fetchData,
    handleTableChange,
    reload
  }
}
