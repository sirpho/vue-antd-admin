<template>
  <a-result
    status="500"
    title="500"
    style="background: none"
    subTitle="Sorry, the server is reporting an error."
  >
    <template #extra>
      <router-link to="/">
        <a-button type="primary">返回首页</a-button>
      </router-link>
    </template>
  </a-result>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>

<style scoped>

</style>
