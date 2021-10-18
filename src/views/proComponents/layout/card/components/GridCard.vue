<template>
  <a-typography style="margin-top: 16px" id="gridCard">
    <a-typography-title :level="4" :style="{color: '#454d64'}">
      栅格布局
    </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0;font-size: 15px;line-height: 24px">
    当嵌套子卡片时, 组件会自动切换为
    <span class="wd-markdown-code">flex</span>
    弹性盒布局，你可以将
    <span class="wd-markdown-code">direction</span>
    设置为
    <span class="wd-markdown-code">column</span>
    来指定 Flex 方向，你还可以通过配置
    <span class="wd-markdown-code">ghost</span>
    属性为
    <span class="wd-markdown-code">true</span>
    来去掉背景色和 padding 方便页内布局。
  </div>
  <div class="wd-markdown-demo">
    <w-pro-card direction="column" ghost :gutter="[0, 8]">
      <w-pro-card layout="center" bordered>
        colSpan - 24
      </w-pro-card>
      <w-pro-card :colSpan="12" layout="center" bordered>
        colSpan - 12
      </w-pro-card>
      <w-pro-card :colSpan="8" layout="center" bordered>
        colSpan - 8
      </w-pro-card>
      <w-pro-card :colSpan="0" layout="center" bordered>
        colSpan - 0
      </w-pro-card>
    </w-pro-card>
    <w-pro-card title="24栅格" :gutter="8" style="margin-top: 8px">
      <w-pro-card :colSpan="12" layout="center" bordered>
        colSpan - 12
      </w-pro-card>
      <w-pro-card :colSpan="6" layout="center" bordered>
        colSpan - 6
      </w-pro-card>
      <w-pro-card :colSpan="6" layout="center" bordered>
        colSpan - 6
      </w-pro-card>
    </w-pro-card>
    <w-pro-card ghost :gutter="8" style="margin-top: 8px">
      <w-pro-card colSpan="200px" layout="center" bordered>
        colSpan - 200px
      </w-pro-card>
      <w-pro-card layout="center" bordered>
        Auto
      </w-pro-card>
    </w-pro-card>
    <w-pro-card ghost :gutter="8" style="margin-top: 8px">
      <w-pro-card layout="center" bordered>
        Auto
      </w-pro-card>
      <w-pro-card colSpan="30%" bordered>
        colSpan - 30%
      </w-pro-card>
    </w-pro-card>
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

<style lang="less" module>

</style>
