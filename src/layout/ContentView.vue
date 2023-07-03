<template>
  <router-view v-slot="{ Component }">
    <component v-if="isRouterAlive" :is="Component" />
  </router-view>
  <Iframe v-if="iframeSrc" :frameSrc="iframeSrc" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Iframe from '../views/Iframe/index.vue'

const props = defineProps({
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
  }
})

const router = useRouter()

const iframeSrc = computed(() => {
  const meta = router.currentRoute.value?.meta
  return meta?.target && Number(meta?.targetStatus) === 0 ? meta?.target : ''
})
</script>
