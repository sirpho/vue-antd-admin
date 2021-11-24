<template>
  <w-page-wrapper>
    <!--<a-form>-->
    <!--  <a-form-item label="Activity name" v-bind="validateInfos.name">-->
    <!--    <a-input v-model:value="formState.name" />-->
    <!--  </a-form-item>-->
    <!--</a-form>-->
    <w-pro-form
      :model="formState"
      :formRef="e => formRef = e"
      :rules="rules"
    >
      <w-pro-form-group>
        <w-pro-form-text
          name="name"
          label="签约客户名称"
          placeholder="请输入名称"
          v-model:value="formState.name"
        />
        <w-pro-form-text
          name="company"
          label="我方公司名称"
          placeholder="请输入名称"
          v-model:value="formState.company"
        />
      </w-pro-form-group>
    </w-pro-form>
  </w-page-wrapper>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
// import { Form } from 'ant-design-vue'
// import { cloneDeep } from 'lodash-es'

// const useForm = Form.useForm

const formRef = ref()

const formState = reactive({
  name: '11212',
  company: '',
  age: '',
})
const rules = reactive({
  name: [
    { required: true, message: '请输入签约客户名称' }
  ]
})
//
// const { validateInfos } = useForm(formState, rules)
// watch(() => validateInfos, (val) => {
//   console.log(cloneDeep(val))
// }, {
//   deep: true,
//   immediate: true
// })
</script>

<style scoped>

</style>
