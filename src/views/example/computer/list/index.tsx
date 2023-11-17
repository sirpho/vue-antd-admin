import { useTableHeight } from '@/hooks/web/useTableHeight'
import { useSeed, useStorePermission } from '@/store'
import { RequestData } from '@gx-design/ProTable/types/table'
import { resetDict, useDict } from '@/hooks/web'
import { queryList } from '@/services/example/language'
import { percentage, thousandsSeparator } from '@sirpho/utils'
import dayjs from 'dayjs'
import { activityColumns } from '@/views/example/computer/list/utils/config'

const { hasPermission } = useStorePermission()
export default defineComponent({
  setup() {
    const tableRef = ref()
    const businessSeed = useSeed()
    const resetRelatedDict = resetDict(['STATUS'])
    const [statusList] = useDict([
      'STATUS' // 状态列表
    ])
    const router = useRouter()

    const [tableHeight, updateTableHeight] = useTableHeight()
    const state = reactive({
      columns: [
        {
          title: '年月',
          search: true,
          showSearch: true,
          allowClear: false,
          valueType: 'dateMonth',
          dataIndex: 'updatedAt',
          width: 120,
          format: 'YYYY-MM',
          initialValue: dayjs().subtract(1, 'month').format('YYYY-MM')
        },
        {
          title: '人物名称',
          dataIndex: 'name',
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
          search: true,
          showSearch: true,
          width: 120,
          valueType: 'dateRange',
          rangeStartName: 'startDate',
          rangeEndName: 'endDate'
        },
        {
          title: '市场占有率',
          dataIndex: 'progress',
          width: 120,
          customRender: ({ record }) => {
            return percentage(record.progress, 100)
          }
        },
        {
          title: 'IP价值',
          dataIndex: 'money',
          width: 120,
          customRender: ({ record }) => {
            return thousandsSeparator(record.money)
          }
        },
        {
          title: '状态',
          dataIndex: 'status',
          search: true,
          showSearch: true,
          valueType: 'select',
          valueEnum: () => unref(statusList) || [],
          customRender: ({ record }) => {
            let status = 'default'
            if (record.status?.includes('驳回')) {
              status = 'error'
            } else if (record.status?.includes('待提交')) {
              status = 'default'
            } else if (record.status?.includes('审核中')) {
              status = 'processing'
            } else if (record.status?.includes('已生效')) {
              status = 'success'
            }

            return <a-badge status={status} text={record.status || '--'}></a-badge>
          },
          width: 120
        },
        {
          title: '操作',
          width: 220,
          dataIndex: 'action'
        }
      ],
      tableData: [],
      pickerVisible: false,
      authMap: {
        add: hasPermission('example:language'),
        update: hasPermission('example:language'),
        watch: hasPermission('example:language')
      }
    })

    /**
     * 编辑时通知同步刷新
     */
    watch(
      () => businessSeed.templateSeed,
      () => {
        handleOk()
      }
    )

    /**
     * 获取表格数据
     * @param params
     */
    const getTableList = async (params) => {
      const response = await queryList({
        ...params,
        limit: params.pageSize,
        page: params.pageNum
      })

      const result = response?.data || response?.page
      const list = result?.list || []
      state.tableData = list
      return {
        data: list,
        success: response && response.code === 0,
        total: result.totalCount,
        current: result.currPage
      } as RequestData
    }

    /**
     * 新增
     */
    const handleAdd = () => {
      state.pickerVisible = true
    }

    /**
     * 编辑
     * @param record
     */
    const handleEdit = (record: any) => {
      const { id: code } = record
      router.push({
        path: `/example/computer/add/${code}`
      })
    }

    /**
     * 查看
     * @param record
     */
    const handleWatch = (record: any) => {
      const { id: code } = record
      router.push({
        path: `/example/computer/add/${code}`
      })
    }

    /**
     * 选择完毕
     * @param record
     */
    const pickerFinish = (record) => {
      if (record) {
        const { id: code } = record
        router.push({
          path: `/example/computer/add/${code}`
        })
      }
    }

    /**
     * 刷新表格并重置相关的枚举
     */
    const handleOk = (removeKeys?: string[]) => {
      tableRef.value.reload({
        removeKeys
      })
      resetRelatedDict()
    }

    return () => {
      return (
        <g-pro-page-container>
          <g-pro-table
            row-key="id"
            scroll={{ x: '100%', y: unref(tableHeight) } as any}
            align="center"
            search={{
              onCollapse: updateTableHeight
            }}
            showIndex
            actionRef={(info) => (tableRef.value = info)}
            columns={state.columns}
            request={(params, _sort, _filter) => getTableList(params)}
            v-slots={{
              toolBarBtn: () => {
                return [
                  state.authMap.add && (
                    <a-button type="primary" key="add" size="small" onClick={() => handleAdd()}>
                      <plus-outlined />
                      新增
                    </a-button>
                  )
                ]
              },
              bodyCell: ({ column, record }) => {
                if (column.dataIndex === 'action') {
                  return [
                    state.authMap.update && (
                      <a-button type="link" onClick={() => handleEdit(record)}>
                        编辑
                      </a-button>
                    ),
                    state.authMap.watch && (
                      <a-button type="link" onClick={() => handleWatch(record)}>
                        查看
                      </a-button>
                    )
                  ]
                }
              }
            }}
          />
          <data-picker
            title="活动选择"
            columns={activityColumns}
            v-model:visible={state.pickerVisible}
            operation={queryList}
            onHandleOk={pickerFinish}
          />
        </g-pro-page-container>
      )
    }
  }
})
