import { useTableHeight } from '@/hooks/web/useTableHeight'
import { useStorePermission } from '@/store'
import { RequestData } from '@gx-design/ProTable/types/table'
import { resetDict, useDict } from '@/hooks/web'
import { queryList, exportList, importEntity, deleteEntity } from '@/services/example/language'
import { percentage, thousandsSeparator } from '@sirpho/utils'
import { statusStatusColumns } from './utils/config'
import dayjs from 'dayjs'
import TabsPaneTable from '@/components/TabsPaneTable'
import { message } from 'ant-design-vue'
import './index.less'
const { hasPermission } = useStorePermission()
export default defineComponent({
  components: { TabsPaneTable },
  setup() {
    const tableRef = ref()
    const resetRelatedDict = resetDict(['STATUS'])
    const paneTable1 = ref(null)
    const paneTable2 = ref(null)
    // const operation = ref()
    const [personTypeList, personList] = useDict([
      'PERSON_TYPE', // 状态列表
      'PERSON' // 人物列表
    ])

    /**
     * 获取当前tab的表格以计算合适的表格高度
     */
    const component = computed(() => {
      return state?.flag === 'profit' ? paneTable2 : paneTable1
    })

    const [tableHeight, updateTableHeight] = useTableHeight(56, component)

    const state = reactive({
      test: [],
      tags: ['tag1', 'tag2'],
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
          valueEnum: () => unref(personTypeList) || []
        },
        {
          title: '英文名',
          dataIndex: 'englishName',
          search: true,
          showSearch: true,
          valueType: 'select',
          valueEnum: () => unref(personList) || [],
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
        }
      ],
      columns1: [
        {
          title: '年月',
          dataIndex: 'updatedAt',
          align: 'center',
          width: 120,
          customRender: ({ text }) => {
            return dayjs(new Date(text)).format('YYYY-MM')
          }
        },
        {
          title: '人物名称',
          dataIndex: 'name',
          align: 'center',
          width: 120
        },
        {
          title: '人物类型',
          dataIndex: 'personType',
          align: 'center',
          width: 120,
          customRender: ({ record }) => {
            return record.personType || '--'
          }
        },
        {
          title: '英文名',
          dataIndex: 'englishName',
          align: 'center',
          customRender: ({ record }) => {
            return record.englishName || '--'
          },
          width: 120
        },
        {
          title: '编码',
          dataIndex: 'callNo',
          align: 'center',
          width: 120
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          align: 'center',
          width: 120
        },
        {
          title: 'IP价值',
          dataIndex: 'money',
          align: 'center',
          width: 120,
          customRender: ({ record }) => {
            return thousandsSeparator(record.money)
          }
        }
      ],
      columns2: [
        {
          title: '年月',
          dataIndex: 'updatedAt',
          align: 'center',
          width: 120,
          customRender: ({ text }) => {
            return dayjs(new Date(text)).format('YYYY-MM')
          }
        },
        {
          title: '人物名称',
          dataIndex: 'name',
          align: 'center',
          width: 120
        },
        {
          title: '人物类型',
          dataIndex: 'personType',
          align: 'center',
          width: 120,
          customRender: ({ record }) => {
            return record.personType || '--'
          }
        },
        {
          title: '英文名',
          dataIndex: 'englishName',
          align: 'center',
          customRender: ({ record }) => {
            return record.englishName || '--'
          },
          width: 120
        },
        {
          title: '描述',
          dataIndex: 'desc',
          align: 'center',
          width: 120
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          align: 'center',
          width: 120
        },
        {
          title: '市场占有率',
          dataIndex: 'progress',
          align: 'center',
          width: 120,
          customRender: ({ record }) => {
            return percentage(record.progress, 100)
          }
        }
      ],
      params: {
        type: 'other params'
      },
      flag: 'income',
      tableData: [],
      logParams: { id: null },
      logVisible: false,
      statusVisible: false,
      deleteLoading: false,
      selectedRowKeys: [],
      authMap: {
        export: hasPermission('example:compiler'),
        import: hasPermission('example:compiler'),
        update: hasPermission('example:compiler'),
        delete: hasPermission('example:compiler')
      }
    })

    /**
     * 获取表格数据
     * @param params
     */
    const getTableList = async (params) => {
      state.selectedRowKeys = []
      const response = await queryList({
        ...params,
        flag: state.flag,
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

    /**
     * 修改选中项
     * @param keys
     */
    const onSelectChange = (keys) => {
      state.selectedRowKeys = keys
    }

    /**
     * 设置禁选项
     * @param record
     */
    const getCheckboxProps = (record) => {
      return { disabled: record.name === '迪迦' }
    }
    /**
     * 切换tab
     */
    const switchTab = () => {
      state.selectedRowKeys = []
      // 重新查询
      tableRef.value.formRef.handleSubmit(true, false)
    }

    /**
     * 编辑
     * @param record
     */
    const handleEdit = (record) => {
      console.log(record)
      // operation.value?.edit(record, state.flag)
    }
    /**
     * 删除
     */
    const handleDelete = async () => {
      state.deleteLoading = true
      const res = await deleteEntity(state.selectedRowKeys).finally(() => {
        state.deleteLoading = false
      })
      if (res && res.code === 0) {
        message.success('操作成功！')
        await handleOk(state.selectedRowKeys)
      } else {
        message.error(res.msg || '操作异常！')
      }
    }

    return () => {
      return (
        <g-pro-page-container>
          <g-pro-table
            class="python-page"
            row-key="id"
            scroll={{ x: '100%', y: tableHeight } as any}
            align="center"
            search={{
              onCollapse: updateTableHeight
            }}
            showIndex={false}
            options={false}
            actionRef={(info) => (tableRef.value = info)}
            columns={state.columns}
            request={(params, _sort, _filter) => getTableList(params)}
            params={state.params}
            pagination={state.flag === 'profit' ? false : undefined}
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
                  ),
                  state.authMap.delete && (
                    <a-popconfirm
                      disabled={state.selectedRowKeys.length <= 0}
                      placement="topLeft"
                      title="确定要删除吗？"
                      key="pop_delete"
                      onConfirm={() => {
                        handleDelete()
                      }}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a-button
                        type="primary"
                        size="small"
                        danger
                        loading={state.deleteLoading}
                        disabled={state.selectedRowKeys.length <= 0}
                      >
                        <delete-outlined />
                        批量删除
                      </a-button>
                    </a-popconfirm>
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
                        onClick={() => handleStatusLog(record)}
                      >
                        {record.status}
                      </a-button>
                    </a-space>
                  )
                }
              },
              customize: (dataSource) => {
                return (
                  <a-tabs v-model:activeKey={state.flag} type="card" onChange={switchTab}>
                    <a-tab-pane key="income" tab="收入">
                      <TabsPaneTable
                        ref={paneTable1}
                        scroll={{ x: '100%', y: tableHeight }}
                        row-key="id"
                        showIndex={false}
                        columns={state.columns1}
                        rowSelection={
                          {
                            selectedRowKeys: state.selectedRowKeys,
                            onChange: onSelectChange,
                            getCheckboxProps: getCheckboxProps
                          } as any
                        }
                        dataSource={dataSource}
                        v-slots={{
                          bodyCell: ({ column, record }) => {
                            if (column.dataIndex === 'action') {
                              return (
                                state.authMap.update && (
                                  <a-space>
                                    <a-button onClick={() => handleEdit(record)}>编辑</a-button>
                                  </a-space>
                                )
                              )
                            }
                          }
                        }}
                      />
                    </a-tab-pane>
                    <a-tab-pane key="profit" tab="利润">
                      <TabsPaneTable
                        ref={paneTable2}
                        scroll={{ x: '100%', y: tableHeight }}
                        row-key="id"
                        showIndex={false}
                        columns={state.columns2}
                        rowSelection={
                          {
                            selectedRowKeys: state.selectedRowKeys,
                            onChange: onSelectChange,
                            getCheckboxProps: getCheckboxProps
                          } as any
                        }
                        dataSource={dataSource}
                        v-slots={{
                          bodyCell: ({ column, record }) => {
                            if (column.dataIndex === 'action') {
                              return (
                                state.authMap.update && (
                                  <a-space>
                                    <a-button onClick={() => handleEdit(record)}>编辑</a-button>
                                  </a-space>
                                )
                              )
                            }
                          }
                        }}
                      />
                    </a-tab-pane>
                  </a-tabs>
                )
              }
            }}
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
