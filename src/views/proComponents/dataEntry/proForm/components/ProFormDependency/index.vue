<template>
  <a-typography style="margin-top: 15px" id="g-pro-form-dependency">
    <a-typography-title :level="3" :style="{ color: '#454d64' }">表单联动</a-typography-title>
  </a-typography>
  <div class="gx-markdown-demo">
    <g-pro-card>
      <g-pro-form
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
        @finish="handleFinish"
      >
        <g-pro-form-text width="md" name="name" label="签约客户名称" placeholder="请输入名称" />
        <g-pro-form-text width="md" name="company" label="我方公司名称" placeholder="请输入名称" />
        <g-pro-form-dependency :name="['name', 'company']">
          <template #default="{ name, company }">
            <g-pro-form-select
              width="md"
              name="useMode"
              placeholder="请输入名称"
              :label="`与《${name || ''}》 与 《${company || ''}》合同约定生效方式`"
              :options="[{ label: 'chapter', value: '盖章后生效', disabled: name === '1111' }]"
            />
          </template>
        </g-pro-form-dependency>
        <g-pro-form-text width="md" name="age" label="我方公司年龄" placeholder="请输入名称" />
      </g-pro-form>
    </g-pro-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'

const formRef = ref()

const formState = reactive({
  name: '蚂蚁设计有限公司',
  company: '蚂蚁设计集团',
  age: '',
  useMode: 'chapter'
})

const rules = reactive({
  name: [{ required: true, message: '请输入签约客户名称' }],
  useMode: [{ required: true, message: '请选择合同约定生效方式' }]
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
  console.log(values)
  message.success('提交成功')
}
</script>
