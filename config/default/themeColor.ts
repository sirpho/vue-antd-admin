/**
 * 获取第一个颜色作为默认配色
 */
export function genFirstColor(): string {
  return themeConfig[0].color
}

export const themeConfig = [
  {
    color: '#1890FF',
    colorName: '拂晓蓝（默认）',
  },
  {
    color: '#F5222D',
    colorName: '薄暮',
  },
  {
    color: '#FA541C',
    colorName: '火山',
  },
  {
    color: '#FAAD14',
    colorName: '日暮',
  },
  {
    color: '#13C2C2',
    colorName: '明青',
  },
  {
    color: '#52C41A',
    colorName: '极光绿',
  },
  {
    color: '#2F54EB',
    colorName: '极客蓝',
  },
  {
    color: '#722ED1',
    colorName: '酱紫',
  }
]
