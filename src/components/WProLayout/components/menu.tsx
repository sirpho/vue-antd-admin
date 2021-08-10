import { computed, reactive, watch, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import Menu from 'ant-design-vue/es/menu'
import { createFromIconfontCN } from '@ant-design/icons-vue'

interface menuState {
  openKeys: any[];
  selectedKeys: any[] | undefined;
  cachedOpenKeys: any[];
}

export default defineComponent({
  name: 'SMenu',
  props: {
    iconfontUrl: {
      type: String,
      required: false,
      default: ''
    },
    type: {
      type: String,
      required: false,
      default: 'header'
    },
    menu: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    active: {
      type: Array,
      required: false
    }
  },
  setup(props, { emit }) {
    const route = useRoute()
    const state: menuState = reactive({
      openKeys: [],
      selectedKeys: props.active,
      cachedOpenKeys: []
    })
    const rootSubmenuKeys = computed(() => {
      const keys: any[] = []
      props.menu.forEach((item: any) => keys.push(item.path))
      return keys
    })
    const dynamicProps = computed(() => {
      return {
        mode: props.mode,
        theme: props.theme,
        openKeys: state.openKeys,
        selectedKeys: state.selectedKeys
      }
    })
    const updateMenu = () => {
      const routes = route.matched.concat()
      state.selectedKeys = routes
        .filter((_, index) => index !== 0)
        .map((item) => item.path)
      const openKeys: any[] = []
      if (props.mode === 'inline') {
        routes.forEach((item) => {
          openKeys.push(item.path)
        })
      }
      props.collapsed
        ? (state.cachedOpenKeys = openKeys)
        : (state.openKeys = openKeys)
    }
    watch(
      () => route.fullPath,
      () => {
        updateMenu()
      },
      {
        deep: true,
        immediate: true
      }
    )
    const onOpenChange = (openKeys) => {
      // 在水平模式下时执行，并且不再执行后续
      if (props.mode === 'horizontal') {
        state.openKeys = openKeys
        return
      }
      // 非水平模式时
      const latestOpenKey = openKeys.find(
        (key) => !state.openKeys.includes(key)
      )
      if (!rootSubmenuKeys.value.includes(latestOpenKey)) {
        state.openKeys = openKeys
      } else {
        state.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    }
    const onSelect = ({ item, key, selectedKeys }) => {
      state.selectedKeys = selectedKeys
      emit('menuItemClick', { item, key, selectedKeys })
    }
    const renderItem = (menu) => {
      if (!menu.hidden && !(menu.meta ? menu.meta.sideMenuHidden : false)) {
        return menu.children && !menu.hideChildrenInMenu
          ? renderSubMenu(menu)
          : renderMenuItem(menu)
      }
      return null
    }
    const renderMenuItem = (menu) => {
      const target = menu.meta.target || null
      if (menu.children && menu.hideChildrenInMenu) {
        // 把有子菜单的 并且 父菜单是要隐藏子菜单的
        // 都给子菜单增加一个 hidden 属性
        // 用来给刷新页面时， selectedKeys 做控制用
        menu.children.forEach((item) => {
          item.meta = Object.assign(item.meta, { hidden: true })
        })
      }
      return (
        <Menu.Item {...{ key: menu.path }}>
          {target ? (
            <a
              href={menu.linkPath || menu.path || ''}
              target={menu.meta.target}
            >
              {renderIcon(menu.meta.icon, menu.meta.iconType)}
              <span>{menu.meta.title}</span>
            </a>
          ) : (
            <router-link to={menu.linkPath || menu.path || ''}>
              {renderIcon(menu.meta.icon, menu.meta.iconType)}
              <span>{menu.meta.title}</span>
            </router-link>
          )}
        </Menu.Item>
      )
    }
    const renderSubMenu = (menu) => {
      const itemArr: any[] = []
      if (!menu.hideChildrenInMenu) {
        menu.children.forEach((item) => itemArr.push(renderItem(item)))
      }
      return (
        <Menu.SubMenu
          title={
            <span>
              {renderIcon(menu.meta.icon, menu.meta.iconType)}
              <span>{menu.meta.title}</span>
            </span>
          }
          {...{ key: menu.path }}
        >
          {itemArr}
        </Menu.SubMenu>
      )
    }
    const renderIcon = (icon, iconType) => {
      let IconFont: any = 'span'
      if (props.iconfontUrl) {
        IconFont = createFromIconfontCN({
          scriptUrl: props.iconfontUrl
        })
      }
      if (icon === 'none' || icon === undefined) {
        return null
      }
      return iconType === 'custom' ?
        props.iconfontUrl ?
          <IconFont type={icon} />
          :
          <i class={`iconfont ${icon} customicon`}></i>
        :
          <w-icon icon={icon} />
    }
    const menuTree = computed(() => {
      return (props.menu || []).map((item: any) => {
        if (item.hidden && (item.meta ? item.meta.sideMenuHidden : false)) {
          return null
        }
        return renderItem(item)
      })
    })
    return () => (
      // @ts-ignore
      <Menu
        {...dynamicProps.value}
        onOpenChange={onOpenChange}
        onSelect={onSelect}
      >
        {menuTree.value}
      </Menu>
    )
  }
})
