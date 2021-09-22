import type { ProColumns } from '/@/components/WProTable/types/column'

export const progressColumns: ProColumns[] = [
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time'
  },
  {
    title: '当前进度',
    dataIndex: 'rate',
    key: 'rate'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    slots: { customRender: 'status' }
  },

  {
    title: '操作员ID',
    dataIndex: 'operator',
    key: 'operator'
  },
  {
    title: '耗时',
    dataIndex: 'cost',
    key: 'cost'
  }
]
