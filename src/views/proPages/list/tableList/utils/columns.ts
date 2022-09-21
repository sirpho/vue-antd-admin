export default {
  index: [
    {
      dataIndex: 'name',
      searchConfig: {
        label: '规则',
        name: 'name',
        valueType: 'text',
        placeholder: '请输入规则名称'
      },
    },
    {
      title: '描述',
      searchConfig: {
        label: '描述',
        name: 'desc',
        valueType: 'text',
        placeholder: '请输入描述'
      },
      dataIndex: 'desc'
    },
    {
      title: '服务调用次数',
      searchConfig: {
        label: '服务调用次数',
        name: 'callNo',
        valueType: 'text',
        placeholder: '请输入服务调用次数'
      },
      dataIndex: 'callNo',
      sorter: true,
    },
    {
      title: '状态',
      searchConfig: {
        label: '状态',
        name: 'status',
        valueType: 'select',
        valueEnum: [
          {
            text: '关闭',
            value: '0',
          },
          {
            text: '运行中',
            value: '1',
          },
          {
            text: '已上线',
            value: '2',
          },
          {
            text: '异常',
            value: '3',
          }
        ],
        placeholder: '请选择状态'
      },
      dataIndex: 'status',
    },
    {
      title: '上次调度时间',
      searchConfig: {
        label: '上次调度时间',
        name: 'updatedAt',
        valueType: 'date',
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: '请选择上次调度时间'
      },
      dataIndex: 'updatedAt',
      sorter: true
    },
    {
      title: '操作',
      width: 180,
      dataIndex: 'action',
    }
  ]
}
