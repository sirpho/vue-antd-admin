<template>
  <g-modal
    title="Title"
    class="test"
    :visible="visible"
    :isFail="isFail"
    :spinning="spinning"
    :skeletonLoading="skeletonLoading"
    destroyOnClose
    @cancel="handleCancel"
  >
    <template #content>
      <div style="height: 1100px">这是一个modal</div>
    </template>
    <template #footer>
      <div class="modal-footer">
        <a-button
          v-if="lookUp"
          type="primary"
          key="back"
          @click="
            () => {
              this.lookUp = false
            }
          "
        >
          编辑
        </a-button>
        <a-button
          v-else
          :loading="spinning"
          key="submit"
          type="primary"
          @click="handleCancel"
        >
          确定
        </a-button>
        <a-button key="cancel" :loading="spinning" @click="handleCancel">
          {{ lookUp ? '关闭' : '取消' }}
        </a-button>
      </div>
    </template>
  </g-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
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
