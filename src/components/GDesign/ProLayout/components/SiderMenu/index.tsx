import type { FunctionalComponent as FC } from 'vue'
import { Drawer } from 'ant-design-vue'
import { siderMenuProps } from './props'
import SiderMenu, { SiderMenuProps, PrivateSiderMenuProps } from './SiderMenu'

export type SiderMenuWrapperProps = Partial<SiderMenuProps> & Partial<PrivateSiderMenuProps>

const SiderMenuWrapper: FC<SiderMenuWrapperProps> = (props, { attrs }) => {
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
      width={props.siderWidth}
      bodyStyle={{
        height: '100vh',
        padding: 0,
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      <SiderMenu {...attrs} {...props} collapsed={props.isMobile ? false : props.collapsed} />
    </Drawer>
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
