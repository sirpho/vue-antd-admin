import { useTableHeight } from '@/hooks/web/useTableHeight'
import { useStorePermission } from '@/store'
import { RequestData } from '@gx-design/ProTable/types/table'
import { resetDict, useDict } from '@/hooks/web'
import {
  queryList,
  exportList,
  importEntity,
  deleteEntity,
  auditEntity
} from '@/services/example/language'
import { percentage, thousandsSeparator } from '@sirpho/utils'
import { statusColumns } from '@/views/example/language/utils/config'
import dayjs from 'dayjs'
import OperationModal from './components/OperationModal'
import ApprovalModal from './components/ApprovalModal'

const { hasPermission } = useStorePermission()
export default defineComponent({
  components: { OperationModal, ApprovalModal },
  setup() {
    const tableRef = ref()
    const operationRef = ref()
    const approvalRef = ref()
    const resetRelatedDict = resetDict(['STATUS'])
    const [statusList, personTypeList, personList] = useDict([
      'STATUS', // 状态列表
      'PERSON_TYPE', // 状态列表
      'PERSON' // 人物列表
    ])
    // 联动
    const filterPersonList = computed(() => {
      const result = unref(personList) || []
      if (state.selectedPersonType) {
        return result.filter((item) => item.type === state.selectedPersonType)
      }
      return result
    })

    const [tableHeight, updateTableHeight] = useTableHeight()
    const state = reactive({
      columns: [
        {
          title: '籍贯',
          dataIndex: 'area',
          width: 120,
          customCell: (item) => ({
            rowSpan: item.rowSpan || item.rowSpan === 0 ? item.rowSpan : 1,
            colSpan: item.colSpan || item.colSpan === 0 ? item.colSpan : 1
          })
        },
        {
          title: '现居住地',
          dataIndex: 'location',
          width: 120,
          customCell: (item) => ({
            rowSpan: item.rowSpan || item.rowSpan === 0 ? item.rowSpan : 1,
            colSpan: item.colSpan || item.colSpan === 0 ? 0 : 1
          })
        },
        {
          title: '年月',
          search: true,
          showSearch: true,
          allowClear: false,
          valueType: 'dateMonth',
          dataIndex: 'updatedAt',
          width: 120,
          format: 'YYYY-MM',
          overflowLine: 2,
          initialValue: dayjs().subtract(1, 'month').format('YYYY-MM')
        },
        {
          title: '人物名称',
          dataIndex: 'name',
          search: true,
          width: 120
        },
        {
          title: '备注',
          dataIndex: 'memo',
          overflowLine: 2,
          width: 180
        },
        {
          title: '人物类型',
          dataIndex: 'personType',
          width: 120,
          show: false,
          search: true,
          showSearch: true,
          valueType: 'select',
          valueEnum: () => unref(personTypeList) || [],
          customRender: ({ record }) => {
            return record.personType || '--'
          },
          onChange: (value) => {
            state.selectedPersonType = value
            tableRef.value?.formRef?.changeFormState('englishName', undefined)
          }
        },
        {
          title: '英文名',
          dataIndex: 'englishName',
          search: true,
          showSearch: true,
          valueType: 'select',
          valueEnum: () => unref(filterPersonList) || [],
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
        },
        {
          title: '操作',
          width: 220,
          dataIndex: 'action'
        }
      ],
      tableData: [],
      removeLoadMap: {},
      logParams: { id: null },
      logVisible: false,
      selectedPersonType: undefined,
      authMap: {
        export: hasPermission('example:language'),
        import: hasPermission('example:language'),
        add: hasPermission('example:language'),
        update: hasPermission('example:language'),
        watch: hasPermission('example:language'),
        remove: hasPermission('example:language'),
        audit: hasPermission('example:language')
      }
    })

    /**
     * 合并单元格
     */
    const mergeCell = (list) => {
      let rowSpan = 1
      for (let i = list.length - 1; i >= 0; i--) {
        const item = list[i]
        // 籍贯与居住地相同则合并
        if (item.area === item.location) {
          item.colSpan = 2
        }
        if (i > 0) {
          // 籍贯相同的合并
          const nextItem = list[i - 1]
          if (item.area === nextItem.area && item.location === nextItem.location) {
            item.rowSpan = 0
            rowSpan++
          } else {
            item.rowSpan = rowSpan
            rowSpan = 1
          }
        }
      }
      list[0].rowSpan = rowSpan
    }

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
      mergeCell(list)
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
     * 新增
     */
    const handleAdd = () => {
      operationRef.value?.open()
    }

    /**
     * 编辑
     * @param record
     */
    const handleEdit = (record: any) => {
      operationRef.value?.edit(record)
    }

    /**
     * 查看
     * @param record
     */
    const handleWatch = (record: any) => {
      operationRef.value?.watch(record)
    }

    /**
     * 审核
     * @param record
     */
    const handleAudit = (record: any) => {
      approvalRef.value?.audit(record.id)
    }

    /**
     * 删除
     * @param record
     */
    const handleRemove = async (record: any) => {
      if (state.removeLoadMap[record.id]) {
        return
      }
      state.removeLoadMap[record.id] = true
      const res = await deleteEntity([record.id]).finally(() => {
        state.removeLoadMap[record.id] = false
      })
      if (res.code === 0) {
        handleOk([record.id])
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
                  ),
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
                if (column.dataIndex === 'status') {
                  return (
                    <a-space>
                      <a-button
                        danger={['驳回'].includes(record.status)}
                        type="link"
                        onClick={() => handleLog(record)}
                      >
                        {record.status}
                      </a-button>
                    </a-space>
                  )
                }
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
                    ),
                    state.authMap.remove && (
                      <a-popconfirm
                        placement="topLeft"
                        title="确定要删除吗？"
                        onConfirm={() => handleRemove(record)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <a-button danger loading={state.removeLoadMap[record.id]} type="link">
                          删除
                        </a-button>
                      </a-popconfirm>
                    ),
                    state.authMap.audit && (
                      <a-button type="link" onClick={() => handleAudit(record)}>
                        审核
                      </a-button>
                    )
                  ]
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
                        <a-table-summary-cell index={12} align="center">
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
            title="审批记录"
            v-model:visible={state.logVisible}
            params={state.logParams}
            request={queryList}
            columns={statusColumns}
          />
          <OperationModal ref={operationRef} onHandleOk={() => handleOk()} />
          <ApprovalModal ref={approvalRef} operation={auditEntity} onHandleOk={() => handleOk()} />
        </g-pro-page-container>
      )
    }
  }
})
