import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { defaultSettingProps } from './defaultSettings'
import { MenuDataItem } from './typings'
import { globalHeaderProps, headerViewProps } from './components/GlobalHeader/props'
import { siderMenuProps } from './components/SiderMenu/props'

export const basicLayoutProps = {
  ...defaultSettingProps,
  ...globalHeaderProps,
  ...siderMenuProps,
  ...headerViewProps,

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