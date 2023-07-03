import { defineComponent, reactive } from 'vue'
import { proModalProps } from '@gx-design/ProModal/props'
import { v4 } from 'uuid'
import { cloneDeep } from 'lodash-es'
export default defineComponent({
  name: 'DataPicker',
  emit: ['handleOk'],
  props: {
    ...proModalProps,
    // 获取列表的接口
    operation: {
      type: Function,
      required: true
    },
    params: {
      type: Object,
      default: () => {}
    },
    columns: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '请选择'
    },
    // 单选或多选
    type: {
      type: String as PropType<'radio' | 'checkbox'>,
      default: 'radio'
    },
    // 主键
    rowKey: {
      type: String,
      default: 'uniKey'
    },
    // 不可选择项的keys
    disabledKeys: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    listKey: {
      type: String as PropType<string>,
      default: 'list'
    },
    // 是否分页
    isPaging: {
      type: Boolean as PropType<boolean>,
      default: true
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      isFail: false,
      visible: false,
      spinning: false,
      skeletonLoading: false,
      tableList: [],
      selectRows: [],
      selectedRowKeys: [],
      // 用于判断未分页的数据是否已加载
      initialized: false
    })

    watchEffect(() => {
      if (props.visible) {
        state.initialized = false
        open()
      }
    })

    /**
     * 关闭弹窗
     */
    const handleCancel = () => {
      emit('update:visible', false)
      resetModalState()
    }

    /**
     * 选择完毕
     */
    const handleConfirm = () => {
      const result = props.type === 'checkbox' ? state.selectRows : state.selectRows.pop()
      emit('handleOk', result)
      handleCancel()
    }

    /**
     * 重置
     */
    const resetModalState = () => {
      state.isFail = false
      state.spinning = false
      state.visible = false
      state.skeletonLoading = false
      state.tableList = []
    }

    const open = () => {
      state.visible = true
    }

    /**
     * 获取表格数据
     * @param params
     */
    const getTableList = async (params) => {
      // 如果接口不分页并且已查询过，则不再查询
      if (!props.isPaging && state.initialized) {
        return {
          data: state.tableList,
          success: true,
          total: state.tableList.length,
          current: params.current
        }
      }

      state.selectedRowKeys = []
      state.selectRows = []
      state.skeletonLoading = true
      const res = await props
        .operation({
          ...params,
          limit: params.pageSize,
          page: params.pageNum
        })
        .catch(() => {
          state.isFail = true
        })
        .finally(() => {
          state.skeletonLoading = false
        })

      if (res.code !== 0 || (!res.data && !res.page)) {
        state.isFail = true
        return
      }
      const result = {
        data: [],
        success: true,
        total: 0,
        current: 1
      }
      if (props.isPaging) {
        if (res.data?.hasOwnProperty(props.listKey) || res.page?.hasOwnProperty(props.listKey)) {
          const list = res.data?.[props.listKey] || res.page?.[props.listKey]
          list.forEach((item: any) => {
            item.uniKey = v4()
          })
          result.data = list
          result.success = true
          result.current = res.data?.currPage || res.page?.currPage
          result.total = res.data?.totalCount || res.page?.totalCount
        } else {
          result.data = []
          result.success = true
          result.current = 1
          result.total = 0
        }
      } else {
        // 接口不分页
        const list = res.data || []
        list.forEach((item: any) => {
          item.uniKey = v4()
        })
        result.data = list
        result.success = true
        result.current = 1
        result.total = list.length
      }
      state.tableList = result.data || []
      state.initialized = true
      return result
    }

    /**
     * 选中项改变
     * @param keys
     * @param rows
     */
    const onSelectChange = (keys, rows) => {
      state.selectedRowKeys = keys
      state.selectRows = rows
    }

    /**
     * 点击某一行选中|取消选中
     * @param record
     */
    const handleRowClick = (record) => {
      if (props.disabledKeys.includes(record[props.rowKey])) {
        return
      }
      const index = state.selectedRowKeys.indexOf(record[props.rowKey])

      if (index > -1) {
        state.selectedRowKeys.splice(index, 1)
        state.selectRows.splice(index, 1)
      } else {
        if (props.type === 'checkbox') {
          state.selectedRowKeys.push(record[props.rowKey])
          state.selectRows.push(cloneDeep(record))
        } else {
          state.selectedRowKeys = [record[props.rowKey]]
          state.selectRows = [cloneDeep(record)]
        }
      }
    }

    /**
     * 设置禁选项
     * @param record
     */
    const getCheckboxProps = (record) => {
      return { disabled: props.disabledKeys.includes(record[props.rowKey]) }
    }

    return () => (
      <g-pro-modal
        type="normal"
        title={props.title}
        visible={state.visible}
        isFail={state.isFail}
        showIndex={false}
        spinning={false}
        skeletonLoading={state.skeletonLoading}
        onCancel={handleCancel}
        footer={
          <div class="gx-pro-modal-footer">
            <a-button
              disabled={state.selectRows.length <= 0}
              type="primary"
              key="confirm"
              onClick={() => handleConfirm()}
            >
              确定
            </a-button>
            <a-button key="cancel" onClick={() => handleCancel()}>
              关闭
            </a-button>
          </div>
        }
      >
        <g-pro-table
          row-key={props.rowKey}
          scroll={{ x: '100%', y: 300 }}
          align="center"
          showIndex
          options={false}
          columns={props.columns}
          rowSelection={{
            type: props.type,
            selectedRowKeys: state.selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: getCheckboxProps
          }}
          params={props.params}
          request={(params) => getTableList(params)}
          customRow={(record) => ({
            onClick: () => handleRowClick(record)
          })}
          pagination={{
            showSizeChanger: false,
            showQuickJumper: false,
            size: 'small',
            pageSize: 5
          }}
        />
      </g-pro-modal>
    )
  }
})
