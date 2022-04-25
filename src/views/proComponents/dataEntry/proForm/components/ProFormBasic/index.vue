<template>
  <a-typography style="margin-top: 30px">
    <a-typography-title :level="2" :style="{ color: '#454d64' }">代码示例</a-typography-title>
  </a-typography>
  <a-typography id="g-pro-form-basic">
    <a-typography-title :level="3" :style="{ color: '#454d64' }">基本使用</a-typography-title>
  </a-typography>
  <div class="gx-markdown-demo">
    <g-pro-card>
      <g-pro-form
        :model="formState"
        :formRef="(e) => (formRef = e)"
        :rules="rules"
        :params="{ id: '100' }"
        :request="() => queryForm()"
        @finish="handleFinish"
      >
        <g-pro-form-group>
          <g-pro-form-text width="md" name="name" tooltip="最长为 24 位" placeholder="请输入名称">
            <template #label>
              <span>签约客户名称</span>
            </template>
            <template #addonBefore>
              <a>客户名称应该怎么获得？</a>
            </template>
            <template #addonAfter>
              <a>客户名称应该怎么获得？</a>
            </template>
          </g-pro-form-text>
          <g-pro-form-text
            width="md"
            name="company"
            label="我方公司名称"
            placeholder="请输入名称"
          />
        </g-pro-form-group>
        <g-pro-form-group>
          <g-pro-form-digit name="count" label="人数" width="lg" />
        </g-pro-form-group>
        <g-pro-form-group>
          <g-pro-form-text width="md" name="contract" label="合同名称" placeholder="请输入名称" />
          <g-pro-form-date-range width="wd" name="createTime" label="合同生效时间" />
        </g-pro-form-group>
        <g-pro-form-group>
          <g-pro-form-text width="md" name="phone" label="手机号" placeholder="请输入手机号" />
        </g-pro-form-group>
        <g-pro-form-group>
          <g-pro-form-select
            width="xs"
            name="useMode"
            label="合同约定生效方式"
            readonly
            :options="[
              {
                value: 'chapter',
                label: '盖章后生效'
              }
            ]"
          />
          <g-pro-form-select
            width="xs"
            name="unusedMode"
            label="合同约定失效方式"
            :options="[
              {
                value: 'time',
                label: '履行完终止'
              }
            ]"
          />
          <g-pro-form-money width="md" name="money" label="合同约定金额" />
        </g-pro-form-group>
        <g-pro-form-text width="sm" name="id" label="主合同编号" />
        <g-pro-form-text width="md" disabled name="project" label="项目名称" />
        <g-pro-form-text width="xs" disabled name="mangerName" label="商务经理" />
        <g-pro-form-cascader
          width="md"
          :request="
            async () => [
              {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [
                  {
                    value: 'hangzhou',
                    label: 'Hangzhou',
                    children: [
                      {
                        value: 'xihu',
                        label: 'West Lake'
                      }
                    ]
                  }
                ]
              },
              {
                value: 'jiangsu',
                label: 'Jiangsu',
                children: [
                  {
                    value: 'nanjing',
                    label: 'Nanjing',
                    children: [
                      {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men'
                      }
                    ]
                  }
                ]
              }
            ]
          "
          name="area"
          label="区域"
        />
        <g-pro-form-group>
          <g-pro-form-captcha
            :fieldProps="{
              size: 'large',
              prefix: mailTwoTone
            }"
            label="验证码"
            :captchaProps="{ size: 'large' }"
            phoneName="phone"
            name="captcha"
            placeholder="请输入验证码"
            @getCaptcha="handleGetCaptcha"
          />
        </g-pro-form-group>
      </g-pro-form>
    </g-pro-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, h } from 'vue'
import { message } from 'ant-design-vue'
import { MailTwoTone } from '@ant-design/icons-vue'
import { getForm } from '/@/services/proComponents/form'

const mailTwoTone = h(MailTwoTone)

const formRef = ref()

const formState = reactive({
  name: '蚂蚁设计有限公司',
  company: '蚂蚁设计集团',
  count: '',
  contract: '',
  createTime: [],
  useMode: undefined,
  unusedMode: undefined,
  phone: '1838',
  captcha: '',
  id: '',
  project: 'xxxx项目',
  mangerName: '启途',
  area: ['zhejiang', 'hangzhou', 'xihu']
})

const rules = reactive({
  name: [{ required: true, message: '这是必填项' }],
  useMode: [{ required: true, message: '请选择合同约定生效方式' }],
  phone: [{ required: true, message: '这是必填项' }],
  captcha: [{ required: true, message: '请输入验证码' }]
})

const queryForm = async () => {
  const response: any = await getForm()
  return {
    code: response?.code ? 0 : 1,
    data: response?.data || {}
  }
}

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

const handleGetCaptcha = async (phone) => {
  await waitTime(1000)
  message.success(`手机号 ${phone} 验证码发送成功!`)
}

const handleFinish = async (values: any) => {
  await waitTime(2000)
  console.log(values)
  const val1 = await formRef.value?.validateFields()
  console.log('validateFields:', val1)
  const val2 = await formRef.value?.validateFieldsReturnFormatValue?.()
  console.log('validateFieldsReturnFormatValue:', val2)
  message.success('提交成功')
}
</script>
