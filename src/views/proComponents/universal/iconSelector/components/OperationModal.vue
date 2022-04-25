<template>
  <g-pro-modal
    title="Title"
    class="test"
    :view="lookUp"
    :visible="visible"
    :isFail="isFail"
    :spinning="spinning"
    :skeletonLoading="skeletonLoading"
    @cancel="handleCancel"
    @changeView="
      () => {
        this.lookUp = false
      }
    "
  >
    <div style="height: 1100px">这是一个modal</div>
  </g-pro-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const lookUp = ref(false)
    const isFail = ref(false)
    const visible = ref(false)
    const spinning = ref(false)
    const skeletonLoading = ref(false)
    const resetFields = () => {
      isFail.value = false
      spinning.value = false
      visible.value = false
      skeletonLoading.value = false
    }
    const open = () => {
      visible.value = true
      skeletonLoading.value = true
      setTimeout(() => {
        skeletonLoading.value = false
        isFail.value = false
      }, 1000)
    }
    const handleCancel = () => {
      resetFields()
    }
    return {
      lookUp,
      visible,
      spinning,
      skeletonLoading,
      isFail,
      open,
      resetFields,
      handleCancel
    }
  }
})
</script>
