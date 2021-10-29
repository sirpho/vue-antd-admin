import type { FunctionalComponent, ExtractPropTypes } from 'vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { default as ResizeObserver } from 'ant-design-vue/es/vc-resize-observer'
import { useRouteContext } from '@wd-pro/pro-layout'
import { globalHeaderProps } from './props'
import type { SiderMenuProps } from '../SiderMenu/SiderMenu'
import { defaultRenderCollapsedButton } from '../SiderMenu/SiderMenu'
import { siderMenuProps } from '../SiderMenu/props'
import BaseMenu from '../SiderMenu/BaseMenu'
import DeFaultRightContent from '../RightContent'
import LogoContent from '../LogoContent'

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
  const router = useRouter()
  const context = useRouteContext()
  const baseClassName = computed(() => `wd-pro-global-header`)
  const className = computed(() => {
    return [
      baseClassName.value,
      theme
    ]
  })

  const handleChangeKeys = (type: string) => {
    if (router.currentRoute) {
      const matched = router.currentRoute.value.matched.concat()
      if (onSelect && type === 'select') onSelect(matched.filter(r => r.name !== 'index').map(r => r.path))
      if (onOpenKeys && type === 'openKeys') onOpenKeys(matched
        .filter(r => r.path !== router.currentRoute.value.path)
        .map(r => r.path))
    }
  }

  return (
    <div style={{ height: '100%' }} class={className.value}>
      <div ref={headerRef} class="wd-pro-global-header-main">
        {layout === 'mix' && (
          <LogoContent disabledTitle={isMobile} {...props} />
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
                  'onUpdate:openKeys': () => handleChangeKeys('openKeys'),
                  'onUpdate:selectedKeys': () => handleChangeKeys('select')
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
