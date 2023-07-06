<template>
  <div id="gx-pro-admin">
    <config-provider :locale="locale">
      <router-view />
    </config-provider>
    <g-page-loading :loading="loading && routhPath === '/'" />
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@gx-vuex'
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import notifyUpdate from '@/utils/notifyUpdate'

const store = useStore()
const route = useRoute()

const locale = ref(zhCN)
const routhPath = ref(route.fullPath)

const loading = computed(() => store.routes.routerLoading)
// 监测服务器文件是否更新
notifyUpdate()
watch(
  () => route.fullPath,
  (value) => {
    routhPath.value = value
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
