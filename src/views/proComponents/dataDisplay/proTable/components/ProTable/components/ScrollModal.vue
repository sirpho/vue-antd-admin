<template>
  <g-pro-modal
    title="Scroll"
    width="450px"
    :visible="visible"
    :fixHeight="false"
    @cancel="handleCancel"
  >
    <template #content>
      <a-form v-bind="formItemLayout">
        <a-form-item label="x" v-bind="validateInfos.x">
          <a-input
            style="width: 100%;"
            v-model:value="scrollRef.x"
            placeholder="请输入横向x"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="y" v-bind="validateInfos.y">
          <a-input
            style="width: 100%;"
            v-model:value="scrollRef.y"
            placeholder="请输入纵向y"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </template>
    <template #footer>
      <div class="modal-footer">
        <a-button key="submit" type="primary" @click="handleSubmit">
          确定
        </a-button>
        <a-button key="cancel" @click="handleCancel">关闭</a-button>
      </div>
    </template>
  </g-pro-modal>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { Form } from 'ant-design-vue'

const useForm = Form.useForm

const emits = defineEmits([ 'handleOk' ])

const visible = ref(false)

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}

const scrollRef = reactive({
  x: 1850,
  y: undefined
})

const { resetFields, validate, validateInfos } = useForm(scrollRef, {})

const resetModalState = () => {
  visible.value = false
  resetFields()
}

const opneVisible = () => {
  visible.value = true
}

const handleSubmit = () => {
  validate().then(() => {
    const params = cloneDeep(scrollRef)
    Object.keys(params).map(item => {
      if (params[item]) {
        params[item] =Number(params[item])
      } else {
        delete params[item]
      }
      return item
    })
    emits('handleOk', params)
    resetModalState()
  }).catch(_ => {})
}

const handleCancel = () => {
  resetModalState()
}

defineExpose({
  opneVisible
})

</script>

<style lang='less' module>

</style>
