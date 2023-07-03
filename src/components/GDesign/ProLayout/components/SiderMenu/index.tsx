import type { FunctionalComponent as FC } from 'vue'
import { Drawer } from 'ant-design-vue'
import { sidebarMenuProps } from './props'
import SidebarMenu, { SidebarMenuProps, PrivateSidebarMenuProps } from './SiderMenu'

export type SidebarMenuWrapperProps = Partial<SidebarMenuProps> & Partial<PrivateSidebarMenuProps>

const SidebarMenuWrapper: FC<SidebarMenuWrapperProps> = (props, { attrs }) => {
  return props.isMobile ? (
    <Drawer
      visible={!props.collapsed}
      closable={false}
      placement="left"
      style={{
        padding: 0,
        height: '100vh'
      }}
      onClose={() => props.onCollapse && props.onCollapse(true)}
      width={props.sidebarWidth}
      bodyStyle={{
        height: '100vh',
        padding: 0,
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      <SidebarMenu {...attrs} {...props} collapsed={props.isMobile ? false : props.collapsed} />
    </Drawer>
  ) : (
    <SidebarMenu {...attrs} {...props} />
  )
}

SidebarMenuWrapper.inheritAttrs = false
SidebarMenuWrapper.displayName = 'SidebarMenuWrapper'

export {
  SidebarMenu,
  // vue props
  sidebarMenuProps
}

export default SidebarMenuWrapper
