<template>
  <a-typography style="margin-top: 16px" id="innerCard">
    <a-typography-title :level="4" :style="{color: '#454d64'}">
      内部卡片
    </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0">
    可以放在卡片内部，展示多层级结构的信息。
  </div>
  <div class="gx-markdown-demo">
    <w-pro-card title="横向内部卡片" bordered headerBordered :gutter="16">
      <w-pro-card title="内部卡片标题" type="inner" bordered>
        内部卡片内容
      </w-pro-card>
      <w-pro-card title="内部卡片标题" type="inner" bordered>
        内部卡片内容
      </w-pro-card>
    </w-pro-card>
    <w-pro-card
      style="margin-top: 8px"
      title="竖向内部卡片"
      bordered
      headerBordered
      direction="column"
      :gutter="[0, 16]"
    >
      <w-pro-card title="内部卡片标题" type="inner" bordered>
        内部卡片内容
      </w-pro-card>
      <w-pro-card title="内部卡片标题" type="inner" bordered>
        内部卡片内容
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
