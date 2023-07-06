<template>
  <router-view>
    <template #default="{ Component }">
      <a-radio-group
        class="sub-tab-group"
        v-if="showSubTab"
        v-model:value="activePath"
        @change="changePath"
      >
        <a-radio-button :key="item.path" v-for="item in subTabList" :value="item.path">
          {{ item.meta?.title || item.name }}
        </a-radio-button>
      </a-radio-group>
      <keep-alive v-if="keepAlive">
        <component :key="key" :is="Component" />
      </keep-alive>
      <component v-else :key="key" :is="Component" />
    </template>
  </router-view>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@gx-vuex'

const route = useRoute()
const router = useRouter()
const allRouter = router.getRoutes()
const store = useStore()

const keepAlive = ref(false)
const key = ref('')
const { meta } = route

const showSubTab = ref(false)

const subTabList = ref([])

// 获取页面中显示次一级的tag标签来切换页面
const getTagList = () => {
  try {
    const subTabVisible = !!meta.subTab
    if (subTabVisible) {
      const splits = route.path.split('/')
      const parentPath = splits.splice(0, splits.length - 1).join('/')
      const parentRoute = allRouter.find((item) => item.path === parentPath)
      subTabList.value = parentRoute?.children || []
      showSubTab.value = subTabList.value.length > 0
    } else {
      subTabList.value = []
      showSubTab.value = false
    }
  } catch (e) {
    console.warn('生成次级tab失败', e)
    subTabList.value = []
    showSubTab.value = false
  }
}

const activePath = ref(null)

const changePath = () => {
  router.push({ path: activePath.value })
}

watch(
  () => route,
  () => {
    activePath.value = route.path
    if (!store.settings.showTabsBar && !meta.keepAlive) {
      keepAlive.value = false
    } else {
      keepAlive.value =
        (store.settings.keepAlive && store.settings.showTabsBar) || !!(meta.keepAlive as boolean)
    }
    key.value = route.path
    getTagList()
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style lang="less" scoped>
.sub-tab-group {
  margin-top: var(--common-space-half);
  height: var(--sub-tab-group-height);
}
.gx-pro-page-container {
  height: calc(100% - var(--sub-tab-group-height));
}
</style>
