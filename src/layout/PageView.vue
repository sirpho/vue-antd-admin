<template>
  <router-view>
    <template #default="{ Component }">
      <keep-alive v-if="keepAlive">
        <component :is="Component" />
      </keep-alive>
      <component v-else :is="Component" />
    </template>
  </router-view>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { getRandomNumber } from '/@/utils/util'

export default defineComponent({
  name: 'PageView',
  setup() {
    const route = useRoute()
    const store = useStore()
    const keepAlive = ref(false)
    const uuid = ref(getRandomNumber().uuid(15))
    const { meta } = route
    watch(
      () => route,
      () => {
        uuid.value = getRandomNumber().uuid(15)
        if (!store.getters['settings/showTabsBar'] && !meta.keepAlive) {
          keepAlive.value = false
        } else {
          keepAlive.value =
            store.getters['settings/keepAlive'] ||
            store.getters['settings/showTabsBar'] ||
            meta.keepAlive
        }
      },
      {
        deep: true,
        immediate: true
      }
    )
    return {
      keepAlive
    }
  }
})
</script>
