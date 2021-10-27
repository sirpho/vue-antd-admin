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
