import { ref, ComputedRef, unref, computed, watch } from 'vue'
import { cloneDeep, isEqual } from 'lodash-es'
import type { ProTableProps } from '@gx-pro/pro-table'

export function useTableForm(
  props: ComputedRef<ProTableProps>,
  {
    propsParamsRef
  }
) {
  const formDataRef = ref<any[]>(unref(props).search?.searchData || [])
  const formParamsRef = ref(unref(props).params || {})

  watch(
    () => unref(props).search,
    (search, oldSearch) => {
      if (!isEqual(search, oldSearch)) {
        let searchData = search ? search.searchData : []
        if (search && search.type === 'columns') {
          searchData = []
          unref(props).columns.map(item => {
            if (item.searchConfig) searchData.push(item.searchConfig)
            return item
          })
        }
        if (search && (search.type === 'columns' || search.type === 'dataSouce')) {
          const defaultParams = {}
          cloneDeep(searchData).map(item => {
            let initialValue = item.initialValue
            const valueUndefined = [ 'select' ]
            const valueNull = [ 'date', 'time', 'dateRange' ]
            if (!initialValue && valueUndefined.includes(item.valueType)) {
              initialValue = undefined
            } else if (!initialValue && valueNull.includes(item.valueType)) {
              initialValue = null
            } else if (!initialValue) {
              initialValue = ''
            }
            if (item.name === 'dateRange') {
              defaultParams[item.rangeStartName || 'start'] = initialValue ? initialValue[0] : null
              defaultParams[item.rangeEndName || 'end'] = initialValue ? initialValue[1] : null
            } else {
              defaultParams[item.name] = initialValue
            }
            return item
          })
          formParamsRef.value = {
            ...formParamsRef.value as object,
            ...defaultParams
          }
        }
        formDataRef.value = cloneDeep(searchData)
      }
    },
    {
      deep: true,
      immediate: true
    }
  )

  watch(
    () => unref(propsParamsRef),
    (params) => {
      formParamsRef.value = {
        ...formParamsRef.value as object,
        ...params
      }
    },
    {
      deep: true,
      immediate: true
    }
  )

  const getFormParamsRef = computed(() => {
    return {
      ...unref(formParamsRef as object)
    }
  })

  const getFormDataRef = computed(() => {
    return unref(formDataRef)
  })

  function getFormParams() {
    return unref(getFormParamsRef)
  }

  function setFormParams(params) {
    formParamsRef.value = {
      ...formParamsRef.value as object,
      ...cloneDeep(params)
    }
  }

  return { getFormParamsRef, getFormDataRef, getFormParams, setFormParams }
}
