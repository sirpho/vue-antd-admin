export default {
  index: [
    {
      title: '权限名称',
      ellipsis: true,
      dataIndex: 'menuName'
    },
    {
      title: '路由唯一键',
      ellipsis: true,
      align: 'center',
      dataIndex: 'path'
    },
    {
      title: '组件',
      ellipsis: true,
      align: 'center',
      dataIndex: 'component'
    },
    {
      title: '排序',
      width: 90,
      align: 'center',
      dataIndex: 'orderNum'
    },
    {
      title: '菜单类型',
      width: 90,
      align: 'center',
      dataIndex: 'menuType',
      slots: { customRender: 'menuType' }
    },
    {
      title: '状态',
      width: 90,
      align: 'center',
      dataIndex: 'visible',
      slots: { customRender: 'visible' }
    }
  ]
}
