export const rules = {
  title: [
    {
      required: true,
      message: '请输入任务名称'
    }
  ],
  createdAt: [
    {
      required: true,
      message: '请选择开始时间',
    },
  ],
  owner: [
    {
      required: true,
      message: '请选择任务负责人',
    },
  ],
  subDescription: [
    {
      required: true,
      message: '请输入至少五个字符的产品描述',
      min: 5
    },
  ]
}
