import type { FunctionalComponent as FC, ExtractPropTypes } from 'vue'
import { computed, unref } from 'vue'
import { Layout, Spin, Menu } from 'ant-design-vue'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import BaseMenu from './BaseMenu'
import { siderMenuProps } from './props'
import LogoContent from '../LogoContent'
import { useRouteContext } from '../../RouteContext'

const { Sider } = Layout

const { Item } = Menu

export type SiderMenuProps = Partial<ExtractPropTypes<typeof siderMenuProps>>

export type PrivateSiderMenuProps = {
  matchMenuKeys?: string[]
}

export const defaultRenderCollapsedButton = (collapsed?: boolean): CustomRender =>
  collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />

const SiderMenu: FC<SiderMenuProps> = (props: SiderMenuProps) => {
  const {
    theme,
    layout,
    isMobile,
    menuLoading,
    breakpoint,
    fixSiderbar,
    collapsed,
    siderWidth,
    collapsedWidth = 48,
    menuExtraRender = false,
    menuContentRender = false,
    menuFooterRender = false,
    collapsedButtonRender = defaultRenderCollapsedButton,
    links,
    onCollapse,
    onOpenKeys
  } = props

  const context = useRouteContext()

  const baseClassName = context.getPrefixCls({
    suffixCls: 'sider',
    isPor: true
  })

  const hasSplitMenu = computed(() => props.layout === 'mix' && !props.isMobile && props.splitMenus)
  const layoutSide = computed(() => layout === 'side' || layout === 'simple')
  const sTheme = computed(() => (props.layout === 'mix' && 'light') || props.theme)
  const sSideWidth = computed(() => (props.collapsed ? props.collapsedWidth : props.siderWidth))
  const classNames = computed(() => {
    return [
      baseClassName,
      isMobile ? 'shadow' : null,
      sTheme.value,
      fixSiderbar ? `${baseClassName}-fixed` : null
    ]
  })

  const handleSelect = ($event: string[]) => {
    if (props.onSelect) {
      if (unref(hasSplitMenu)) {
        props.onSelect([context?.selectedKeys?.[0], ...$event])
        return
      }
      props.onSelect($event)
    }
  }

  if (hasSplitMenu.value && unref(context.flatMenuData).length === 0) {
    return null
  }

  const defaultMenuDom = (
    <BaseMenu
      class={`${baseClassName}-menu`}
      theme={sTheme.value}
      mode="inline"
      menuData={hasSplitMenu.value ? context.flatMenuData : context.menuData}
      collapsed={props.collapsed}
      openKeys={context.openKeys}
      selectedKeys={context.selectedKeys}
      menuItemRender={props.menuItemRender}
      subMenuItemRender={props.subMenuItemRender}
      onClick={props.onMenuClick}
      style={{
        width: '100%'
      }}
      {...{
        'onUpdate:openKeys': ($event: string[]) => onOpenKeys && onOpenKeys($event),
        'onUpdate:selectedKeys': handleSelect
      }}
    />
  )

  const headerDom =
    layoutSide.value || isMobile ? <LogoContent drawer={isMobile} {...props} /> : null

  const extraDom = menuExtraRender && menuExtraRender(props)

  const linksChild = computed(() => {
    if (typeof links === 'function') return links?.()
    return links
  })

  return (
    <>
      {fixSiderbar && (
        <div
          style={{
            width: `${sSideWidth.value}px`,
            overflow: 'hidden',
            flex: `0 0 ${sSideWidth.value}px`,
            maxWidth: `${sSideWidth.value}px`,
            minWidth: `${sSideWidth.value}px`,
            transition: `background-color 0.3s, min-width 0.3s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)`
          }}
        />
      )}
      <Sider
        collapsible
        trigger={null}
        class={classNames.value}
        style={{
          overflow: 'hidden',
          zIndex: fixSiderbar ? 101 : undefined,
          paddingTop: layoutSide.value || props.isMobile ? 0 : `${props.headerHeight}px`
        }}
        theme={sTheme.value}
        breakpoint={breakpoint || undefined}
        collapsed={collapsed}
        width={siderWidth}
        collapsedWidth={collapsedWidth}
        onCollapse={(collapse) => {
          if (props.isMobile) return
          onCollapse?.(collapse)
        }}
      >
        {menuLoading && (
          <div class="gx-pro-sider-loading">
            <Spin spinning={menuLoading} />
          </div>
        )}
        {headerDom || null}
        {extraDom && !props.collapsed && (
          <div
            class={{
              [`${baseClassName}-extra`]: true,
              [`${baseClassName}-extra-no-logo`]: !headerDom
            }}
          >
            {extraDom}
          </div>
        )}
        <div style="flex: 1 1 0%; overflow: hidden auto">
          {(menuContentRender && menuContentRender(props, defaultMenuDom)) || defaultMenuDom}
        </div>
        <div class={`${baseClassName}-links`}>
          <Menu
            theme={theme}
            inlineIndent={16}
            class={`${baseClassName}-link-menu`}
            selectedKeys={[]}
            openKeys={[]}
            mode="inline"
          >
            {((linksChild.value || []) as any[]).map((node, index) => (
              <Item class={`${baseClassName}-link`} key={index}>
                {node}
              </Item>
            ))}
            {collapsedButtonRender && !isMobile && (
              <Item
                class={`${baseClassName}-collapsed-button`}
                title={false}
                key="collapsed"
                onClick={() => {
                  if (onCollapse) {
                    onCollapse(!collapsed)
                  }
                }}
              >
                {collapsedButtonRender(collapsed)}
              </Item>
            )}
          </Menu>
        </div>
        {menuFooterRender && <div class={`${baseClassName}-footer`}>{menuFooterRender(props)}</div>}
      </Sider>
    </>
  )
}

export default SiderMenu
