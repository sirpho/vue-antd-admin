import type { FunctionalComponent, ExtractPropTypes } from 'vue'
import { computed, ref } from 'vue'
import { globalHeaderProps } from './props'
import {
  defaultRenderCollapsedButton
} from '../SiderMenu/SiderMenu'
import {
  siderMenuProps
} from '../SiderMenu/props'
import BaseMenu from '../SiderMenu/BaseMenu';
import LogoContent from '../LogoContent'
import { useRouteContext } from '../../RouteContext';

export const topNavHeaderProps = Object.assign({}, siderMenuProps, globalHeaderProps);

export type DefaultHeaderProps = ExtractPropTypes<typeof topNavHeaderProps>;

export const DefaultHeader: FunctionalComponent<DefaultHeaderProps> = (props) => {
  const headerRef = ref();
  const {
    isMobile,
    onOpenKeys,
    onSelect,
    layout,
    collapsed,
    onCollapse,
    collapsedButtonRender = defaultRenderCollapsedButton,
    // rightContentRender,
    menuData,
    theme
  } = props
  const context = useRouteContext();
  const baseClassName = computed(() => `wd-pro-global-header`)
  const className = computed(() => {
    return [
      baseClassName.value,
      theme
    ]
  })

  return (
    <div class={className.value}>
      <div ref={headerRef} class="wd-pro-global-header-main">
        <LogoContent {...props } />
        {(layout === 'side' || isMobile) && collapsedButtonRender && (
          <span
            class={`${baseClassName.value}-collapsed-button`}
            onClick={() => {
              if (onCollapse) {
                onCollapse(!collapsed)
              }
            }}
          >
          {collapsedButtonRender(collapsed)}
        </span>
        )}
        <div style={{ flex: 1 }} class="wd-pro-global-header-menu">
          <BaseMenu
            theme={props.theme}
            mode={props.mode}
            collapsed={props.collapsed}
            menuData={menuData}
            openKeys={context.openKeys}
            selectedKeys={context.selectedKeys}
            class={{ 'top-nav-menu': props.mode === 'horizontal' }}
            {...{
              'onUpdate:openKeys': ($event: string[]) => onOpenKeys && onOpenKeys($event),
              'onUpdate:selectedKeys': ($event: string[]) => onSelect && onSelect($event),
            }}
          />
        </div>
      </div>
    </div>
  )
}
DefaultHeader.emits = [ 'menuHeaderClick', 'collapse', 'openKeys', 'select' ]
