<template>
  <a-typography style="margin-top: 16px" id="multiLineCard">
    <a-typography-title :level="4" :style="{color: '#454d64'}">
      多行卡片
    </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0;font-size: 15px;line-height: 24px">
    默认卡片布局不可换行，你可以配置
    <span class="wd-markdown-code">wrap</span>为
    <span class="wd-markdown-code">true</span>
    来让多个卡片之间可以换行，适用于多个卡片排版的情况。
  </div>
  <div class="wd-markdown-demo">
    <w-pro-card :gutter="[16, 16]" wrap title="换行">
      <w-pro-card :colSpan="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }" layout="center" bordered>
        Col
      </w-pro-card>
      <w-pro-card :colSpan="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }" layout="center" bordered>
        Col
      </w-pro-card>
      <w-pro-card :colSpan="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }" layout="center" bordered>
        Col
      </w-pro-card>
      <w-pro-card :colSpan="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }" layout="center" bordered>
        Col
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
