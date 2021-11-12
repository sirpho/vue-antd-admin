import type { Ref } from 'vue';
import { ref, watch } from 'vue'
import { isFunction } from '/@/utils/validate'

export function useMemo<T>(factory: () => T, deps: any[] | undefined) {
  const memoRef: Ref<T> = ref(factory() as any)

  if (!isFunction(factory)) {
    throw new Error('factory is not Function!')
  }

  watch(() => deps, (_) => {
    memoRef.value = factory()
  }, {
    deep: true,
    immediate: true
  })

  return memoRef
}
