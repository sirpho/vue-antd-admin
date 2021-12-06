export default {
  index: [
    {
      dataIndex: 'name',
      ellipsis: true,
      key: 'name',
      width: 150,
      searchConfig: {
        name: 'name',
        valueType: 'text',
        placeholder: '请输入'
      },
    },
    { title: 'Age', dataIndex: 'age', key: 'age', width: 100, resizable: false },
    {
      title: 'Column 1',
      dataIndex: 'address',
      key: '1',
      width: 150,
      searchConfig: {
        name: 'createTime',
        valueType: 'dateRange',
        placeholder: '请选择',
        showTime: false,
        format: 'YYYY-MM-DD',
      }
    },
    { title: 'Column 2', dataIndex: 'address', key: '2' },
    { title: 'Column 3', dataIndex: 'address', key: '3' },
    { title: 'Column 4', dataIndex: 'address', key: '4' },
    { title: 'Column 5', dataIndex: 'address', key: '5' },
    { title: 'Column 6', dataIndex: 'address', key: '6', width: 150 },
    {
      title: 'Action',
      ellipsis: true,
      width: 150,
      copyable: true,
      dataIndex: 'action',
      key: 'action',
    }
  ],
  proTable: [
    { title: '属性', dataIndex: 'attributes' },
    { title: '描述', dataIndex: 'description' },
    { title: '类型', dataIndex: 'typesof' },
    { title: '默认值', dataIndex: 'defaults' }
  ],
  searchConfig: [
    { title: '属性', dataIndex: 'attributes' },
    { title: '描述', dataIndex: 'description' },
    { title: '类型', dataIndex: 'typesof' },
    { title: '默认值', dataIndex: 'defaults' },
  ],
  searchDataConfig: [
    { title: '属性', dataIndex: 'attributes' },
    { title: '描述', dataIndex: 'description' },
    { title: '类型', dataIndex: 'typesof' },
    { title: '默认值', dataIndex: 'defaults' },
  ],
  columnsConfig: [
    { title: '属性', dataIndex: 'attributes' },
    { title: '描述', dataIndex: 'description' },
    { title: '类型', dataIndex: 'typesof' },
    { title: '默认值', dataIndex: 'defaults' },
  ]
}
