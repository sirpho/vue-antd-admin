import {
  ref,
  unref,
  ComputedRef,
  computed,
  watch,
  onUnmounted,
  onDeactivated,
  onMounted
} from 'vue'
import { cloneDeep, isEqual } from 'lodash-es'
import { PaginationProps } from 'ant-design-vue/lib/pagination'
import {
  getSortIndex,
  handleCurrentPage,
  runFunction
} from '/@/utils/util'
import { isFunction, isBoolean } from '/@/utils/validate'
import type { ProTableProps } from '../'
import type { ProColumns } from '../types/column'
import useDebounceFn from '../hooks/useDebounceFn'

interface ActionType {
  getLoading: ComputedRef<boolean>;
  getPaginationInfo: ComputedRef<boolean | PaginationProps>;
  setPagination: (info: Partial<PaginationProps>) => void;
  setLoading: (loading: boolean) => void;
  setColumns: (columnList: Partial<ProColumns<RecordType>>[]) => void;
  getViewColumns: ComputedRef<ProColumns<RecordType>[]>;
  getFormParamsRef: ComputedRef<RecordType>;
}

export function useFetchData(
  propsRef: ComputedRef<ProTableProps>,
  {
    getLoading,
    getPaginationInfo,
    setPagination,
    setLoading,
    setColumns,
    getViewColumns,
    getFormParamsRef
  }: ActionType,
  emit: EmitType
) {
  const umountRef = ref<boolean>()
  const initial = ref<boolean>(true)
  const requesting = ref<boolean>(false)
  const pollingLoading = ref<boolean>(false)
  const debounceTime = ref<number>(unref(propsRef).debounceTime || 20)
  const dataSourceRef = ref<RecordType[]>(unref(propsRef).defaultData || [])

  const pollingSetTimeRef = ref<any>()

  const fetchListDebounce = useDebounceFn(
    async (info: any) => {
      if (pollingSetTimeRef.value) {
        clearTimeout(pollingSetTimeRef.value)
      }
      const msg = await fetchList(info)

      // 把判断要不要轮询的逻辑放到后面来这样可以保证数据是根据当前来
      // 放到请求前面会导致数据是上一次的
      const needPolling = runFunction(unref(propsRef).polling, msg)

      // 如果需要轮询，搞个一段时间后执行
      // 如果解除了挂载，删除一下
      if (needPolling && !umountRef.value) {
        pollingSetTimeRef.value = setTimeout(() => {
          fetchListDebounce.run({ ...info, isPolling: needPolling })
          // 这里判断最小要2000ms，不然一直loading
        }, Math.max(needPolling, 2000))
      }
    },
    debounceTime.value || 10
  )

  watch(
    () => unref(propsRef).dataSource,
    () => {
      const { dataSource, request } = unref(propsRef)
      !request && setList(dataSource || [])
    },
    {
      immediate: true
    }
  )

  watch(
    () => unref(propsRef).polling,
    (value) => {
      if (!value) {
        clearTimeout(pollingSetTimeRef.value)
      } else {
        fetchListDebounce.run({ isPolling: true })
      }
    },
    {
      immediate: true
    }
  )

  watch(
    () => unref(propsRef).waitRequest,
    (_) => {
      if (
        (!initial.value || !unref(propsRef).polling) &&
        unref(propsRef).search?.showSearch
      ) {
        fetchListDebounce.run({ isPolling: false })
      }
    },
    {
      immediate: true
    }
  )

  watch(
    () => unref(getFormParamsRef),
    (newVal, oldVal) => {
      if (
        (!initial.value || !unref(propsRef).polling) &&
        !unref(propsRef).search?.showSearch &&
        !isEqual(newVal, oldVal)
      ) {
        fetchListDebounce.run({ isPolling: false })
      }
    },
    {
      deep: true,
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
    setList(tableData)
    return unref(dataSourceRef)
  })

  const isTreeDataRef = computed(() => unref(dataSourceRef)
    .some(item => item.children && item.children.length > 0))

  function setPollingLoading(loading: boolean) {
    pollingLoading.value = loading
  }

  function handleTableChange(pagination, filters, sorter) {
    fetchListDebounce.run({ pagination, filters, sorter, isPolling: false })
    emit('change', pagination, filters, sorter)
  }

  const setDataAndLoading = (newData: any[], pageInfo: any) => {
    setList(newData)
    setPagination(pageInfo)
  }

  const fetchList = async (info: any = {}) => {
    const { request, search, beforeSearchSubmit, postData, waitRequest } = unref(propsRef)
    const { pagination, filters, sorter, removeTotal = 0, isPolling = false } = info
    if (!request || !isFunction(request) || (waitRequest && getLoading.value) || requesting.value) return
    requesting.value = true
    if (!isPolling || waitRequest || initial.value) {
      setLoading(true)
    } else {
      setPollingLoading(true)
    }
    if (waitRequest) {
      initial.value = false
      requesting.value = false
      return
    }
    const { current = 1, pageSize = 10, total } = unref(getPaginationInfo) as PaginationProps
    try {
      let pageParams: RecordType = {}
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

      const columnKey = sorter?.columnKey || sorter?.field

      if (sorter && sorter.order) {
        setColumns(unref(getViewColumns).map(item => {
          if (item.dataIndex === columnKey) {
            item.sortOrder = sorter.order
          } else {
            item.sortOrder = false
          }
          return item
        }))
      } else if (sorter) {
        setColumns(unref(getViewColumns).map(item => {
          if (item.dataIndex === columnKey) item.sortOrder = false
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

      let resultItems: RecordType[] = []

      const response = await request(actionParams, sorter, filters)
      requesting.value = false

      if (response && response.success) {
        resultItems = response.data
        if (postData && isFunction(postData)) {
          resultItems = (await postData(resultItems)) || resultItems
        }
        setDataAndLoading(resultItems, {
          total: response.total || 0
        })
        return resultItems
      } else {
        return []
      }
    } catch (e) {
      if (dataSourceRef.value === undefined) setList([])
      emit('requestError', e)
    } finally {
      initial.value = false
      setLoading(false)
    }

    return []
  }

  function setList(list: RecordType[]) {
    dataSourceRef.value = list
  }

  onMounted(() => {
    if (
      !unref(propsRef).polling &&
      unref(propsRef).search?.showSearch
    ) {
      fetchListDebounce.run({ isPolling: false })
    }
  })

  onUnmounted(() => {
    umountRef.value = true
    clearTimeout(pollingSetTimeRef.value)
  })

  onDeactivated(() => {
    umountRef.value = true
    clearTimeout(pollingSetTimeRef.value)
  })

  return {
    getDataSourceRef,
    isTreeDataRef,
    handleTableChange,
    reload: async (info?: any) => {
      await fetchListDebounce.run({ ...info, isPolling: false })
    }
  }
}
