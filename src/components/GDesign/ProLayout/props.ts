import { PropTypes } from '/@/utils'
import type { MenuDataItem } from './typings'
import { defaultSettingProps } from './defaultSettings'
import { globalHeaderProps, headerViewProps } from './components/GlobalHeader/props'
import { siderMenuProps } from './components/SiderMenu/props'
import multiTabProps from './components/MultiTab/props'

export const basicLayoutProps = {
  ...defaultSettingProps,
  ...globalHeaderProps,
  ...siderMenuProps,
  ...headerViewProps,
  ...multiTabProps,

  contentStyle: PropTypes.style,
  disableContentMargin: PropTypes.looseBool,
  isChildrenLayout: PropTypes.looseBool,
  loading: PropTypes.looseBool,
  menuData: {
    type: Array as PropType<MenuDataItem[]>,
    default: () => []
  },
  collapsed: PropTypes.looseBool
}
