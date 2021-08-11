<template>
  <div class="wd-pro-multi-tab">
    <a-tabs
      @tab-click="handleTabClick"
      v-model:activeKey="tabActive"
      hide-add
      type="editable-card"
    >
      <a-tab-pane
        v-for="item in visitedRoutes"
        :key="item.fullPath"
        :closable="false"
      >
        <template #tab>
          <a-dropdown :trigger="['contextmenu']">
            <div class="wd-pro-multi-tab-content">
              {{ item.meta.title }}
              <ReloadOutlined
                v-if="tabActive === (item.fullPath || item.path)"
                class="wd-pro-multi-tab-reload-btn"
                style="margin-right: 0"
                :spin="reloadSpin"
                @click="() => { reloadSpin ? null : reloadPage() }"
              />
              <CloseOutlined
                v-if="visitedRoutes.length > 1 && !isFixed(item)"
                style="margin-right: 0"
                class="wd-pro-multi-tab-close-btn"
                @click="e => handleTabRemove(e, item.fullPath)"
              />
            </div>
            <template #overlay>
              <a-menu @click="e => handleClick(e, 'tabContextActive')">
                <a-menu-item
                  :disabled="tabBarExtraState(1, item.fullPath || item.path)"
                  key="closeOthersTabs"
                >
                  关闭其他
                </a-menu-item>
                <a-menu-item
                  :disabled="tabBarExtraState(2, item.fullPath || item.path)"
                  key="closeLeftTabs"
                >
                  关闭左侧
                </a-menu-item>
                <a-menu-item
                  :disabled="tabBarExtraState(3, item.fullPath || item.path)"
                  key="closeRightTabs"
                >
                  关闭右侧
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-tab-pane>
      <template #tabBarExtraContent>
        <a-dropdown>
          <template v-slot:overlay>
            <a-menu @click="e => handleClick(e, 'tabActive')">
              <a-menu-item
                :disabled="tabBarExtraState(1, tabActive)"
                key="closeOthersTabs"
              >
                关闭其他
              </a-menu-item>
              <a-menu-item
                :disabled="tabBarExtraState(2, tabActive)"
                key="closeLeftTabs"
              >
                关闭左侧
              </a-menu-item>
              <a-menu-item
                :disabled="tabBarExtraState(3, tabActive)"
                key="closeRightTabs"
              >
                关闭右侧
              </a-menu-item>
            </a-menu>
          </template>
          <EllipsisOutlined
            class="wd-pro-multi-tab-dropdown-menu-btn"
            :rotate="90"
          />
        </a-dropdown>
      </template>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, reactive, toRefs, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { EllipsisOutlined, ReloadOutlined, CloseOutlined } from '@ant-design/icons-vue'
import config from '/config/config'

