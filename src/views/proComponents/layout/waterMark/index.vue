<template>
  <w-page-wrapper>
    <a-typography>
      <a-typography-title :level="2" :style="{color: '#454d64'}">WaterMark 水印组件</a-typography-title>
    </a-typography>
    <a-typography>
      <a-typography-title :level="3" :style="{color: '#454d64'}">前置水印</a-typography-title>
    </a-typography>
    <a-typography>
      <a-typography style="color: #454d64;">水印组件默认实现为前置水印，即设想水印会显示在内容的上方，zIndex 默认设置为 9，如果你不希望水印遮挡上层内容，可以调整该值到小于上层内容的 zIndex。</a-typography>
    </a-typography>
    <PositionApi style="margin-top: 15px" />
  </w-page-wrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PositionApi from './components/PositionApi.vue'

export default defineComponent({
  components: {
    PositionApi
  },
  setup() {

  }
})
</script>

<style lang="less" module>

</style>
