import type { Plugin, PluginOption } from 'vite'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'

import optimizer from "vite-plugin-optimizer";
import { configHtmlPlugin } from './html'
import { configMockPlugin } from './mock'
import { createAutoImport } from './autoImport'
import { configCompressPlugin } from './compress'
import { configVisualizerConfig } from './visualizer'
import { configHmrPlugin } from './hmr'
import { electronPlugin, getReplacer } from './electronPlugin'

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const {
    VITE_USE_MOCK,
    VITE_LEGACY,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
  } = viteEnv

  const vitePlugins: (Plugin | PluginOption[])[] = [
    optimizer(getReplacer()),
    electronPlugin(),
    // have to
    vue(),
    // have to
    vueJsx()
  ]

  !isBuild && vitePlugins.push(configHmrPlugin())

  // @vitejs/plugin-legacy
  VITE_LEGACY && isBuild && vitePlugins.push(legacy())

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild))

  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild))

  // rollup-plugin-visualizer
  vitePlugins.push(configVisualizerConfig())

  // unplugin-auto-import/vite
  vitePlugins.push(createAutoImport())

  // The following plugins only work in the production environment
  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE)
    )
  }

  return vitePlugins
}
