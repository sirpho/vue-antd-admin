<template>
  <div id="wd-pro-admin">
    <w-bars>
      <a-config-provider :locale="locale">
        <router-view />
      </a-config-provider>
    </w-bars>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

export default defineComponent({
  setup() {
    const locale = ref(zhCN)
    return {
      locale,
    }
  }
})
</script>
