/**
 * Vite plugin for website theme color switching
 * https://github.com/anncwb/vite-plugin-theme
 */
import type { Plugin } from 'vite'
import path from 'path'
import {
  viteThemePlugin,
  antdDarkThemePlugin,
  mixLighten,
  mixDarken,
  tinycolor
} from 'vite-plugin-theme'
import { getThemeColors, generateColors } from '/config/default/themePluginConfig'
import { generateModifyVars } from '../../generate/generateModifyVars'

export function configThemePlugin(isBuild: boolean): Plugin[] {
  const colors = generateColors({
    mixDarken,
    mixLighten,
    tinycolor
  })
  const plugin = [
    viteThemePlugin({
      resolveSelector: (s) => {
        s = s.trim()
        switch (s) {
          case '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon':
            return '.ant-steps-item-icon > .ant-steps-icon'
          case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)':
          case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover':
          case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):active':
            return s
          case '.ant-steps-item-icon > .ant-steps-icon':
            return s
          case '.ant-select-item-option-selected:not(.ant-select-item-option-disabled)':
            return s
          default:
            if (s.indexOf('.ant-btn') >= -1) {
              // 按钮被重新定制过，需要过滤掉class防止覆盖
              return s
            }
        }
        return s.startsWith('[data-theme') ? s : `[data-theme] ${s}`
      },
      colorVariables: [ ...getThemeColors(), ...colors ]
    }),
    antdDarkThemePlugin({
      preloadFiles: [
        path.resolve(process.cwd(), 'node_modules/ant-design-vue/dist/antd.less'),
        path.resolve(process.cwd(), 'src/design/styles/index.less')
      ],
      filter: (id) => (isBuild ? !id.endsWith('antd.less') : true),
      // extractCss: false,
      darkModifyVars: {
        ...generateModifyVars()
      }
    })
  ]

  return plugin as unknown as Plugin[]
}
