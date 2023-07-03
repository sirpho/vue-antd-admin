import { PropTypes } from '@/utils'
import { baseMenuProps, sidebarMenuProps } from '../SiderMenu/props'

export default {
  loading: PropTypes.looseBool,
  isMobile: sidebarMenuProps.isMobile,
  collapsed: baseMenuProps.collapsed,
  sidebarWidth: sidebarMenuProps.sidebarWidth,
  collapsedWidth: sidebarMenuProps.collapsedWidth,
  onReloadPage: {
    type: Function as PropType<() => void>
  }
}
