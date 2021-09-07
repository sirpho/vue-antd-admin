import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { defaultSettingProps } from '../../defaultSettings'
import { baseMenuProps, siderMenuProps } from '../SiderMenu/props'

export default {
  loading: PropTypes.looseBool,
  collapsed: baseMenuProps.collapsed,
  siderWidth: siderMenuProps.siderWidth,
  collapsedWidth: siderMenuProps.collapsedWidth,
  isFixedMultiTab: defaultSettingProps.fixedMultiTab
}
