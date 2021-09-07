export default {
  index: [
    {
      title: '成员姓名',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      slots: { customRender: 'name' }
    },
    {
      title: '工号',
      dataIndex: 'workId',
      key: 'workId',
      width: '20%',
      slots: { customRender: 'workId' }
    },
    {
      title: '所属部门',
      dataIndex: 'department',
      key: 'department',
      width: '40%',
      slots: { customRender: 'department' }
    },
    {
      title: '操作',
      key: 'action',
      slots: { customRender: 'action' }
    }
  ]
}
