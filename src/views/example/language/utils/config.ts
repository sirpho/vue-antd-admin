export const statusColumns = [
  {
    title: '编码',
    dataIndex: 'callNo',
    align: 'center',
    width: 120
  },
  {
    title: '描述',
    dataIndex: 'desc',
    align: 'center',
    width: 120,
  },
  {
    title: '人物名称',
    dataIndex: 'name',
    align: 'center',
    width: 120
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    align: 'center',
    width: 140,
  },
]

export const rules = {
  name: [
    {
      required: true,
      message: '请选择人员'
    }
  ],
  area: [
    {
      required: true,
      message: '请填写籍贯'
    }
  ],
  location: [
    {
      required: true,
      message: '请填写现居住地'
    }
  ],
  updatedAt: [
    {
      required: true,
      message: '请选择年月'
    }
  ],
  personType: [
    {
      required: true,
      message: '请选择人物类型'
    }
  ],
  englishName: [
    {
      required: true,
      message: '请填写英文名'
    }
  ],
  desc: [
    {
      required: true,
      message: '请填写描述'
    }
  ],
  progress: [
    {
      required: true,
      message: '请填写市场占有率'
    }
  ],
  money: [
    {
      required: true,
      message: '请填写IP价值'
    }
  ],
}

export const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

export const personColumns: any = [
  {
    title: '年月',
    search: true,
    dataIndex: 'updatedAt',
    width: 120,
  },
  {
    title: '人物名称',
    dataIndex: 'name',
    search: true,
    width: 120
  },
  {
    title: '英文名',
    dataIndex: 'englishName',
    search: true,
    width: 120
  },
  {
    title: '描述',
    dataIndex: 'desc',
    width: 120
  },
  {
    title: '编码',
    dataIndex: 'callNo',
    width: 120
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
  },
]

export const approvalRules: any = {
  isPass: [
    {
      required: true,
      message: '请选择审批状态'
    }
  ],
  reason: [
    {
      required: true,
      message: '请填写审批意见'
    }
  ]
}
