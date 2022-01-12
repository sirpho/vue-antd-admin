import { ref, ComputedRef, unref, computed, watch } from 'vue'
import type { ProTableProps } from '../'

export function useLoading(props: ComputedRef<ProTableProps>, emit: EmitType) {
  const loadingRef = ref(unref(props).loading)

  watch(
    () => unref(props).loading,
    (loading) => {
      loadingRef.value = loading
    }
  )

  const getLoading = computed(() => unref(loadingRef))

  function setLoading(loading: boolean) {
    loadingRef.value = loading
    emit('loadingChange', true)
  }

  return { getLoading, setLoading }
}
