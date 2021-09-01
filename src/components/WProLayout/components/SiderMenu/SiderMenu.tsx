import {
  FunctionalComponent as FC,
  ExtractPropTypes,
  computed,
  unref
} from 'vue'
import { useStore } from 'vuex'
import { cloneDeep } from 'lodash-es'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import BaseMenu from './BaseMenu'
import { siderMenuProps } from './props'
import LogoContent from '../LogoContent'
import { CustomRender } from '../../typings'
import { useRouteContext } from '../../RouteContext'
import { getMenuFirstChildren } from '../../utils'

export type SiderMenuProps = Partial<ExtractPropTypes<typeof siderMenuProps>>;

export type PrivateSiderMenuProps = {
  matchMenuKeys?: string[];
};

export const defaultRenderCollapsedButton = (collapsed?: boolean): CustomRender =>
  collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />

const SiderMenu: FC<SiderMenuProps> = (props: SiderMenuProps) => {
  const {
    layout,
    theme,
    isMobile,
    menuLoading,
    breakpoint,
    fixSiderbar,
    collapsed,
    siderWidth,
    collapsedWidth = 48,
    menuContentRender = false,
    collapsedButtonRender = defaultRenderCollapsedButton,

    onCollapse,
    onOpenKeys
  } = props

  const store = useStore()

  const context = useRouteContext()
  const hasSplitMenu = computed(() => props.layout === 'mix')
  const hasSide = computed(() => props.layout === 'mix' || props.layout === 'side' || false)

  const sTheme = computed(() => (props.layout === 'mix' && 'light') || props.theme)
  const classNames = computed(() => {
    return [
      'wd-pro-sider',
      isMobile ? 'shadow' : null,
      theme,
      fixSiderbar ? 'wd-pro-sider-fixed' : null
    ]
  })

  const flatMenuData = computed(
    () => {
      const menuData = (hasSide.value &&
        hasSplitMenu.value &&
        getMenuFirstChildren(context.menuData, context.selectedKeys[0])) || []
      store.dispatch('routes/setSiderRoutes', cloneDeep(menuData))
      return menuData
    }
  )

  const handleSelect = ($event: string[]) => {
    if (props.onSelect) {
      if (unref(hasSplitMenu)) {
        props.onSelect([ context.selectedKeys[0], ...$event ])
        return
      }
      props.onSelect($event)
    }
  }

  if (hasSplitMenu.value && flatMenuData.value.length === 0) {
    return null
  }

  const defaultMenuDom = (
    <BaseMenu
      theme={sTheme.value}
      mode="inline"
      menuData={hasSplitMenu.value ? flatMenuData.value : context.menuData}
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

  const headerDom = layout === 'side' ? <LogoContent {...props} /> : null

  return (
    <>
      {
        fixSiderbar && (
          <div class="wd-pro-fixed-stuff" style={{ width: '208px', overflow: 'hidden' }}></div>
        )
      }
      <a-layout-sider
        class={classNames.value}
        style={{
          paddingTop:
            props.layout === 'side' || props.isMobile ? undefined : `${props.headerHeight}px`
        }}
        breakpoint={breakpoint || undefined}
        collapsed={collapsed}
        width={siderWidth}
        collapsedWidth={collapsedWidth}
        onCollapse={collapse => {
          if (props.isMobile) return
          onCollapse?.(collapse)
        }}
      >
        {menuLoading && (
          <div class="wd-pro-sider-loading">
            <a-spin spinning={menuLoading} />
          </div>
        )}
        {headerDom || null}
        <div class="wd-pro-sider-menu" style="flex: 1 1 0%; overflow: hidden auto">
          {(menuContentRender && menuContentRender(props, defaultMenuDom)) || defaultMenuDom}
        </div>
        <div class="wd-pro-sider-links">
          {collapsedButtonRender !== false ? (
            <>
              {collapsedButtonRender && typeof collapsedButtonRender === 'function'
                ? collapsedButtonRender(collapsed)
                : collapsedButtonRender}
            </>
          ) : null}
        </div>
      </a-layout-sider>
    </>
  )
}

export default SiderMenu
