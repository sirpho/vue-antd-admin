import {
  computed,
  defineComponent,
  reactive,
  watch,
  onMounted,
  toRefs,
  ExtractPropTypes
} from 'vue'
import { useStore } from '@gx-vuex'
import { useRoute, useRouter } from 'vue-router'
import { Tabs, Menu, Dropdown } from 'ant-design-vue'
import { EllipsisOutlined, ReloadOutlined, CloseOutlined } from '@ant-design/icons-vue'
import config from '/config/config'
import multiTabProps from './props'

const TabPane = Tabs.TabPane

export type MultiTabProps = Partial<ExtractPropTypes<typeof multiTabProps>>

export default defineComponent({
  components: {
    EllipsisOutlined,
    ReloadOutlined,
    CloseOutlined
  },
  props: multiTabProps,
  setup(props) {
    const { loading, onReloadPage } = toRefs(props)
    const $route = useRoute()
    const router = useRouter()
    const store = useStore()
    const allRouter = router.getRoutes()
    const { routesWhiteList } = config.defaultSettings
    const state = reactive({
      affixTabs: [],
      reloadSpin: false,
      tabActive: '',
      tabContextActive: ''
    })
    const routes = computed(() => store.routes.routes)
    const visitedRoutes = computed(() => store.tabsRouter.visitedRoutes)
    /**
     * @description 初始化添加固定标签
     */
    const initAffixTabs = (routes) => {
      routes.forEach((route) => {
        if (route.meta && route.meta.tagFixed) addTabs(route)
        if (route.children) initAffixTabs(route.children)
      })
    }
    /**
     * @description 添加标签路由
     */
    const addTabs = (tag) => {
      if (!!tag.meta.subTab) {
        const splits = tag.path.split('/')
        const parentPath = splits.splice(0, splits.length - 1).join('/')
        const parentRoute = allRouter.find((item) => item.path === parentPath)
        if (parentRoute) {
          tag = parentRoute
        }
      }
      if (
        tag.name &&
        tag.meta &&
        tag.meta.tagHidden !== true &&
        !routesWhiteList.includes(tag.path)
      ) {
        let matched = [tag.name]
        if (tag.matched) matched = tag.matched.map((item) => item.name)
        store.tabsRouter.addVisitedRoute({
          tagFixed: tag.meta && tag.meta.tagFixed,
          path: tag.path,
          fullPath: tag.fullPath,
          query: tag.query,
          params: tag.params,
          name: tag.name,
          matched: matched,
          meta: { ...tag.meta }
        })
        if (isActive(tag)) state.tabActive = tag.path
      }
    }
    onMounted(() => {
      initAffixTabs(routes.value)
    })
    watch(
      () => $route,
      (route) => {
        setTimeout(() => {
          addTabs(route)
        }, 0)
      },
      {
        deep: true,
        immediate: true
      }
    )
    /**
     * @description 是否是当前页
     */
    const isActive = (route) => {
      if (route.path === $route.path) {
        return true
      }
      if (!!$route.meta?.subTab) {
        const splits = $route.path.split('/')
        const parentPath = splits.splice(0, splits.length - 1).join('/')
        const parentRoute = allRouter.find((item) => item.path === parentPath)
        if (parentRoute) {
          const childrenPath = (parentRoute.children || []).map((item) => item.path)
          childrenPath.push(parentPath)
          return childrenPath.includes(route.path)
        }
      }
      return false
    }
    /**
     * @description 当前页是否固定
     */
    const isFixed = (tag) => {
      return tag.meta && tag.meta.tagFixed
    }
    /**
     * @description 标签点击
     */
    const handleTabClick = (tab) => {
      const route = visitedRoutes.value.filter((item) => item.path === tab)[0]
      const query = route.query
      if ($route.path !== route.path) {
        router.push({
          path: route.path,
          query: query
        })
      }
    }
    /**
     * @description 标签删除
     */
    const handleTabRemove = async (e, path) => {
      e.stopPropagation()
      const view = visitedRoutes.value.find((item) => {
        return path === item.path
      })
      await store.tabsRouter.delVisitedRoute(view)
      if (isActive(view)) await toLastTag()
    }
    /**
     * @description 标签副操作点击
     */
    const handleClick = ({ key }, stateType) => {
      switch (key) {
        case 'closeOthersTabs':
          closeOthersTabs(stateType)
          break
        case 'closeLeftTabs':
          closeLeftTabs(stateType)
          break
        case 'closeRightTabs':
          closeRightTabs(stateType)
          break
        default:
          break
      }
    }
    const dropdownVisible = (path) => {
      state.tabContextActive = path
    }
    const tabBarExtraState = (type, path: any) => {
      const currentIndex = visitedRoutes.value.findIndex((item) => item.path === path)
      let status = false
      switch (type) {
        case 1:
          status =
            visitedRoutes.value.length === 1 ||
            (visitedRoutes.value.findIndex((item) => item.meta.tagFixed) === 0 &&
              visitedRoutes.value.length === 2)
          break
        case 2:
          status =
            currentIndex === 0 ||
            (currentIndex === 1 &&
              visitedRoutes.value.findIndex((item) => item.meta.tagFixed) === 0)
          break
        case 3:
          status =
            currentIndex === visitedRoutes.value.length - 1 || visitedRoutes.value.length === 1
          break
      }
      return status
    }
    /**
     * @description 刷新当前路由
     */
    const reloadPage = () => {
      state.reloadSpin = true
      onReloadPage.value && onReloadPage.value()
      setTimeout(() => {
        state.reloadSpin = false
      }, 500)
    }
    /**
     * @description 关闭其他页
     */
    const closeOthersTabs = async (stateType) => {
      await store.tabsRouter.delOthersVisitedRoutes(toThisTag(stateType))
      toContextTag(stateType)
    }
    /**
     * @description 关闭左侧所有路由
     */
    const closeLeftTabs = async (stateType) => {
      await store.tabsRouter.delLeftVisitedRoutes(toThisTag(stateType))
      toContextTag(stateType)
    }
    /**
     * @description 关闭右侧所有路由
     */
    const closeRightTabs = async (stateType) => {
      await store.tabsRouter.delRightVisitedRoutes(toThisTag(stateType))
      toContextTag(stateType)
    }
    /**
     * @description 跳转上下路由
     */
    const toContextTag = (stateType) => {
      const currentPath = stateType === 'tabActive' ? $route.path : state[stateType]
      if (stateType !== $route.path) {
        router.push(currentPath)
      }
    }
    /**
     * @description 跳转路由：/
     */
    const toLastTag = async () => {
      const latestView = visitedRoutes.value.slice(-1)[0]
      if (latestView) await router.push(latestView)
      else await router.push('/')
    }
    /**
     * @description 跳转点击页
     */
    const toThisTag = (stateType) => {
      let path = $route.path
      if ($route.meta.subTab) {
        const splits = $route.path.split('/')
        path = splits.splice(0, splits.length - 1).join('/')
      }
      const currentPath = stateType === 'tabActive' ? path : state[stateType]
      const view = visitedRoutes.value.find((item) => item.path === currentPath)
      if (currentPath !== view?.path || '') router.push(view)
      return view
    }

    const defaultRenderTabMenu = (record) => (
      <Menu onClick={(e) => handleClick(e, 'tabContextActive')}>
        <Menu.Item disabled={tabBarExtraState(1, record.path)} key="closeOthersTabs">
          关闭其他
        </Menu.Item>
        <Menu.Item disabled={tabBarExtraState(2, record.path)} key="closeLeftTabs">
          关闭左侧
        </Menu.Item>
        <Menu.Item disabled={tabBarExtraState(3, record.path)} key="closeRightTabs">
          关闭右侧
        </Menu.Item>
      </Menu>
    )

    const defaultRenderTab = (record) => (
      <Dropdown
        trigger="contextmenu"
        overlay={defaultRenderTabMenu(record)}
        onVisibleChange={(_) => dropdownVisible(record.path)}
      >
        <div class="gx-pro-multi-tab-content">
          {record.meta.title}
          {state.tabActive === record.path && (
            <ReloadOutlined
              class="gx-pro-multi-tab-reload-btn"
              style={{ marginRight: 0 }}
              spin={state.reloadSpin}
              onClick={() => {
                state.reloadSpin ? null : reloadPage()
              }}
            />
          )}
          {visitedRoutes.value.length > 1 && !isFixed(record) && (
            <CloseOutlined
              class="gx-pro-multi-tab-close-btn"
              style={{ marginRight: 0 }}
              onClick={(e) => handleTabRemove(e, record.path)}
            />
          )}
        </div>
      </Dropdown>
    )

    const defaultExtraMenu = () => (
      <Menu onClick={(e) => handleClick(e, 'tabActive')}>
        <Menu.Item disabled={tabBarExtraState(1, state.tabActive)} key="closeOthersTabs">
          关闭其他
        </Menu.Item>
        <Menu.Item disabled={tabBarExtraState(2, state.tabActive)} key="closeLeftTabs">
          关闭左侧
        </Menu.Item>
        <Menu.Item disabled={tabBarExtraState(3, state.tabActive)} key="closeRightTabs">
          关闭右侧
        </Menu.Item>
      </Menu>
    )

    const tabBarExtraContent = () => (
      <Dropdown overlay={defaultExtraMenu()}>
        <EllipsisOutlined class="gx-pro-multi-tab-dropdown-menu-btn" rotate={90} />
      </Dropdown>
    )

    return () => (
      <>
        <div
          style={{
            margin: 0,
            width: '100%',
            zIndex: 99
          }}
          class={{
            ['gx-pro-multi-tab']: true,
            ['gx-pro-multi-tab-wrap-loading']: loading.value
          }}
        >
          <Tabs
            onTabClick={handleTabClick}
            activeKey={state.tabActive}
            hideAdd
            type="editable-card"
            v-slots={{
              rightExtra: (_) => tabBarExtraContent()
            }}
          >
            {visitedRoutes.value.map((item) => (
              <TabPane key={item.path} closable={false} tab={defaultRenderTab(item)} />
            ))}
          </Tabs>
        </div>
      </>
    )
  }
})
