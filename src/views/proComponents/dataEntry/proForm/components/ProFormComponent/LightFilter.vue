<template>
  <g-pro-form-light
    :model="formState"
    :formRef="(e) => (formRef = e)"
    :rules="rules"
    :request="
      async () => {
        return {
          code: 0,
          data: {
            age: '18'
          }
        }
      }
    "
  >
    <g-pro-form-group>
      <g-pro-form-text width="md" name="name" label="签约客户名称" placeholder="请输入名称" />
      <g-pro-form-text name="company" label="我方公司名称" placeholder="请输入名称" />
      <g-pro-form-text name="age" label="我方公司年龄" placeholder="请输入名称" />
      <g-pro-form-select
        width="md"
        name="useMode"
        placeholder="请输入名称"
        label="合同约定生效方式"
        :options="[{ label: 'chapter', value: '盖章后生效' }]"
      />
    </g-pro-form-group>
  </g-pro-form-light>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref()

const formState = reactive({
  name: '',
  company: '',
  age: '',
  useMode: undefined
})

const rules = reactive({
  name: [{ required: true, message: '请输入签约客户名称' }]
})
</script>
