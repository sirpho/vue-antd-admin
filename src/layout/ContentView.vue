<template>
  <div class="wd-pro-main-content">
    <page-transition
      :disabled="animate.disabled"
      :animate="animate.name"
      :direction="animate.direction"
    >
      <router-view v-if="isRouterAlive">
        <template #default="{ Component }">
          <component :is="Component" />
        </template>
      </router-view>
    </page-transition>
  </div>
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

<style lang="less">
.wd-pro-main-content {
  position: relative;
  min-height: calc(
    100vh - 65px - 20px - 20px - 20px -
    20px
  ) !important;
  padding: 20px;
  background: #fff;
  
  .error-container {
    height: calc(
      100vh - 65px - 20px - 20px - 20px -
      20px - 20px - 20px
    ) !important;
  }
}
</style>
