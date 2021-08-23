export default {
  position: [
    {
      title: '应用名称',
      width: 80,
      dataIndex: 'name',
      slots: { customRender: 'name' }
    },
    {
      title: '容器数量',
      dataIndex: 'containers',
      align: 'right',
      sorter: (a, b) => a.containers - b.containers
    },
    {
      title: '状态',
      width: 80,
      dataIndex: 'status'
    },
    {
      title: '创建者',
      width: 80,
      dataIndex: 'creator'
    },
    {
      width: 140,
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => a.createdAt - b.createdAt,
      slots: { title: 'createdAtTitle' }
    },
    {
      title: '备注',
      dataIndex: 'memo',
      ellipsis: true,
      copyable: true
    },
    {
      title: '操作',
      width: 180,
      key: 'action',
      slots: { customRender: 'action' }
    }
  ],
  parameter: [
    { title: '属性', dataIndex: 'attributes' },
    { title: '描述', dataIndex: 'description' },
    { title: '类型', dataIndex: 'typesof' },
    { title: '默认值', dataIndex: 'defaults' }
  ]
}
