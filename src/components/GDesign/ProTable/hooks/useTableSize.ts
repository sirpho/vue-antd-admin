import { ref, ComputedRef, unref, computed, watch } from 'vue'
import type { ProTableProps } from '../'

export function useTableSize(props: ComputedRef<ProTableProps>, emit: EmitType) {
  const sizeRef = ref(unref(props).size)

  watch(
    () => unref(props).size,
    (size) => {
      sizeRef.value = size || 'middle'
    }
  )

  const getSize = computed(() => unref(sizeRef))

  function setSize(size: string) {
    sizeRef.value = size
    emit('sizeChange', true)
  }

  return { getSize, setSize }
}
