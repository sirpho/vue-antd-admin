<template>
  <a-typography style="margin-top: 16px" id="complexSplitCard">
    <a-typography-title :level="4" :style="{color: '#454d64'}">
      复杂切分
    </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0">
    通过卡片切分能力我们可以实现更加复杂的数据展现形式。
  </div>
  <div class="wd-markdown-demo">
    <ResizeObserver key="resize-observer" :onResize="({ width }) => { setResponsive(width < 596) }">
      <w-pro-card
        title="复杂切分"
        extra="2019年9月28日"
        bordered
        headerBordered
        :split="responsive ? 'horizontal' : 'vertical'"
      >
        <w-pro-card split="horizontal">
          <w-pro-card split="horizontal">
            <w-pro-card :split="responsive ? 'horizontal' : 'vertical'">
              <w-pro-card title="昨日全部流量">123</w-pro-card>
              <w-pro-card title="本月累计流量">234</w-pro-card>
              <w-pro-card title="今年累计流量">345</w-pro-card>
            </w-pro-card>
            <w-pro-card split="vertical">
              <w-pro-card title="运行中试验">12/56</w-pro-card>
              <w-pro-card title="历史试验总数">134 个</w-pro-card>
            </w-pro-card>
          </w-pro-card>
          <w-pro-card title="流量趋势">
            <div>图表</div>
            <div>图表</div>
            <div>图表</div>
            <div>图表</div>
            <div>图表</div>
          </w-pro-card>
        </w-pro-card>
        <w-pro-card title="流量占用情况">右侧内容</w-pro-card>
      </w-pro-card>
    </ResizeObserver>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { default as ResizeObserver } from 'ant-design-vue/es/vc-resize-observer'

export default defineComponent({
  components: {
    ResizeObserver
  },
  setup() {
    const responsive = ref(false)
    const setResponsive = (value: boolean) => {
      responsive.value = value
    }
    return {
      responsive,
      setResponsive
    }
  }
})
</script>

<style lang="less" module>

</style>
