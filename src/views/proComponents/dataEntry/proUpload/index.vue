<template>
  <g-pro-page-container>
    <g-upload
      :progress="false"
      :data-list="[avatar, ...urlList]"
      :request="uploadHttps"
      wordExtra="打包后在Mock模式下，不能启用快编功能！"
    />
  </g-pro-page-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from '@gx-vuex'
import { dataURLtoBlob, getBase64, getBlobUrl } from '@/utils/util'

const store = useStore()
const avatar = computed(() => store.user.avatar)

const urlList = ref([
  'https://images.unsplash.com/photo-1652451635491-72dfaab20637?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1365&q=80',
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
