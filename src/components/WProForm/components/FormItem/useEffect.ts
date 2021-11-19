import type { WatchSource } from 'vue'
import { watch } from 'vue'

export default function UseEffect<T>(
  getValue: () => T,
  condition: (WatchSource<unknown> | object)[],
  shouldUpdate?: (prev: any[], next: any[]) => boolean
) {
  watch(condition, (next, pre) => {
    if (shouldUpdate) {
      if (shouldUpdate(next, pre)) {
        getValue()
      }
    } else {
      getValue()
    }
  })
}
