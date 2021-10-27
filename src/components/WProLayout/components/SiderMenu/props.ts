import { CSSProperties } from 'vue'
import type { MenuTheme } from '/types/config'
import PropTypes from '/@/hooks/vue-types'
import { MenuDataItem, LayoutType } from '@wd-pro/pro-layout'
import { CustomMenuRender } from './BaseMenu'
import { SiderProps, MenuMode } from './typings'
import { defaultSettingProps } from '../../defaultSettings'

export const baseMenuProps = {
  ...defaultSettingProps,

  mode: {
    type: String as PropType<MenuMode>,
    default: 'inline'
  },
  menuData: {
    type: Array as PropType<MenuDataItem[]>,
    default: () => []
  },
  theme: {
    type: String as PropType<MenuTheme>,
    default: 'dark'
  },
  layout: {
    type: String as PropType<LayoutType>,
    default: 'mix'
  },
  collapsed: {
    type: Boolean as PropType<boolean | undefined>,
    default: () => false
  },
  openKeys: {
    type: Array as PropType<WithFalse<string[]>>,
    default: () => undefined
  },
  selectedKeys: {
    type: Array as PropType<WithFalse<string[]>>,
    default: () => undefined
  },
  menuProps: {
    type: Object as PropType<Record<string, any>>,
    default: () => null
  },
  menuItemRender: {
    type: [ Function, Boolean ] as PropType<CustomMenuRender['menuItemRender']>,
    default: () => false
  },
  subMenuItemRender: {
    type: [ Function, Boolean ] as PropType<CustomMenuRender['subMenuItemRender']>,
    default: () => false
  },
  onClick: [ Function, Object ] as PropType<(...args: any) => void>
}

export const siderMenuProps = {
  ...defaultSettingProps,
  ...baseMenuProps,
  menuLoading: PropTypes.looseBool,
  logo: {
    type: [ Object, String, Function ] as PropType<CustomRender>,
    default: () => undefined
  },
  logoStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => undefined
  },
  siderWidth: PropTypes.number.def(208),
  headerHeight: PropTypes.number.def(48),
  collapsedWidth: PropTypes.number.def(48),
  headerLogoRender: {
    type: [ Function, Object ] as PropType<WithFalse<(
      logo: CustomRender,
      title: CustomRender,
      props?: any
    ) => CustomRender>>,
    default: () => undefined
  },
  menuContentRender: {
    type: [ Function, Object ] as PropType<WithFalse<(
      props: any,
      defaultDom: CustomRender
    ) => CustomRender>>,
    default: () => undefined
  },
  collapsedButtonRender: {
    type: [
      Function,
      Object,
      Boolean
    ] as PropType<WithFalse<(collapsed?: boolean) => CustomRender>>,
    default: () => undefined
  },
  breakpoint: {
    type: [ Object, Boolean ] as PropType<SiderProps['breakpoint'] | false>,
    default: () => false
  },
  isMobile: PropTypes.looseBool,
  matchMenuKeys: {
    type: Array as PropType<string[]>,
    default: () => []
  },

  // events
  onMenuHeaderClick: PropTypes.func,
  onMenuClick: PropTypes.func,
  onCollapse: {
    type: Function as PropType<(collapsed: boolean) => void>
  },
  onOpenKeys: {
    type: Function as PropType<(openKeys: WithFalse<string[]>) => void>
  },
  onSelect: {
    type: Function as PropType<(selectedKeys: WithFalse<string[]>) => void>
  }
}
