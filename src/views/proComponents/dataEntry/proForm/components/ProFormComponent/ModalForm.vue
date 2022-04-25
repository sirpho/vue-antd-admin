<template>
  <g-pro-form-modal
    title="ModalForm"
    :model="formState"
    :formRef="(e) => (formRef = e)"
    :rules="rules"
    :request="
      async () => {
        await waitTime(500)
        return {
          code: 0,
          data: {
            age: '18'
          }
        }
      }
    "
    :modalProps="{ adaptive: false }"
    @finish="handleFinish"
  >
    <template #trigger>
      <a-button type="primary">新建表单</a-button>
    </template>
    <g-pro-form-group>
      <g-pro-form-text width="md" name="name" label="签约客户名称" placeholder="请输入名称" />
      <g-pro-form-text name="company" label="我方公司名称" placeholder="请输入名称" />
      <g-pro-form-text name="age" label="我方公司年龄" placeholder="请输入名称" />
    </g-pro-form-group>
  </g-pro-form-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'

const formRef = ref()

const formState = reactive({
  name: '',
  company: '',
  age: ''
})

const rules = reactive({
  name: [{ required: true, message: '请输入签约客户名称' }]
})

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

const handleFinish = async (values: any) => {
  await waitTime(2000)
  message.success('提交成功')
  return true
}
</script>
