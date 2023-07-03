import { defineComponent, reactive } from 'vue'
import { proModalProps } from '@gx-design/ProModal/props'
import { v4 } from 'uuid'

export default defineComponent({
  props: {
    ...proModalProps,
    columns: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    request: {
      type: Function as PropType<(param?: any) => Promise<any>>,
      required: true
    },
    params: {
      type: Object as PropType<any>,
      default: () => {}
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
      // 用于判断未分页的数据是否已加载
      initialized: false
    })

    const pagination = reactive({
      current: 1,
      pageSize: 5,
      total: 0,
      showTotal: (total: number) => `共 ${total} 条`,
      onChange: (page: number, pageSize: number) => {
        pagination.current = page
        pagination.pageSize = pageSize
      }
    })

    watch(
      () => props.visible,
      () => {
        state.initialized = false
        pagination.current = 1
      }
    )

    watchEffect(() => {
      props.visible && open()
    })

    /**
     * 关闭弹窗
     */
    const handleCancel = () => {
      emit('update:visible', false)
      resetModalState()
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
      // 如果接口不分页并且已查询过，则不再查询
      if (!props.isPaging && state.initialized) {
        return
      }
      query()
    }

    const query = async () => {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...props.params
      }

      state.skeletonLoading = true
      const res = await props.request(params).finally(() => {
        state.skeletonLoading = false
      })
      if (res.code === 0 && res.data) {
        // 接口分页
        if (props.isPaging) {
          if (res.data?.hasOwnProperty(props.listKey) && Array.isArray(res.data?.[props.listKey])) {
            const list = res.data[props.listKey]
            list.forEach((item: any) => {
              item.uniKey = v4()
            })
            state.tableList = list
            pagination.current = res.data.currPage
            pagination.pageSize = res.data.pageSize
            pagination.total = res.data.totalCount
          } else {
            state.tableList = []

            pagination.current = 1
            pagination.total = 0
          }
        } else {
          // 接口不分页
          const list = res.data || []
          list.forEach((item: any) => {
            item.uniKey = v4()
          })
          state.tableList = list
          pagination.current = 1
          pagination.pageSize = 5
          pagination.total = list.length
        }
        state.initialized = true
      } else {
        state.isFail = true
      }
    }

    return () => (
      <g-pro-modal
        type="normal"
        title={props.title}
        visible={state.visible}
        isFail={state.isFail}
        spinning={false}
        skeletonLoading={state.skeletonLoading}
        onCancel={handleCancel}
        hiddenFooter={true}
      >
        <a-table
          columns={props.columns}
          data-source={state.tableList}
          size="small"
          bordered
          rowKey="uniKey"
          pagination={pagination}
        />
      </g-pro-modal>
    )
  }
})
