<template>
  <a-typography style="margin-top: 16px" id="cardTab">
    <a-typography-title :level="4" :style="{color: '#454d64'}">
      卡片式页签
    </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0">
    配置
    <span class="wd-markdown-code">tab</span>的
    <span class="wd-markdown-code">type</span>为
    <span class="wd-markdown-code">card</span>
    来配置卡片式页签。
  </div>
  <div class="wd-markdown-demo">
    <w-pro-card
      :tabs="{
        type: 'card'
      }"
    >
      <w-pro-card-tab-pane key="tab1" tab="产品一">
        内容一
      </w-pro-card-tab-pane>
      <w-pro-card-tab-pane key="tab2" tab="产品二">
        内容二
      </w-pro-card-tab-pane>
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