export default defineComponent({
  components: {
    EllipsisOutlined,
    ReloadOutlined,
    CloseOutlined
  },
  setup() {
    const $route = useRoute()
    const router = useRouter()
    const store = useStore()
    const { routesWhiteList } = config.defaultSettings
    const state = reactive({
      affixTabs: [],
      reloadSpin: false,
      tabActive: null
    })
    const routes = computed(() => store.getters['routes/routes'])
    const visitedRoutes = computed(() => store.getters['tagsBar/visitedRoutes'])
    const reloadCurrentPage: any = inject('reload')
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 初始化添加固定标签
     */
    const initAffixTabs = (routes) => {
      routes.forEach((route) => {
        if (route.meta && route.meta.fixed) addTabs(route)
        if (route.children) initAffixTabs(route.children)
      })
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 添加标签路由
     */
    const addTabs = async (tag) => {
      if (
        tag.name &&
        tag.meta &&
        tag.meta.tagHidden !== true &&
        tag.meta.sideMenuHidden !== true &&
        !routesWhiteList.includes(tag.path)
      ) {
        let matched = [ tag.name ]
        if (tag.matched) matched = tag.matched.map((item) => item.name)
        await store.dispatch('tagsBar/addVisitedRoute', {
          fixed: tag.meta && tag.meta.fixed,
          path: tag.path,
          fullPath: tag.fullPath || tag.path,
          query: tag.query,
          params: tag.params,
          name: tag.name,
          matched: matched,
          meta: { ...tag.meta }
        })
        if (isActive(tag)) state.tabActive = tag.fullPath || tag.path
      }
    }
    onMounted(() => {
      initAffixTabs(routes.value)
    })
    watch(
      () => $route,
      (route) => {
        addTabs(route)
      },
      {
        deep: true,
        immediate: true
      }
    )
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 是否是当前页
     */
    const isActive = (route) => {
      return route.path === $route.path
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 当前页是否固定
     */
    const isFixed = (tag) => {
      return tag.meta && tag.meta.fixed
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 标签点击
     */
    const handleTabClick = (tab) => {
      const route = visitedRoutes.value.filter((item) => item.path === tab)[0]
      if ($route.fullPath !== route.fullPath) router.push(route)
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 标签删除
     */
    const handleTabRemove = async (e, fullPath) => {
      e.stopPropagation()
      const view = visitedRoutes.value.find((item) => {
        return fullPath === item.fullPath
      })
      await store.dispatch('tagsBar/delVisitedRoute', view)
      if (isActive(view)) toLastTag()
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
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
    const tabBarExtraState = (type, path) => {
      const currentIndex = visitedRoutes.value.findIndex(item => item.fullPath === path)
      let status = false
      switch (type) {
        case 1:
          status = visitedRoutes.value.length === 1 ||
            (visitedRoutes.value.findIndex(item => item.meta.fixed) === 0 && visitedRoutes.value.length === 2)
          break
        case 2:
          status = currentIndex === 0 ||
            (currentIndex === 1 && visitedRoutes.value.findIndex(item => item.meta.fixed) === 0)
          break
        case 3:
          status = currentIndex === visitedRoutes.value.length - 1 || visitedRoutes.value.length === 1
          break
      }
      return status
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 刷新当前路由
     */
    const reloadPage = () => {
      state.reloadSpin = true
      reloadCurrentPage()
      setTimeout(() => {
        state.reloadSpin = false
      }, 500)
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 关闭其他页
     */
    const closeOthersTabs = async (stateType) => {
      await store.dispatch('tagsBar/delOthersVisitedRoutes', toThisTag(stateType))
      toContextTag(stateType)
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 关闭左侧所有路由
     */
    const closeLeftTabs = async (stateType) => {
      await store.dispatch('tagsBar/delLeftVisitedRoutes', toThisTag(stateType))
      toContextTag(stateType)
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 关闭右侧所有路由
     */
    const closeRightTabs = async (stateType) => {
      await store.dispatch('tagsBar/delRightVisitedRoutes', toThisTag(stateType))
      toContextTag(stateType)
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 跳转上下路由
     */
    const toContextTag = (stateType) => {
      const currentPath = stateType === 'tabActive' ? $route.fullPath : state[stateType]
      if (stateType !== $route.fullPath) {
        router.push(currentPath)
      }
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 跳转路由：/
     */
    const toLastTag = () => {
      const latestView = visitedRoutes.value.slice(-1)[0]
      if (latestView) router.push(latestView)
      else router.push('/')
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 跳转点击页
     */
    const toThisTag = (stateType) => {
      const currentPath = stateType === 'tabActive' ? $route.fullPath : state[stateType]
      const view = visitedRoutes.value.find(
        (item) => item.fullPath === currentPath
      )
      if (currentPath !== view.path) router.push(view)
      return view
    }
  
    return {
      visitedRoutes,
      routes,
      isFixed,
      reloadPage,
      handleClick,
      handleTabClick,
      handleTabRemove,
      tabBarExtraState,
      ...toRefs(state),
    }
  }
})
</script>
<style lang="less">
.wd-pro-multi-tab{
  .ant-tabs{
    width: 100%;
    padding-top: 6px;
    margin: 0px;
    background: #ffffff;
  }
  
  .ant-tabs-bar{
    padding-left: 16px;
    margin: 0;
  }
  
  &-dropdown-menu-btn{
    padding: 12px;
    margin-right: 8px;
    font-size: 16px;
    cursor: pointer;
  }
  
  &-content{
    display: flex;
    align-items: center;
  }
  
  &-reload-btn{
    margin-right: 0;
    margin-left: 8px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    
    &:hover{
      color: #1890ff;
    }
  }
  
  &-close-btn{
    margin-left: 8px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
