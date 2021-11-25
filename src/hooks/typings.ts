import type { App, Plugin, Ref } from 'vue'

/**
 * Any function
 */
export type Fn = () => void

/**
 * Maybe it's a ref, or not.
 *
 * ```ts
 * type MaybeRef<T> = T | Ref<T>
 * ```
 */
export type MaybeRef<T> = T | Ref<T>

export const withInstall = <T>(comp: T, name?: string) => {
  const c = comp as any
  c.install = function (app: App) {
    app.component(name || c.displayName || c.name, comp)
  }

  return comp as T & Plugin
}


