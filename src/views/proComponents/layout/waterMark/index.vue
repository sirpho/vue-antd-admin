<template>
  <w-page-wrapper :contentStyle="{ position: 'relative' }">
    <w-anchor :links="links" />
    <div style="padding-right: 208px">
      <a-typography>
        <a-typography-title :level="2" :style="{color: '#454d64'}">
          WaterMark 水印组件
          <a style="font-size: 14px" href="https://procomponents.ant.design/components/water-mark">
            （参照react-pro-components：water-mark）
          </a>
        </a-typography-title>
      </a-typography>
      <CustomizeSetApi />
      <PositionApi />
      <ContentApi />
      <ImageApi />
    </div>
    <w-back-top />
  </w-page-wrapper>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import PositionApi from './components/PositionApi.vue'
import ContentApi from './components/ContentApi.vue'
import ImageApi from './components/ImageApi.vue'
import CustomizeSetApi from './components/CustomizeSetApi.vue'

export default defineComponent({
  components: {
    PositionApi,
    ContentApi,
    ImageApi,
    CustomizeSetApi
  },
  setup() {
    const state = {
      links: [
        {
          link: '#watermark-customize-api',
          name: '自定义配置'
        },
        {
          link: '#watermark-position-api',
          name: '前置水印'
        }
      ]
    }

    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="less" module>

</style>
