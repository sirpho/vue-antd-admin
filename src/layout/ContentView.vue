<template>
  <RouterView>
    <template #default="{ Component }">
      <page-transition
        :disabled="animate.disabled"
        :animate="animate.name"
        :direction="animate.direction"
      >
        <component v-if="isRouterAlive" :is="Component" />
      </page-transition>
    </template>
  </RouterView>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PageTransition from '/@/components/PageTransition/index.vue'

export default defineComponent({
  components: {
    PageTransition
  },
  props: {
    isRouterAlive: {
      type: Boolean,
      required: false,
      default: true
    },
    contentStyle: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    },
    animate: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
  }
})
</script>
