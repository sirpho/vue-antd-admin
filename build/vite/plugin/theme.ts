/**
 * Vite plugin for website theme color switching
 * https://github.com/anncwb/vite-plugin-theme
 */
import type { Plugin } from 'vite'
import path from 'path'
import themePreprocessorPlugin from '@zougt/vite-plugin-theme-preprocessor'
import { themeConfig } from '/config/default/themeColor'

export function configThemePlugin(): Plugin[] {

  const themePlugins = themeConfig.map(item => {
    return {
      scopeName: item.fileName,
      path: path.resolve(`src/design/styles/theme/${item.fileName}.less`)
    }
  })

  return themePreprocessorPlugin({
    // 使用Less
    less: {
      // 此处配置自己的主题文件
      multipleScopeVars: themePlugins,
      defaultScopeName: themePlugins[0].scopeName,
      extract: false
    }
  })
}
