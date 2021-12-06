import type { WatchSource } from 'vue'
import { onMounted, ref, watch } from 'vue'

export function useEffect<T>(
  getValue: () => T,
  condition: (WatchSource<unknown> | object)[],
  shouldUpdate?: (prev: any[], next: any[]) => boolean
) {
  const isMomunt = ref(false)
  watch(condition, (next, pre) => {
    if (shouldUpdate) {
      if (shouldUpdate(next, pre)) {
        isMomunt.value && getValue()
      }
    } else {
      isMomunt.value && getValue()
    }
  })

  onMounted(() => {
    isMomunt.value = true
    getValue()
  })
}
