import type { Theme } from '/types/config'
import type { MenuDataItem } from '@gx-pro/pro-layout'
import { PropTypes } from '/@/utils'
import { siderMenuProps } from '../SiderMenu/props'
import { defaultSettingProps } from '../../defaultSettings'

export const globalHeaderProps = {
  ...defaultSettingProps,
  logo: siderMenuProps.logo,
  logoStyle: siderMenuProps.logoStyle,
  menuLoading: PropTypes.looseBool,
  autoHideHeader: PropTypes.looseBool,
  collapsed: PropTypes.looseBool,
  isMobile: PropTypes.looseBool,
  siderWidth: siderMenuProps.siderWidth,
  headerTheme: {
    type: String as PropType<Theme>,
    default: 'dark'
  },
  menuData: {
    type: Array as PropType<MenuDataItem[]>,
    default: () => []
  },
  menuRender: {
    type: [ Object, Function ] as PropType<WithFalse<(props: any /* HeaderViewProps */,
      defaultDom: CustomRender) => CustomRender>>,
    default: () => undefined
  },
  extraRightDropdownRender: {
    type: [ Array ] as PropType<VueNode[]>,
    default: () => undefined
  },
  rightContentRender: {
    type: [ Object, Function ] as PropType<WithFalse<(props: any) => CustomRender>>,
    default: () => undefined
  },
  collapsedButtonRender: siderMenuProps.collapsedButtonRender,
  matchMenuKeys: siderMenuProps.matchMenuKeys,
  headerRender: {
    type: [ Object, Function ] as PropType<WithFalse<(
      props: any,
      defaultDom: CustomRender
    ) => CustomRender>>,
    default: () => undefined
  },
  onCollapse: siderMenuProps.onCollapse,
  onOpenKeys: siderMenuProps.onOpenKeys,
  onMenuHeaderClick: PropTypes.func,
  onSelect: siderMenuProps.onSelect
}

export const headerViewProps = {
  ...globalHeaderProps,
  headerRender: {
    type: [ Object, Function ] as PropType<WithFalse<(
      props: any,
      defaultDom: CustomRender
    ) => CustomRender>>,
    default: () => undefined
  },
  headerTitleRender: {
    type: [ Object, Function ] as PropType<WithFalse<(
      props: any,
      defaultDom: CustomRender
    ) => CustomRender>>,
    default: () => undefined
  },
  headerContentRender: {
    type: [ Object, Function ] as PropType<WithFalse<(props: any) => CustomRender>>,
    default: () => undefined
  },
  hasSiderMenu: PropTypes.looseBool,
  collapsedWidth: siderMenuProps.collapsedWidth,
  siderWidth: siderMenuProps.siderWidth
}
