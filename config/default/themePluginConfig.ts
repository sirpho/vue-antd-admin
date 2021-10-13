import { generate } from '@ant-design/colors'

type Fn = (...arg: any) => any;

type GenerateTheme = 'default' | 'dark';

export interface GenerateColorsParams {
  mixLighten: Fn;
  mixDarken: Fn;
  tinycolor: any;
  color?: string;
}

export const primaryColor = '#1890FF'

export const darkMode = 'light'

export function generateAntColors(color: string, theme: GenerateTheme = 'default') {
  return generate(color, {
    theme
  })
}

export function getThemeColors(color?: string) {
  const tc = color || primaryColor
  const lightColors = generateAntColors(tc)
  const primary = lightColors[5]
  const modeColors = generateAntColors(primary, 'dark')

  return [ ...lightColors, ...modeColors ]
}

export function generateColors({
  color = primaryColor,
  mixLighten,
  mixDarken,
  tinycolor
}: GenerateColorsParams) {
  const arr = new Array(19).fill(0)
  const lightens = arr.map((_t, i) => {
    return mixLighten(color, i / 5)
  })

  const darkens = arr.map((_t, i) => {
    return mixDarken(color, i / 5)
  })

  const alphaColors = arr.map((_t, i) => {
    return tinycolor(color)
      .setAlpha(i / 20)
      .toRgbString()
  })

  const shortAlphaColors = alphaColors.map((item) => item.replace(/\s/g, '').replace(/0\./g, '.'))

  const tinycolorLightens = arr
    .map((_t, i) => {
      return tinycolor(color)
        .lighten(i * 5)
        .toHexString()
    })
    .filter((item) => item !== '#ffffff')

  const tinycolorDarkens = arr
    .map((_t, i) => {
      return tinycolor(color)
        .darken(i * 5)
        .toHexString()
    })
    .filter((item) => item !== '#000000')
  return [
    ...lightens,
    ...darkens,
    ...alphaColors,
    ...shortAlphaColors,
    ...tinycolorDarkens,
    ...tinycolorLightens
  ].filter((item) => !item.includes('-'))
}

export default {
  theme: [
    {
      color: '#1890FF',
      fileName: '拂晓蓝（默认）'
    },
    {
      color: '#F5222D',
      fileName: '薄暮'
    },
    {
      color: '#FA541C',
      fileName: '火山'
    },
    {
      color: '#FAAD14',
      fileName: '日暮'
    },
    {
      color: '#13C2C2',
      fileName: '明青'
    },
    {
      color: '#52C41A',
      fileName: '极光绿'
    },
    {
      color: '#2F54EB',
      fileName: '极客蓝'
    },
    {
      color: '#722ED1',
      fileName: '酱紫'
    }
  ]
}
