<template>
  <a-result
    status="404"
    title="404"
    style="background: none"
    subTitle="Sorry, the page you visited does not exist."
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
