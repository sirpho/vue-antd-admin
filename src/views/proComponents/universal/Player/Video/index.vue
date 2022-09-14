<template>
  <g-pro-page-container>
    <div class="w-720px h-405px">
      <g-player-video
        :autoplay="false"
        src="https://gx2358-1311881132.cos.ap-shanghai.myqcloud.com/video.mp4"
      />
    </div>
  </g-pro-page-container>
</template>

<script setup lang="ts">
import GPlayerVideo from '@gx-design/GPlayerVideo'
</script>

<style lang="less" module></style>
