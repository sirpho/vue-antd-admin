<template>
  <a-typography style="margin-top: 15px" id="g-pro-form-money">
    <a-typography-title :level="3" :style="{ color: '#454d64' }">金额</a-typography-title>
  </a-typography>
  <div class="gx-markdown-demo">
    <g-pro-card>
      <g-pro-form
        :model="formState"
        :formRef="(e) => (formRef = e)"
        :rules="rules"
        @finish="handleFinish"
      >
        <g-pro-form-money
          width="lg"
          label="不显示符号"
          name="amount0"
          :min="0"
          :fieldProps="{ moneySymbol: false }"
        />
        <g-pro-form-money label="限制金额最小为0" name="amount1" :min="0" />
        <g-pro-form-money label="不限制金额大小" name="amount2" />
        <g-pro-form-money label="自定义货币符号" name="amount3" customSymbol="💰" />
      </g-pro-form>
    </g-pro-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'

const formRef = ref()

const formState = reactive({
  amount0: '22.22',
  amount1: '22.22',
  amount2: '22.22',
  amount3: '22.22'
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

const handleFinish = async (values) => {
  await waitTime(2000)
  console.log(values)
  const val1 = await formRef.value?.validateFields()
  console.log('validateFields:', val1)
  const val2 = await formRef.value?.validateFieldsReturnFormatValue?.()
  console.log('validateFieldsReturnFormatValue:', val2)
  message.success('提交成功')
}
</script>

<style lang="less"></style>
