import type { PropType } from 'vue'
import type { CustomRender, Theme, MenuDataItem, WithFalse } from '../../typings'
import { defaultSettingProps } from '../../defaultSettings'
import { PropTypes } from '../../utils'
import { siderMenuProps } from '../SiderMenu/props'

export const globalHeaderProps = {
  ...defaultSettingProps,
  logo: siderMenuProps.logo,
  logoStyle: siderMenuProps.logoStyle,
  menuLoading: PropTypes.looseBool,
  autoHideHeader: PropTypes.looseBool,
  collapsed: PropTypes.looseBool,
  isMobile: PropTypes.looseBool,
  siderWidth: PropTypes.number.def(208),
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
  rightContentRender: {
    type: [ Object, Function ] as PropType<WithFalse<(props: any) => CustomRender>>,
    default: () => undefined
  },
  collapsedButtonRender: siderMenuProps.collapsedButtonRender,
  matchMenuKeys: siderMenuProps.matchMenuKeys,
  headerRender: {
    type: [ Object, Function ] as PropType<WithFalse<(props: any, defaultDom: CustomRender) => CustomRender>>,
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
    type: [ Object, Function ] as PropType<WithFalse<(props: any, defaultDom: CustomRender) => CustomRender>>,
    default: () => undefined
  },
  headerTitleRender: {
    type: [ Object, Function ] as PropType<WithFalse<(props: any, defaultDom: CustomRender) => CustomRender>>,
    default: () => undefined
  },
  headerContentRender: {
    type: [ Object, Function ] as PropType<WithFalse<(props: any) => CustomRender>>,
    default: () => undefined
  },
  hasSiderMenu: PropTypes.looseBool,
  siderWidth: PropTypes.number.def(208)
}

