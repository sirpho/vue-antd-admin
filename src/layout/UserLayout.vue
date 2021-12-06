<template>
  <div id="gx-user-layout">
    <div class="container">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const title = ref('GX Pro Admin')
    return {
      title
    }
  }
})
</script>
