import type { App, Plugin } from 'vue'

export const withInstall = <T>(comp: T, name?: string) => {
  const c = comp as any
  c.install = function (app: App) {
    app.component(name || c.displayName || c.name, comp)
  }

  return comp as T & Plugin
}


