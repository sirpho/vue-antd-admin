import { ref, ComputedRef, unref, computed, watch } from 'vue'
import type { ProTableProps } from '@wd-pro/pro-table'

export function useTableSize(props: ComputedRef<ProTableProps>, emit: EmitType) {
  const sizeRef = ref(unref(props).size)

  watch(
    () => unref(props).size,
    (size) => {
      sizeRef.value = size || 'middle'
    }
  )

  const getSize = computed(() => unref(sizeRef))

  function setSize(loading: boolean) {
    sizeRef.value = loading
    emit('sizeChange', true)
  }

  return { getSize, setSize }
}
