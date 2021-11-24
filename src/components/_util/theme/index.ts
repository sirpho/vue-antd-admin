import { replaceStyleVariables } from 'vite-plugin-theme/es/client'
import { mixLighten, mixDarken, tinycolor } from 'vite-plugin-theme/es/colorUtils'
import { getThemeColors, generateColors } from '/config/default/themePluginConfig'

const themeConfig = {
  '#1890FF': 'daybreak',
  '#F5222D': 'dust',
  '#FA541C': 'volcano',
  '#FAAD14': 'sunset',
  '#13C2C2': 'cyan',
  '#52C41A': 'green',
  '#2F54EB': 'geekblue',
  '#722ED1': 'purple'
}

/**
 * #1890ff -> daybreak
 *
 * @param val
 */
export function genThemeToString(val?: string): string {
  return val && themeConfig[val] ? themeConfig[val] : undefined
}

export async function changeTheme(color: string) {
  const colors = generateColors({
    mixDarken,
    mixLighten,
    tinycolor,
    color
  })

  return await replaceStyleVariables({
    colorVariables: [ ...getThemeColors(color), ...colors ]
  })
}
