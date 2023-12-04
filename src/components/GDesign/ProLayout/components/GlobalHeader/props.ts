import type { Theme } from '/@types/config'
import { PropTypes } from '@/utils'
import logoContentProps from '../LogoContent/props'
import { sidebarMenuProps } from '../SiderMenu/props'
import type { RightContentRender } from '../../RenderTypings'
import { defaultSettingProps } from '../../defaultSettings'
import { ExtraRightDropdownRender } from '../../RenderTypings'

export const globalHeaderProps = {
  ...defaultSettingProps,
  logo: logoContentProps.logo,
  logoStyle: logoContentProps.logoStyle,
  logoDirection: logoContentProps.logoDirection,
  menuLoading: PropTypes.looseBool,
  autoHideHeader: PropTypes.looseBool,
  collapsed: PropTypes.looseBool,
  isMobile: PropTypes.looseBool,
  sidebarWidth: sidebarMenuProps.sidebarWidth,
  headerTheme: {
    type: String as PropType<Theme>,
    default: 'dark'
  },
  menuData: {
    type: Array as PropType<AppRouteModule[]>,
    default: () => []
  },
  menuRender: {
    type: [ Object, Function ] as PropType<WithFalse<(props: any /* HeaderViewProps */,
      defaultDom: CustomRender) => CustomRender>>,
    default: () => undefined
  },
  extraRightDropdownRender: {
    type: [ Object, Function ] as PropType<ExtraRightDropdownRender>,
    default: () => undefined
  },
  rightContentRender: {
    type: [Object, Function] as PropType<RightContentRender>,
    default: () => undefined,
  },
  collapsedButtonRender: sidebarMenuProps.collapsedButtonRender,
  matchMenuKeys: sidebarMenuProps.matchMenuKeys,
  onCollapse: sidebarMenuProps.onCollapse,
  onOpenKeys: sidebarMenuProps.onOpenKeys,
  onMenuHeaderClick: PropTypes.func,
  onSelect: sidebarMenuProps.onSelect
}

export const headerViewProps = {
  ...globalHeaderProps,
  headerTitleRender: {
    type: [ Object, Function ] as PropType<WithFalse<(
      props: any,
      defaultDom: CustomRender
    ) => CustomRender>>,
    default: () => undefined
  },
  headerRender: {
    type: [Object, Function] as PropType<WithFalse<(props: any, defaultDom: CustomRender) => CustomRender>>,
    default: () => undefined,
  },
  headerContentRender: {
    type: [Object, Function] as PropType<WithFalse<(props: any) => CustomRender>>,
    default: () => undefined,
  },
  hasSiderMenu: PropTypes.looseBool,
  collapsedWidth: sidebarMenuProps.collapsedWidth,
  sidebarWidth: sidebarMenuProps.sidebarWidth
}

