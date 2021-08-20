<template>
  <a-typography>
    <a-typography-title :level="3" :style="{color: '#454d64'}">文字水印</a-typography-title>
  </a-typography>
  <a-typography>
    <a-typography style="color: #454d64;">
      通过
      <span style="padding: 2px 5px;color: #d56161;background: #f6f7f9;">
        content
      </span>
      指定文字水印内容。
    </a-typography>
  </a-typography>
  <div style="position: relative;z-index: 99;margin-top: 15px;background-color: #fff;border: 1px solid #ebedf1;border-radius: 1px;">
    <div style="padding: 40px 24px;">
      <w-pro-watermark :content="content">
        <div style="height: 500px"></div>
      </w-pro-watermark>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const content = ref('gx12358')
</script>
