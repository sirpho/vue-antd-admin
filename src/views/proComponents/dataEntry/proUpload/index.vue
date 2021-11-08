<template>
  <w-page-wrapper>
    <w-upload
      :progress="false"
      :data-list="[ avatar, ...urlList ]"
      :request="uploadHttps"
    />
  </w-page-wrapper>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { dataURLtoBlob, getBase64, getBlobUrl } from '/@/utils/util'

const store = useStore()
const avatar = computed(() => store.getters['user/avatar'])

const urlList = ref([
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

<style lang="less" module>

</style>
