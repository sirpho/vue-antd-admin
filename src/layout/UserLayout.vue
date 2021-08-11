<template>
  <div id="wd-user-layout">
    <div class="container">
      <router-view  v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  setup() {
    const title = ref('Wd Pro Admin')
    return {
      title
    }
  }
})
</script>
