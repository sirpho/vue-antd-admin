import { useTableHeight } from '@/hooks/web/useTableHeight'
import { RequestData } from '@gx-design/ProTable/types/table'
import { queryList, queryAllWorkers } from '@/services/example/visualization'
import { handleTimeShow } from '@sirpho/utils/util'
import { formatPower } from '@/views/example/visualization/utils'
import ChartModal from './components/ChartModal'
import { divide, percentage } from '@sirpho/utils/math'
export default defineComponent({
  setup() {
    const tableRef = ref()
    const chartRef = ref()

    const [tableHeight, updateTableHeight] = useTableHeight()
    const state = reactive({
      columns: [
        {
          title: '名称',
          dataIndex: 'identifer',
          width: 120
        },
        {
          title: '最后提交时间',
          dataIndex: 'lts',
          width: 120,
          customRender: ({ record }) => {
            return handleTimeShow(record.lts, false)
          }
        },
        {
          title: '实际',
          dataIndex: 'hash',
          width: 120,
          customRender: ({ record }) => {
            return formatPower(record.hash)
          }
        },
        {
          title: '结算',
          dataIndex: 'hash2',
          width: 120,
          customRender: ({ record }) => {
            return formatPower(record.hash2)
          }
        },
        {
          title: '倍率',
          dataIndex: 'rate',
          width: 120,
          customRender: ({ record }) => {
            return percentage(divide(record.hash2, record.hash))
          }
        }
      ],
      tableData: [],
      historyList: []
    })

    onMounted(() => {
      queryAllWorkers({}).then((res: any) => {
        state.historyList = res
      })
    })

    /**
     * 获取表格数据
     * @param params
     */
    const getTableList = async (params) => {
      const response = (await queryList({
        ...params
      })) as any

      const list = []
      for (const item in response) {
        list.push({
          identifer: item,
          ...response[item]
        })
      }

      state.tableData = list
      return {
        data: list,
        success: !!response,
        current: 1,
        total: list.length
      } as RequestData
    }

    /**
     * 查看表格
     */
    const handleWatch = (record) => {
      const list = state.historyList[record.identifer]
      const endTime = list[0]?.ts || 0
      const startTime = list[list.length - 1]?.ts || 0
      chartRef.value?.watch(record, list, startTime, endTime)
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
            pagination={false}
            v-slots={{
              bodyCell: ({ column, record }) => {
                if (column.dataIndex === 'identifer') {
                  return (
                    <a-button type="link" onClick={() => handleWatch(record)}>
                      {record.identifer}
                    </a-button>
                  )
                }
              }
            }}
          />

          <ChartModal ref={chartRef} />
        </g-pro-page-container>
      )
    }
  }
})
