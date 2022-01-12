<template>
  <div id="gx-pro-admin">
    <g-bars>
      <config-provider :locale="locale">
        <router-view />
      </config-provider>
    </g-bars>
    <g-page-loading :loading="loading && routhPath === '/'" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch, ref } from 'vue'
import { useStore } from '@gx-vuex'
import { useRoute } from 'vue-router'
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

export default defineComponent({
  components: { ConfigProvider },
  setup() {
    const store = useStore()
    const route = useRoute()
    const locale = ref(zhCN)
    const routhPath = ref(route.fullPath)
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
    return {
      locale,
      routhPath,
      loading: computed(() => store.routes.routerLoading)
    }
  }
})
</script>
