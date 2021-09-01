import { FunctionalComponent as FC } from 'vue'
import { siderMenuProps } from './props'
import SiderMenu, { SiderMenuProps, PrivateSiderMenuProps } from './SiderMenu'

export type SiderMenuWrapperProps = Partial<SiderMenuProps> & Partial<PrivateSiderMenuProps>;

const SiderMenuWrapper: FC<SiderMenuWrapperProps> = (props, { attrs }) => {
  return props.isMobile ? (
    <a-drawer
      visible={!props.collapsed}
      closable={false}
      placement={'left'}
      wrapClassName={`drawer-sider ${props.theme}`}
      onClose={() => props.onCollapse && props.onCollapse(true)}
      width={props.siderWidth}
    >
      <SiderMenu
        {...attrs}
        {...props}
        collapsed={props.isMobile ? false : props.collapsed}
        splitMenus={false}
      />
    </a-drawer>
  ) : (
    <SiderMenu {...attrs} {...props} />
  )
}

SiderMenuWrapper.inheritAttrs = false
SiderMenuWrapper.displayName = 'SiderMenuWrapper'

export {
  SiderMenu,
  // vue props
  siderMenuProps
}

export default SiderMenuWrapper
