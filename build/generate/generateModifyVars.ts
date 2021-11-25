import { getThemeVariables } from 'ant-design-vue/dist/theme'
import { resolve } from 'path'

export function generateModifyVars() {
  const modifyVars = getThemeVariables()

  return {
    hack: `${modifyVars.hack} @import (reference) "${resolve('src/design/styles/config.less')}";`,
  }
}
