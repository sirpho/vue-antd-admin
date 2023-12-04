import type { configSetting } from '/@types/config'
import theme from './default/theme'
import network from './default/network'
import defaultSettings from './default/defaultSettings'

export * from './default/proxy'

export default {
  theme,
  network,
  defaultSettings
} as configSetting
