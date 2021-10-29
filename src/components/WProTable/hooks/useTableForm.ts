import { ref, ComputedRef, unref, computed, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { ProTableProps } from '@wd-pro/pro-table'

export function useTableForm(
  props: ComputedRef<ProTableProps>,
  {
    propsSearchRef,
    propsParamsRef
  },
) {
  const formDataRef = ref(unref(propsSearchRef)?.data || [])
  const formParamsRef = ref(unref(props).params)

  watch(
    () => unref(propsSearchRef),
    (search) => {
      let searchData = search ? search.data : []
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
          ...formParamsRef.value,
          ...defaultParams
        }
      }
      formDataRef.value = cloneDeep(searchData)
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
        ...formParamsRef.value,
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
      ...unref(formParamsRef)
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
      ...formParamsRef.value,
      ...cloneDeep(params)
    }
  }

  return { getFormParamsRef, getFormDataRef, getFormParams, setFormParams }
}
