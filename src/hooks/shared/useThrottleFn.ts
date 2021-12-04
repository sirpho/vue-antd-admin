import { unref } from 'vue'
import { FunctionArgs, MaybeRef, EventFilter } from '../typings'

export function createFilterWrapper<T extends FunctionArgs>(filter: EventFilter, fn: T) {
  function wrapper(this: any, ...args: any[]) {
    filter(() => fn.apply(this, args), { fn, thisArg: this, args })
  }

  return wrapper as any as T
}

export function throttleFilter(ms: MaybeRef<number>, trailing = true, leading = true) {
  let lastExec = 0
  let timer: ReturnType<typeof setTimeout> | undefined
  let preventLeading = !leading

  const clear = () => {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  const filter: EventFilter = (invoke) => {
    const duration = unref(ms)
    const elapsed = Date.now() - lastExec

    clear()

    if (duration <= 0) {
      lastExec = Date.now()
      return invoke()
    }

    if (elapsed > duration) {
      lastExec = Date.now()
      if (preventLeading) preventLeading = false
      else invoke()
    }
    else if (trailing) {
      timer = setTimeout(() => {
        lastExec = Date.now()
        if (!leading) preventLeading = true
        clear()
        invoke()
      }, duration)
    }

    if (!leading && !timer) timer = setTimeout(() => preventLeading = true, duration)
  }

  return filter
}


export function useThrottleFn<T extends FunctionArgs>(fn: T, ms: MaybeRef<number> = 200, trailing = true, leading = true): T {
  return createFilterWrapper(
    throttleFilter(ms, trailing, leading),
    fn,
  )
}
