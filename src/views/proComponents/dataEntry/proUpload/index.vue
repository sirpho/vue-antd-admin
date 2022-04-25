<template>
  <g-pro-page-wrapper>
    <g-upload
      :progress="false"
      :data-list="[avatar, ...urlList]"
      :request="uploadHttps"
      wordExtra="打包后在Mock模式下，不能启用快编功能！"
    />
  </g-pro-page-wrapper>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from '@gx-vuex'
import { dataURLtoBlob, getBase64, getBlobUrl } from '/@/utils/util'

const store = useStore()
const avatar = computed(() => store.user.avatar)

const urlList = ref([
  'http://test.migucloud.com/vi2/1eb490ba06cb4e1cbecf40c5ef744195/20220406/184839/material1649242115914.jpeg',
  'https://dbxz1-hw.ahtv.cn/ahtv-obs/20210923/256957c3-5bd8-7676-2772-c70f04ad71a2.mp4',
  'https://zbbf9-hw.ahtv.cn/ahtv-transcoding/20210701/2266acbc-b53d-5576-685c-806cbebda605_audio.mp3'
])

const uploadHttps = async (file) => {
  const base64: string | ArrayBuffer | null = await getBase64(file)
  return {
    code: 0,
    url: getBlobUrl(dataURLtoBlob(base64))
  }
}
</script>

<style lang="less" module></style>
