<template>
  <div id="gx-pro-admin">
    <g-bars>
      <a-config-provider :locale="locale">
        <router-view />
      </a-config-provider>
    </g-bars>
    <g-pro-page-loading :loading="loading && routhPath === '/'" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

export default defineComponent({
  setup() {
    const route = useRoute()
    const store = useStore()
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
      loading: computed(() => store.getters['routes/routerLoading'])
    }
  }
})
</script>
