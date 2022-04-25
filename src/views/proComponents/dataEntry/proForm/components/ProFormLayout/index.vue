<template>
  <a-typography style="margin-top: 15px" id="g-pro-form-layout">
    <a-typography-title :level="3" :style="{ color: '#454d64' }"
      >标签与表单项布局</a-typography-title
    >
    <a-typography-paragraph>
      除了
      <a-typography-text type="danger" code style="font-size: 14px">LightFilter</a-typography-text>
      这样固定布局的表单样式，其他表单布局支持配置与 antd 一致的三种布局方式。
    </a-typography-paragraph>
  </a-typography>
  <div class="gx-markdown-demo">
    <g-pro-card>
      <g-pro-form
        style="margin-top: 15px"
        v-bind="formItemLayout"
        :model="formState"
        :formRef="(e) => (formRef = e)"
        :rules="rules"
        :layout="formLayoutType"
        @finish="handleFinish"
      >
        <g-pro-form-radio-group
          radioType="button"
          label="标签布局"
          :fieldProps="{
            value: formLayoutType,
            onChange: (val) => setFormLayoutType(val)
          }"
          :options="['horizontal', 'vertical', 'inline']"
        />
        <g-pro-form-text width="md" name="name" label="签约客户名称" placeholder="请输入名称" />
        <g-pro-form-text width="md" name="company" label="我方公司名称" placeholder="请输入名称" />
        <g-pro-form-text width="md" name="useMode" label="我方公司年龄" placeholder="请输入名称" />
      </g-pro-form>
    </g-pro-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useMemo } from '@gx-admin/hooks/core'
import { message } from 'ant-design-vue'

const LAYOUT_TYPE_HORIZONTAL = 'vertical'

const formRef = ref()
const formLayoutType = ref(LAYOUT_TYPE_HORIZONTAL)

const formState = reactive({
  name: '蚂蚁设计有限公司',
  company: '蚂蚁设计集团',
  useMode: ''
})

const rules = reactive({
  name: [{ required: true, message: '请输入签约客户名称' }]
})

const formItemLayout = useMemo(() => {
  return formLayoutType.value === LAYOUT_TYPE_HORIZONTAL
    ? {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      }
    : null
})

const setFormLayoutType = (val) => {
  formLayoutType.value = val
}

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

const handleFinish = async (values: any) => {
  await waitTime(2000)
  console.log(values)
  message.success('提交成功')
}
</script>
