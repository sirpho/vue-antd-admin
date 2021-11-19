import { computed, onMounted, ref, unref, watch } from 'vue'
import { useTimeoutFn } from '/@/hooks/core/useTimeout'

export type ProRequestData<T, U = Record<string, any>> = (params: U, props: any) => Promise<T>;

export function useFetchData<T, U extends Record<string, any> = Record<string, any>>(props: {
  params?: U;
  request?: ProRequestData<T, U>;
}) {
  const requestData = ref<any>()

  const getResOptionsRef = computed(() => {
    return unref(requestData)
  })

  const fetchData = async () => {
    const loadData = await props.request?.(props.params as U, props)
    requestData.value = loadData
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

  onMounted(() => {
    useTimeoutFn(() => {
      fetchData()
    }, 16)
  })

  return {
    getResOptionsRef,
    fetchData
  }
}
