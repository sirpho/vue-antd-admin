<template>
  <a-typography style="margin-top: 15px">
    <a-typography-title :level="2" :style="{color: '#454d64'}">ProSkeleton</a-typography-title>
    <a-typography-paragraph style="color: #454d64">
      页面级别的骨架屏
    </a-typography-paragraph>
  </a-typography>
  <a-typography>
    <a-typography-title :level="3" :style="{color: '#454d64'}">List</a-typography-title>
  </a-typography>
  <div style="padding: 40px 20px;background-color: #ffffff;border: 1px solid #ebedf1;border-radius: 1px;">
    <div style="padding: 24px;background: #ffffff;">
      <div style="padding: 24px;background: rgb(250, 250, 250);">
        <w-pro-skeleton type="list" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>
