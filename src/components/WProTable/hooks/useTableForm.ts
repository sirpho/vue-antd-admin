import { ref, ComputedRef, unref, computed, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { ProTableProps } from '@wd-pro/pro-table'
import { getPropsSlot } from '/@/components/_util'

export function useTableForm(
  props: ComputedRef<ProTableProps>,
  slots: any
) {
  const formDataRef = ref(unref(props).search?.data || [])
  const formParamsRef = ref(unref(props).params)

  watch(
    () => unref(props).search,
    (searchConfig) => {
      let searchData = searchConfig ? searchConfig.data : []
      if (searchConfig && searchConfig.type === 'columns') {
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
    () => unref(props).params,
    (value) => {
      formParamsRef.value = value
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
    return unref(props).search?.type === 'slots' ?
      getPropsSlot(slots, props, 'search')
      : unref(formDataRef)
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
