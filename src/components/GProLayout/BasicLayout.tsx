import type { CSSProperties, ExtractPropTypes } from 'vue'
import {
  defineComponent,
  ref,
  reactive,
  computed,
  onBeforeUnmount,
  toRefs,
  onMounted,
  unref
} from 'vue'
import { omit } from 'lodash-es'
import { useMediaQuery } from '@gx-design/pro-hooks/event'
import { getPropsSlotfn, getPropsSlot } from '@gx-design/pro-utils'
import { basicLayoutProps } from './props'
import { provideRouteContext, defaultRouteContext, RouteContextProps } from './RouteContext'
import { WrapContent } from './WrapContent'
import GlobalHeader from './components/GlobalHeader'
import GlobalFooter from './components/GlobalFooter'
import SiderMenuWrapper from './components/SiderMenu'
import './style.less'

export type BasicLayoutProps = Partial<ExtractPropTypes<typeof basicLayoutProps>>;

export default defineComponent({
  name: 'ProLayout',
  inheritAttrs: false,
  components: {
    GlobalHeader,
    GlobalFooter,
    SiderMenuWrapper
  },
  props: basicLayoutProps,
  emits: [
    'update:collapsed',
    'update:open-keys',
    'update:selected-keys',
    'collapse',
    'openKeys',
    'reloadPage',
    'select',
    'menuHeaderClick',
    'menuClick'
  ],
  setup(props, { emit, slots }) {
    const width = ref(document.body.getBoundingClientRect().width)
    const colSize = useMediaQuery()
    onMounted(() => {
      window.addEventListener('resize', handleLayouts)
      handleLayouts()
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleLayouts)
    })
    const isMobile = computed(
      () => (colSize.value === 'sm' || colSize.value === 'xs')
    )
    const genLayoutStyle = reactive<CSSProperties>({
      position: 'relative',
      minHeight: '100vh'
    })
    const handleLayouts = () => {
      const clientWidth = document.body.getBoundingClientRect().width
      if (width.value !== clientWidth) {
        colSize.value = useMediaQuery().value
        width.value = clientWidth
      }
    }
    const headerRender = (
      p: BasicLayoutProps & {
        hasSiderMenu: boolean;
        headerRender: WithFalse<CustomRender>;
        rightContentRender: WithFalse<CustomRender>;
      },
      matchMenuKeys?: string[]
    ): CustomRender | null => {
      if (p.headerRender === false) {
        return null
      }
      return <GlobalHeader {...p} matchMenuKeys={matchMenuKeys || []} />
    }
    const onCollapse = (collapsed: boolean) => {
      emit('update:collapsed', collapsed)
      emit('collapse', collapsed)
    }
    const onOpenKeys = (openKeys: string[] | false) => {
      emit('update:open-keys', openKeys)
      emit('openKeys', openKeys)
    }
    const onSelect = (selectedKeys: string[] | false) => {
      emit('update:selected-keys', selectedKeys)
      emit('select', selectedKeys)
    }
    const onMenuHeaderClick = (e: MouseEvent) => {
      emit('menuHeaderClick', e)
    }
    const onMenuClick = (args: any) => {
      emit('menuClick', args)
    }

    const onReloadPage = () => {
      emit('reloadPage')
    }

    const routeContext = reactive<RouteContextProps>({
      ...defaultRouteContext,
      ...(omit(toRefs(props), [ 'onCollapse', 'onOpenKeys', 'onSelect', 'onMenuClick' ]) as any)
    })
    provideRouteContext(routeContext)

    return () => {
      const {
        ...restProps
      } = props

      const collapsedButtonRender =
        props.collapsedButtonRender === false
          ? false
          : getPropsSlot(slots, props, 'collapsedButtonRender')
      const headerContentRender = getPropsSlot(slots, props, 'headerContentRender')
      const extraRightDropdownRender = getPropsSlot(slots, props, 'extraRightDropdownRender')
      const rightContentRender = getPropsSlot(slots, props, 'rightContentRender')
      const customHeaderRender = getPropsSlot(slots, props, 'headerRender')
      const headerLogoRender = getPropsSlot(slots, props, 'headerLogoRender')
      // menu render
      const footerRender = getPropsSlotfn(slots, props, 'footerRender')
      const menuItemRender = getPropsSlotfn(slots, props, 'menuItemRender')
      const subMenuItemRender = getPropsSlotfn(slots, props, 'subMenuItemRender')
      const menuRenders = {
        menuItemRender,
        subMenuItemRender
      }

      const headerDom = computed(() =>
        headerRender(
          {
            ...props,
            ...menuRenders,
            hasSiderMenu: true,
            menuData: props.menuData,
            isMobile: unref(isMobile),
            onCollapse,
            onOpenKeys,
            onSelect,
            onMenuHeaderClick,
            rightContentRender,
            extraRightDropdownRender,
            headerLogoRender,
            headerContentRender,
            headerRender: customHeaderRender,
            theme: (props.theme || 'dark').toLocaleLowerCase().includes('dark')
              ? 'dark'
              : 'light'
          },
          props.matchMenuKeys
        )
      )

      return (
        <a-layout class="gx-pro-basic-layout">
          <SiderMenuWrapper
            {...restProps}
            {...menuRenders}
            isMobile={isMobile.value}
            headerLogoRender={headerLogoRender}
            collapsedButtonRender={collapsedButtonRender}
            onCollapse={onCollapse}
            onSelect={onSelect}
            onOpenKeys={onOpenKeys}
            onMenuClick={onMenuClick}
          />
          <a-layout style={genLayoutStyle}>
            {headerDom.value}
            <WrapContent
              isMobile={isMobile.value}
              isChildrenLayout={props.isChildrenLayout}
              loading={props.loading}
              isShowTabsBar={props.showTabsBar}
              isFixedMultiTab={props.fixedMultiTab}
              siderWidth={props.siderWidth}
              collapsed={props.collapsed}
              style={props.disableContentMargin ? undefined : props.contentStyle}
              onReloadPage={onReloadPage}
            >
              {slots.default?.()}
            </WrapContent>
            {footerRender ? footerRender(props) : <GlobalFooter />}
          </a-layout>
        </a-layout>
      )
    }
  }
})
