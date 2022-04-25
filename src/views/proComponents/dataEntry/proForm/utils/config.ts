export const proFormCode = `<g-pro-form
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
`
