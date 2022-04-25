import type { Ref } from 'vue'
import { ref, watchEffect } from 'vue'
import { isFunction } from '/@/utils/validate'

function useState<T>(initialState: T | (() => T)): [ T, (value: T) => void ] {
  const state: Ref<T> = ref()

  watchEffect(() => {
    state.value = isFunction(initialState) ? (initialState as Function)() : initialState
  })

  function setState(value: T) {
    state.value = value
  }

  return [ state.value, setState ]
}

export default useState
