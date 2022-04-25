import type { MenuTheme } from '/types/config'
import { PropTypes } from '/@/utils'
import type { CustomMenuRender } from './BaseMenu'
import type { SiderProps, MenuMode } from './typings'
import logoContentProps from '../LogoContent/props'
import type { MenuDataItem, LayoutType } from '../../typings'
import type { MenuHeaderRender, LinksRender } from '../../RenderTypings'
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
  logo: logoContentProps.logo,
  logoStyle: logoContentProps.logoStyle,
  logoDirection: logoContentProps.logoDirection,
  siderWidth: PropTypes.number.def(208),
  headerHeight: PropTypes.number.def(48),
  collapsedWidth: PropTypes.number.def(48),
  links: {
    type: [ Function, Object, Array ] as PropType<LinksRender>,
    default: () => undefined
  },
  menuHeaderRender: {
    type: [ Function, Object ] as PropType<MenuHeaderRender>,
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
