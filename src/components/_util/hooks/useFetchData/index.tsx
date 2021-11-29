import { computed, onMounted, reactive, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useTimeoutFn } from '/@/hooks/core/useTimeout'

export type ProRequestData<T, U = Record<string, any>> = (params: U, props: any) => Promise<T>;

export default function useFetchData<T, U extends Record<string, any> = Record<string, any>>(props: {
  model?: any;
  changeModelRef?: any;
  params?: U;
  request?: ProRequestData<T, U>;
}) {
  const modelRef = reactive({})
  const requestData = reactive({})

  const getResOptionsRef = computed(() => {
    return requestData
  })

  const getModelRef = computed(() => {
    return modelRef
  })

  const fetchData = async () => {
    const loadData = await props.request?.(props.params as U, props)
    Object.assign(modelRef, loadData || {})
    Object.assign(requestData, loadData || {})
  }

  watch(
    () => props.params,
    (_) => {
      fetchData()
    }, {
      deep: true,
      immediate: true
    }
  )

  watch(
    () => props.model,
    (val) => {
      Object.assign(modelRef, cloneDeep(val || {}))
    }, {
      deep: true,
      immediate: true
    }
  )

  watch(
    () => props.changeModelRef,
    (val) => {
      Object.assign(modelRef, cloneDeep(val || {}))
    }, {
      deep: true,
      immediate: true
    }
  )

  onMounted(() => {
    useTimeoutFn(() => {
      fetchData()
    }, 16)
  })

  return {
    getModelRef,
    getResOptionsRef,
    fetchData
  }
}
