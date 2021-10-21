import {
  defineComponent,
  VNodeChild,
  VNode,
  computed,
  isVNode,
  resolveComponent,
  ExtractPropTypes,
  ConcreteComponent
} from 'vue'
import Menu from 'ant-design-vue/es/menu'
import { createFromIconfontCN } from '@ant-design/icons-vue'
import { MenuDataItem, WithFalse } from '@wd-pro/pro-layout'
import { baseMenuProps } from './props'
import { defaultSettings } from '../../defaultSettings'
import { isImg, isUrl } from '../../utils'

export interface CustomMenuRender {
  menuItemRender?: WithFalse<(args: { item: MenuDataItem; title?: JSX.Element; icon?: JSX.Element }) => CustomRender>;
  subMenuItemRender?: WithFalse<(args: { item: MenuDataItem; children?: CustomRender[] }) => CustomRender>;
}

export type BaseMenuProps = ExtractPropTypes<typeof baseMenuProps>;

const IconFont: any = (iconfontUrl) => {
  return createFromIconfontCN({
    scriptUrl: iconfontUrl || defaultSettings.iconfontUrl
  })
}

const LazyIcon = (props: {
  icon: VNodeChild | string;
  iconType: string;
  iconfontUrl?: string;
}) => {
  const { icon, iconType, iconfontUrl } = props
  if (!icon) {
    return null
  }
  if (typeof icon === 'string' && icon !== '') {
    if (isUrl(icon) || isImg(icon)) {
      return <img src={icon} alt="icon" class={`wd-pro-sider-menu-icon`} />
    }
    if (iconType === 'custom') {
      return iconfontUrl ?
        <IconFont type={icon} />
        :
        <i class={`iconfont ${icon} customicon`}></i>
    }
  }
  if (isVNode(icon)) {
    return icon
  }
  const DynamicIcon = resolveComponent(icon as string) as any
  return (typeof LazyIcon === 'function' && <DynamicIcon />) || null
}

LazyIcon.props = {
  icon: {
    type: [ String, Function, Object ] as PropType<string | Function | VNode | JSX.Element>
  },
  iconType: String,
  iconfontUrl: String
}

export default defineComponent({
  name: 'BaseMenu',
  props: baseMenuProps,
  emits: [ 'update:openKeys', 'update:selectedKeys', 'click' ],
  setup(props, { emit }) {
    const handleOpenChange = (openKeys: string[]): void => {
      emit('update:openKeys', openKeys)
    }
    const handleSelect = (params: {
      key: string | number;
      keyPath: string[] | number[];
      item: VNodeChild | any;
      domEvent: MouseEvent;
      selectedKeys: string[];
    }): void => {
      emit('update:selectedKeys', params.selectedKeys)
    }
    const handleClick = (args: {
      item: VNodeChild;
      key: string | number;
      keyPath: string | string[] | number | number[];
    }) => {
      emit('click', args)
    }
    const RouterLink = resolveComponent('router-link') as ConcreteComponent
    const getNavMenuItems = (menusData: MenuDataItem[] = []) => {
      return menusData.map(item => getSubMenuOrItem(item)).filter(item => item)
    }
    const getSubMenuOrItem = (item: MenuDataItem): VNode => {
      if (
        Array.isArray(item.children) &&
        item.children.length > 0 &&
        !item?.meta?.hideInMenu &&
        !item?.meta?.hideChildrenInMenu
      ) {
        if (props.subMenuItemRender) {
          return props.subMenuItemRender({
            item,
            children: getNavMenuItems(item.children)
          }) as VNode
        }
        const menuTitle = item.meta?.title
        const defaultTitle = item.meta?.icon ? (
          <span class={`wd-pro-sider-menu-item`}>
            <span class={`wd-pro-sider-menu-item-title`}>{menuTitle}</span>
          </span>
        ) : (
          <span class={`wd-pro-sider-menu-item`}>{menuTitle}</span>
        )

        const hasGroup = item.meta?.type === 'group'

        const MenuComponent = hasGroup ? Menu.ItemGroup : Menu.SubMenu

        return (
          <MenuComponent
            title={defaultTitle}
            key={item.path}
            icon={
              hasGroup ?
                null :
                <LazyIcon
                  icon={item.meta?.icon}
                  iconfontUrl={props.iconfontUrl}
                  iconType={item.meta?.iconType}
                />}
          >
            {getNavMenuItems(item.children)}
          </MenuComponent>
        )
      }

      const [ title, icon ] = getMenuItem(item)

      return (
        ((props.menuItemRender &&
          props.menuItemRender({ item, title, icon })) as VNode) || (
          <Menu.Item
            disabled={item.meta?.disabled}
            danger={item.meta?.danger}
            key={item.path}
            icon={icon}
          >
            {title}
          </Menu.Item>
        )
      )
    }
    const getMenuItem = (item: MenuDataItem) => {
      const meta = { ...item.meta }
      const target = (meta.target || null) as string | null
      const hasUrl = isUrl(item.linkPath || item.path)
      const CustomTag: any = (target && 'a') || RouterLink
      const parames = { to: item.linkPath || item.path || '' }
      const attrs = hasUrl || target
        ? { ...item.meta, href: item.linkPath || item.path, target }
        : {}

      const menuTitle = item.meta?.title
      const defaultTitle = item.meta?.icon ? (
        <CustomTag {...attrs} {...parames} class={`wd-pro-sider-menu-item`}>
          <span class={`wd-pro-sider-menu-item-title`}>{menuTitle}</span>
        </CustomTag>
      ) : (
        <CustomTag {...attrs} {...parames} class={`wd-pro-sider-menu-item`}>
          <span>{menuTitle}</span>
        </CustomTag>
      )

      const icon = (
        item.meta?.icon &&
        <LazyIcon
          icon={item.meta?.icon}
          iconfontUrl={props.iconfontUrl}
          iconType={item.meta?.iconType}
        />) || undefined

      return [ defaultTitle, icon ]
    }
    const getMenuItems = computed(() => {
      return getNavMenuItems(props.menuData)
    })
    return () => (
      <Menu
        key="Menu"
        inlineIndent={16}
        mode={props.mode}
        theme={props.theme as 'dark' | 'light'}
        openKeys={props.openKeys === false ? [] : props.openKeys}
        selectedKeys={props.selectedKeys || []}
        onOpenChange={handleOpenChange}
        onSelect={handleSelect}
        onClick={handleClick}
        {...props.menuProps}
      >
        {getMenuItems.value}
      </Menu>
    )
  }
})
