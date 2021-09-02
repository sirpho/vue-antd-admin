import type { FunctionalComponent, ExtractPropTypes } from 'vue'
import { default as ResizeObserver } from 'ant-design-vue/es/vc-resize-observer'
import { computed, ref } from 'vue'
import { globalHeaderProps } from './props'
import type { SiderMenuProps } from '../SiderMenu/SiderMenu'
import {
  defaultRenderCollapsedButton
} from '../SiderMenu/SiderMenu'
import {
  siderMenuProps
} from '../SiderMenu/props'
import BaseMenu from '../SiderMenu/BaseMenu'
import DeFaultRightContent from '../RightContent'
import LogoContent from '../LogoContent'
import { useRouteContext } from '../../RouteContext'

export const defaultHeaderProps = { ...siderMenuProps, ...globalHeaderProps }

export type DefaultHeaderProps = Partial<ExtractPropTypes<typeof defaultHeaderProps>> &
  Partial<SiderMenuProps>;

const RightContent: FunctionalComponent<DefaultHeaderProps> = ({
  rightContentRender,
  ...props
}) => {
  const rightSize = ref<number | string>('auto')

  return (
    <div
      style={{
        minWidth: rightSize.value
      }}
    >
      <div
        style={{
          paddingRight: 8
        }}
      >
        <ResizeObserver
          onResize={({ width }: { width: number }) => {
            rightSize.value = width
          }}
        >
          {rightContentRender && typeof rightContentRender === 'function' ? (
            <div>
              {rightContentRender({
                ...props
              })}
            </div>
          ) : <DeFaultRightContent />}
        </ResizeObserver>
      </div>
    </div>
  )
}

export const DefaultHeader: FunctionalComponent<DefaultHeaderProps> = (props) => {
  const headerRef = ref()
  const {
    isMobile,
    onOpenKeys,
    onSelect,
    layout,
    collapsed,
    onCollapse,
    collapsedButtonRender = defaultRenderCollapsedButton,
    rightContentRender,
    menuData,
    theme
  } = props
  const context = useRouteContext()
  const baseClassName = computed(() => `wd-pro-global-header`)
  const className = computed(() => {
    return [
      baseClassName.value,
      theme
    ]
  })

  return (
    <div style={{ height: '100%' }} class={className.value}>
      <div ref={headerRef} class="wd-pro-global-header-main">
        {layout === 'mix' && (
          <LogoContent disabledTitle={isMobile || collapsed} {...props} />
        )}
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
        {
          layout === 'mix' && !isMobile ?
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
                  'onUpdate:selectedKeys': ($event: string[]) => onSelect && onSelect($event)
                }}
              />
            </div>
            :
            <div style={{ flex: 1 }}></div>
        }
        <RightContent rightContentRender={rightContentRender} {...props} />
      </div>
    </div>
  )
}
DefaultHeader.inheritAttrs = false
