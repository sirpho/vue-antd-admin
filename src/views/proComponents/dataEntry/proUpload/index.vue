<template>
  <w-page-wrapper>
    <w-upload
      :progress="false"
      :data-list="[ avatar ]"
      :request="uploadHttps"
    />
  </w-page-wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { dataURLtoBlob, getBase64, getBlobUrl } from '/@/utils/util'

const avatar = ref('')

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
