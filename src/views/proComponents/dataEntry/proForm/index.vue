<template>
  <g-pro-page-wrapper>
    <!--<a-form>-->
    <!--  <a-form-item label="Activity name" v-bind="validateInfos.name">-->
    <!--    <a-input v-model:value="formState.name" />-->
    <!--  </a-form-item>-->
    <!--</a-form>-->
    <g-pro-form
      :model="formState"
      :formRef="e => formRef = e"
      :rules="rules"
      :request="async () => {
        return {
          age: '18'
        }
      }"
    >
      <g-pro-form-group>
        <g-pro-form-text
          width="md"
          name="name"
          label="签约客户名称"
          placeholder="请输入名称"
        />
        <g-pro-form-text
          name="company"
          label="我方公司名称"
          placeholder="请输入名称"
        />
        <g-pro-form-text
          name="age"
          label="我方公司年龄"
          placeholder="请输入名称"
        />
      </g-pro-form-group>
    </g-pro-form>
  </g-pro-page-wrapper>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
// import { Form } from 'ant-design-vue'
// import { cloneDeep } from 'lodash-es'

// const useForm = Form.useForm

const formRef = ref()

const formState = reactive({
  name: '',
  company: '',
  age: ''
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
const handleChange = (e) => {
  console.log(e)
}
</script>

<style scoped>

</style>
