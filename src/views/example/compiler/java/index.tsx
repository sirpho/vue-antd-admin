import { useTableHeight } from '@/hooks/web/useTableHeight'
import { useStorePermission } from '@/store'
import { RequestData } from '@gx-design/ProTable/types/table'
import { resetDict, useDict } from '@/hooks/web'
import { queryList, exportList, importEntity } from '@/services/example/language'
import { percentage, thousandsSeparator } from '@sirpho/utils'
import { statusColumns, statusStatusColumns } from './utils/config'
import dayjs from 'dayjs'

const { hasPermission } = useStorePermission()
export default defineComponent({
  setup() {
    const tableRef = ref()
    const resetRelatedDict = resetDict(['STATUS'])
    // const operation = ref()
    const [statusList, personTypeList, personList] = useDict([
      'STATUS', // 状态列表
      'PERSON_TYPE', // 状态列表
      'PERSON' // 人物列表
    ])

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
          title: '人物类型',
          dataIndex: 'personType',
          width: 120,
          search: true,
          showSearch: true,
          valueType: 'select',
          valueEnum: () => unref(personTypeList) || [],
          customRender: ({ record }) => {
            return record.personType || '--'
          }
        },
        {
          title: '英文名',
          dataIndex: 'englishName',
          search: true,
          showSearch: true,
          valueType: 'select',
          valueEnum: () => unref(personList) || [],
          customRender: ({ record }) => {
            return record.englishName || '--'
          },
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
            return record.status || '--'
          },
          width: 120
        }
      ],
      tableData: [],
      logParams: { id: null },
      logVisible: false,
      statusVisible: false,
      authMap: {
        export: hasPermission('example:compiler'),
        import: hasPermission('example:compiler')
      }
    })

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
     * 查看日志
     */
    const handleLog = (record: any) => {
      state.logParams.id = record?.id
      nextTick(() => {
        state.logVisible = true
      })
    }
    /**
     * 查看日志
     */
    const handleStatusLog = (record: any) => {
      state.logParams.id = record?.id
      nextTick(() => {
        state.statusVisible = true
      })
    }

    /**
     * 导出
     */
    const handleExport = async () => {
      const { formParams } = tableRef.value
      await exportList({
        ...formParams
      })
    }

    /**
     * 导入回调
     * @param res
     */
    const handleImport = (res) => {
      if (res.code === 0) {
        handleOk()
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
                  state.authMap.export && (
                    <a-button key="export" size="small" onClick={handleExport}>
                      <cloud-download-outlined />
                      导出
                    </a-button>
                  ),
                  state.authMap.import && (
                    <upload-button operation={importEntity} onHandleImport={handleImport} />
                  )
                ]
              },
              bodyCell: ({ column, record }) => {
                if (column.dataIndex === 'money') {
                  return (
                    <a-space>
                      <a-button type="link" onClick={() => handleLog(record)}>
                        {record.money}
                      </a-button>
                    </a-space>
                  )
                }
                if (column.dataIndex === 'status') {
                  return (
                    <a-space>
                      <a-button
                        danger={['驳回'].includes(record.status)}
                        type="link"
                        onClick={() => handleStatusLog(record)}
                      >
                        {record.status}
                      </a-button>
                    </a-space>
                  )
                }
              },
              summary: () => {
                if (state.tableData.length > 0) {
                  return (
                    <a-table-summary fixed>
                      <a-table-summary-row>
                        <a-table-summary-cell align="center">合计</a-table-summary-cell>
                        <a-table-summary-cell index={1} col-span={8} />
                        <a-table-summary-cell index={9} align="center">
                          {percentage(1)}
                        </a-table-summary-cell>
                        <a-table-summary-cell index={10} align="center">
                          5000
                        </a-table-summary-cell>
                        <a-table-summary-cell index={11} align="center">
                          /
                        </a-table-summary-cell>
                      </a-table-summary-row>
                    </a-table-summary>
                  )
                }
              }
            }}
          />
          <status-pop
            title="IP变更记录"
            v-model:visible={state.logVisible}
            params={state.logParams}
            request={queryList}
            columns={statusColumns}
          />
          <status-pop
            title="状态日志"
            v-model:visible={state.statusVisible}
            params={state.logParams}
            request={queryList}
            columns={statusStatusColumns}
          />
        </g-pro-page-container>
      )
    }
  }
})
