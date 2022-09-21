import { PropTypes } from '@/utils'
import { baseMenuProps, siderMenuProps } from '../SiderMenu/props'

export default {
  loading: PropTypes.looseBool,
  isMobile: siderMenuProps.isMobile,
  collapsed: baseMenuProps.collapsed,
  siderWidth: siderMenuProps.siderWidth,
  collapsedWidth: siderMenuProps.collapsedWidth,
  onReloadPage: {
    type: Function as PropType<() => void>
  }
}
