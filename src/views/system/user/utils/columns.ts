export default {
  index: [
    {
      dataIndex: 'id',
      title: 'id'
    },
    {
      dataIndex: 'uid',
      title: '账号',
      search: true,
      placeholder: '请输入账号'
    },
    {
      dataIndex: 'uname',
      title: '用户名',
      search: true,
      placeholder: '请输入用户名'
    },
    {
      title: '角色',
      dataIndex: 'roleName'
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime'
    },
    {
      title: '登录IP',
      dataIndex: 'loginIp'
    },
    {
      title: '状态',
      dataIndex: 'status'
    },
    {
      title: '操作',
      width: 180,
      dataIndex: 'action'
    }
  ]
}