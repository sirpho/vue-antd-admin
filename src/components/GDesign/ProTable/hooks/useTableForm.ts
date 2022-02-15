import { ComputedRef, reactive, ref, Ref, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { ProTableProps } from '../Table'
import { ProSearchMap } from '../types/column'
import { handleFormDefaultValue } from '../utils'

export function useTableForm({ searchMap, params, columns }: {
  searchMap: Ref<ProSearchMap[]>;
  params: Ref<ProTableProps['params']>;
  columns: ComputedRef<ProTableProps['columns']>;
}) {
  const formParamsRef = reactive<RecordType>({})
  const defaultParamsRef = reactive<RecordType>({})
  const formDataRef: Ref<ProSearchMap[]> = ref([])

  watch([ () => searchMap.value, () => columns.value, ], () => {
    let defaultParams = {}
    let searchData = cloneDeep(searchMap.value || [])

    columns.value.map(item => {
      if (item.searchConfig) searchData.push(item.searchConfig)
      return item
    })

    formDataRef.value = cloneDeep(searchData)
    defaultParams = handleFormDefaultValue(searchData)

    Object.assign(defaultParamsRef, { ...defaultParams })

    Object.assign(formParamsRef, {
      ...((params.value as RecordType) || {}),
      ...defaultParams
    })
  }, {
    deep: true,
    immediate: true
  })

  function setFormParams(params) {
    Object.assign(formParamsRef, params)
  }

  return { formDataRef, formParamsRef, defaultParamsRef, setFormParams }
}
