import PropTypes from '/@/hooks/vue-types'
import { defaultSettingProps } from '../../defaultSettings'
import { baseMenuProps, siderMenuProps } from '../SiderMenu/props'

export default {
  loading: PropTypes.looseBool,
  isMobile: siderMenuProps.isMobile,
  collapsed: baseMenuProps.collapsed,
  siderWidth: siderMenuProps.siderWidth,
  collapsedWidth: siderMenuProps.collapsedWidth,
  isFixedMultiTab: defaultSettingProps.fixedMultiTab
}
