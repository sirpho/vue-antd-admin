<template>
  <a-typography id="basicCard">
    <a-typography-title :level="4" :style="{color: '#454d64'}">
      基础卡片
    </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0">
    当单独使用时<span class="wd-markdown-code">ProCard</span>就是一个普通的卡片。
  </div>
  <div class="wd-markdown-demo">
    <w-pro-card title="默认尺寸" extra="extra" tooltipText="这是提示" style="max-width: 300px">
      <div>Card content</div>
      <div>Card content</div>
      <div>Card content</div>
    </w-pro-card>
    <w-pro-card
      extra="extra"
      tooltipText="这是提示"
      style="max-width: 300px;margin-top:  24px"
      size="small"
    >
      <template #title><span>小尺寸卡片</span></template>
      <div>Card content</div>
      <div>Card content</div>
      <div>Card content</div>
    </w-pro-card>
  </div>
</template>

<script lang="ts" setup>

</script>
