import {
  defineComponent,
  reactive,
  onBeforeUnmount,
  ref,
  unref,
  watch,
  toRaw,
  onMounted,
  computed,
  getCurrentInstance,
  Ref, ExtractPropTypes
} from 'vue'
import { omit } from 'lodash-es'
import {
  LoadingOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue'
import Nodata from '/@/assets/public_image/nodata.png'
import {
  getRandomNumber,
  hanndleField,
  isObject
} from '/@/utils/util'
import { getPropsSlot } from '/@/components/_util'
import { stateTypes } from './types/state'
import { OptionConfig } from './types/table'
import { useLoading } from './hooks/useLoading'
import { useTableSize } from './hooks/useTableSize'
import { useColumns } from './hooks/useColums'
import { usePagination } from './hooks/usePagination'
import { useTableScroll } from './hooks/useTableScroll'
import { useFetchData } from './hooks/useFetchData'
import { useTableForm } from './hooks/useTableForm'
import { proTableProps } from './props'
import DraggableResizable from '../DraggableResizable'
import TableSearch from './components/TableSearch'
import ActionColumns from './components/ActionColumns'
import ActionSize from './components/ActionSize'
import styles from './style.module.less'

export type ProTableProps = Partial<ExtractPropTypes<typeof proTableProps>>;

const proTableSlots = [ 'search', 'headerTitle', 'toolBarBtn', 'titleTip' ]

const defaultEmpty = () => (
  <div style="text-align: center">
    <img style={{ width: '125px' }} src={Nodata} alt="" />
    <p style={{ color: '#666666', fontSize: '15px' }}>暂时没有数据哦~</p>
  </div>
)
const defaultOptions: OptionConfig = {
  reload: true,
  density: true,
  setting: true,
  fullScreen: true
}
const WProTable = defineComponent({
  components: {
    DraggableResizable
  },
  props: proTableProps,
  setup(props, { emit, slots, attrs }) {
    const { proxy }: any = getCurrentInstance()
    const tableClassName = 'wd-pro-table'
    const draggingMap: Recordable = {}
    const innerWidth: Ref<number> = ref(window.innerWidth)
    const getProps = computed(() => {
      return { ...props } as ProTableProps
    })
    const { getLoading, setLoading } = useLoading(getProps, emit)
    const { getSize, setSize } = useTableSize(getProps, emit)
    const {
      getPaginationInfo,
      setPagination
    } = usePagination(getProps)
    const {
      getViewColumns,
      setColumns,
      reSetColumns,
      getColumnsRef,
      setActionColumns,
      getActionColumsRef
    } = useColumns(getProps, innerWidth, emit)
    const {
      getFormParamsRef,
      getFormDataRef,
      setFormParams
    } = useTableForm(getProps, slots)
    const {
      fetchData,
      reload,
      getDataSourceRef,
      handleTableChange
    } = useFetchData(
      getProps,
      {
        getPaginationInfo,
        setPagination,
        setLoading,
        setColumns,
        getViewColumns,
        getFormParamsRef
      },
      emit
    )
    const { getScrollRef } = useTableScroll(
      getProps,
      innerWidth,
      getColumnsRef
    )
    const state: stateTypes = reactive({
      table: null,
      tableId: getRandomNumber().uuid(15),
      tableKey: getRandomNumber().uuid(15),
      fullScreen: false,
      options: defaultOptions,
      tableSlots: {},
      draggingState: draggingMap
    })
    unref(getViewColumns).forEach(col => {
      if (col.dataIndex && col.key) draggingMap[col.dataIndex || col.key] = col.width
    })
    onMounted(() => {
      document.addEventListener('fullscreenchange', fullScreenListener)
      document.addEventListener('webkitfullscreenchange', fullScreenListener)
      document.addEventListener('mozfullscreenchange', fullScreenListener)
      document.addEventListener('msfullscreenchange', fullScreenListener)
      window.addEventListener('resize', getWidth)
      if (props.actionRef) getProTable()
    })
    onBeforeUnmount(() => {
      document.removeEventListener('fullscreenchange', fullScreenListener)
      document.removeEventListener('webkitfullscreenchange', fullScreenListener)
      document.removeEventListener('mozfullscreenchange', fullScreenListener)
      document.removeEventListener('msfullscreenchange', fullScreenListener)
      window.removeEventListener('resize', getWidth)
    })
    /**
     * @Author      gx12358
     * @DateTime    2021/7/15
     * @lastTime    2021/7/15
     * @description 初始化toolbar工具
     */
    const handleOptions = (options) => {
      if (options === false) {
        state.options = {}
      } else {
        if (!isObject(options)) options = {}
        state.options = {
          ...defaultOptions,
          ...options
        }
      }
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/16
     * @lastTime    2021/7/16
     * @description 获取pro-table内部方法
     */
    const getProTable = () => {
      props.actionRef({
        reload: (info) => reload(info),
        loadingOperation: (loading) => setLoading(loading),
        reloadAndRest: () => fetchData({ current: 1, pageSize: 10 })
      })
    }
    watch(innerWidth, (value) => {
      innerWidth.value = value
    })
    watch(() => props.options, (options) => {
      handleOptions(options)
    }, {
      deep: true,
      immediate: true
    })
    watch(() => props, (_) => {
      const tableSlots = {}
      Object.keys(slots).map(item => {
        if (!proTableSlots.includes(item)) {
          tableSlots[item] = slots[item]
        }
        return item
      })
      state.tableSlots = tableSlots
    }, {
      deep: true,
      immediate: true
    })
    const toolBarStyle = computed(() => {
      const style: any = props.search ? { paddingTop: '0' } : {}
      if (innerWidth.value < 992) style.flexWrap = 'wrap'
      return style
    })
    const toolBarItemStyle = computed(() => {
      if (innerWidth.value < 992) return {
        width: '100%'
      }
      return undefined
    })
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 表格属性自适应
     */
    const getBindValues = computed(() => {
      const dataSource = unref(getDataSourceRef)
      let propsData: Recordable = {
        ...attrs,
        ...unref(getProps),
        size: unref(getSize),
        scroll: unref(getScrollRef),
        loading: unref(getLoading),
        columns: toRaw(unref(getViewColumns)),
        pagination: toRaw(unref(getPaginationInfo)),
        dataSource
      }

      propsData = omit(propsData, [ 'class', 'onChange', 'onExpand', 'onExpandedRowsChange' ])
      return propsData
    })
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description ant-table重新渲染表头
     */
    const resizeableTitle = (titleprops, { ...restProps }) => {
      let thDom: any = null
      const { children } = restProps[0]
      const { key } = titleprops
      const col = unref(getViewColumns).find(col => {
        const k = col.dataIndex || col.key
        return k === key
      })
      if (!col || !col.width || col.dataIndex === 'action' || !props.draggabled) {
        return <th {...titleprops}>{children}</th>
      }
      const onDrag = x => {
        state.draggingState[key] = 0
        col.width = Math.max(x, 30)
        const newViewColoumns = unref(getViewColumns).map(item => {
          if (item.dataIndex === col.dataIndex) {
            item.width = col.width
          }
          return item
        })
        setColumns(newViewColoumns)
      }
      const onDragstop = () => {
        if (thDom && thDom['getBoundingClientRect']) {
          state.draggingState[key] = thDom['getBoundingClientRect']().width
        }
      }
      return (
        <th {...titleprops} ref={r => { thDom = r }} width={col.width} class="resize-table-th">
          {children}
          <DraggableResizable
            key={col.key}
            class="table-draggable-handle"
            w={10}
            x={state.draggingState[key] || col.width}
            z={1}
            axis="x"
            draggable={true}
            resizable={false}
            onDragging={onDrag}
            onDragstop={onDragstop}
          />
        </th>
      )
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 监听屏幕宽度
     */
    const getWidth = () => {
      innerWidth.value = window.innerWidth
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 监听是否全屏
     */
    const fullScreenListener = (e) => {
      if (e.target.id === state.tableId) {
        state.fullScreen = !state.fullScreen
      }
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 表格列设置-是否展示
     */
    const onColumnsChange = (data) => {
      setActionColumns(data, 'visible')
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 表格列设置-拖拽
     */
    const onColumnsDrop = (data) => {
      // console.log(cloneDeep(data))
      setActionColumns(data, 'drop')
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 表格列设置-是否固定
     */
    const onChangeFixedColums = (data) => {
      setActionColumns(data, 'fixed')
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 表格列设置-重置
     */
    const onResetColums = () => {
      reSetColumns()
      emit('reset')
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 切换全屏
     */
    const toggleScreen = () => {
      if (state.fullScreen) {
        const el: any = document
        if (el.exitFullscreen) {
          el.exitFullscreen()
        } else if (el.webkitCancelFullScreen) {
          el.webkitCancelFullScreen()
        } else if (el.mozCancelFullScreen) {
          el.mozCancelFullScreen()
        } else if (el.msExitFullscreen) {
          el.msExitFullscreen()
        }
        if (state.table) state.table['classList'].remove('wd-pro-full-screen')
      } else {
        const el: any = state.table
        el.classList.add('wd-pro-full-screen')
        if (el.requestFullscreen) {
          el.requestFullscreen()
          return true
        } else if (el.webkitRequestFullScreen) {
          el.webkitRequestFullScreen()
          return true
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen()
          return true
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen()
          return true
        }
        proxy.$message.warn('对不起，您的浏览器不支持全屏模式')
        el.classList.remove('wd-pro-full-screen')
        return false
      }
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/21
     * @lastTime    2021/7/21
     * @description 判断是否展示头部
     */
    const handleShowProTool = () => {
      return Object.keys(state.options).length > 0 ||
        slots.headerTitle ||
        props.headerTitle ||
        props.titleTip ||
        (props.toolBarBtn && props.toolBarBtn.length > 0)
    }
    const changeTableParams = async (params, reset) => {
      if (props.request) {
        if (props.search.type === 'slots') {
          if (reset) {
            emit('searchReset')
          }
          if (props.search.showSearch) {
            setFormParams(props.params)
          }
        } else {
          setFormParams(props.params)
        }
      } else {
        emit('search', params)
      }
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description ant-table原始方法
     */
    const changePage = async (pagination, filters, sorter) => {
      handleTableChange(pagination, filters, sorter)
    }
    const expandedRowsChange = (expandedRows) => {
      emit('expandedRowsChange', expandedRows)
    }
    const expand = (expanded, record) => {
      emit('expand', expanded, record)
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 表格刷新
     */
    const refresh = async () => {
      if (props.request) {
        fetchData()
      } else {
        emit('refresh')
      }
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 表格字段溢出提示
     */
    const tooltipSlot = (value, success, record) => {
      let show = value
      const placement = record.align === 'center' ?
        'top'
        :
        record.align === 'left' || !record.align ?
          'topLeft'
          :
          'topRight'
      if (success && record.copyable) {
        show =
          <a-typography-paragraph style={{ margin: '0', width: '100%', padding: '0' }} copyable>
            <a-tooltip title={value} placement={placement}>
              <div class={styles[`${tableClassName}-ellipsis`]}>
                {value}
              </div>
            </a-tooltip>
          </a-typography-paragraph>
      } else if (success && !record.copyable) {
        show = <a-tooltip title={value} placement={placement}>
          {
            record.hasTableTree ?
              value :
              <div class={styles[`${tableClassName}-ellipsis`]}>
                {value}
              </div>
          }
        </a-tooltip>
      }
      return show
    }
    const toolBarLeft = (dom: any, tipDom: any, toolbarDom: any) => (
      <div
        class={styles[`${tableClassName}-list-toolbar-left`]}
        style={{ ...toolBarItemStyle.value, flexWrap: 'wrap' }}
      >
        <div
          class={styles[`${tableClassName}-list-toolbar-title`]}
          style={innerWidth.value < 992 ? { width: '100%' } : undefined}
        >
          {dom}
          {tipDom && (
            <span class={styles[`${tableClassName}-list-toolbar-tip-icon`]}>
              <a-tooltip title={props.titleTipText}>
                {
                  tipDom === true
                    ? <InfoCircleOutlined />
                    : tipDom
                }
              </a-tooltip>
            </span>
          )}
        </div>
        {toolbarDom && (
          <div
            class={styles[`${tableClassName}-list-toolbar-btns`]}
            style={innerWidth.value < 992 ? {
              width: '100%',
              marginTop: '16px',
              marginLeft: 0
            } : undefined}
          >
            <a-space>{toolbarDom}</a-space>
          </div>
        )}
      </div>
    )
    const toolBarRight = () => (
      <div
        class={styles[`${tableClassName}-list-toolbar-right`]}
        style={{ ...toolBarItemStyle.value }}
      >
        {
          state.options.reload ?
            <a-tooltip title="刷新">
              {
                typeof state.options.reload === 'function' ?
                  state.options.reload()
                  :
                  getBindValues.value.loading ?
                    <LoadingOutlined class={styles[`${tableClassName}-list-toolbar-setting-items`]} />
                    :
                    <ReloadOutlined
                      class={styles[`${tableClassName}-list-toolbar-setting-items`]}
                      onClick={refresh}
                    />
              }
            </a-tooltip>
            :
            null
        }
        {
          state.options.density ?
            <ActionSize
              size={unref(getSize)}
              class={styles[`${tableClassName}-list-toolbar-setting-items`]}
              onInput={(size) => setSize(size)}
            />
            :
            null
        }
        {
          state.options.setting ?
            <ActionColumns
              columns={unref(getActionColumsRef)}
              scroll={getBindValues.value.scroll || false}
              class={styles[`${tableClassName}-list-toolbar-setting-items`]}
              onChange={onColumnsChange}
              onDrop={onColumnsDrop}
              onReset={onResetColums}
              onChangeFixed={onChangeFixedColums}
              v-slots={state.tableSlots}
            />
            :
            null
        }
        {
          state.options.fullScreen ?
            typeof state.options.fullScreen === 'function' ?
              state.options.fullScreen()
              :
              <a-tooltip title="全屏">
                {
                  state.fullScreen ?
                    <FullscreenExitOutlined class={styles[`${tableClassName}-list-toolbar-setting-items`]}
                      onClick={toggleScreen} />
                    :
                    <FullscreenOutlined class={styles[`${tableClassName}-list-toolbar-setting-items`]}
                      onClick={toggleScreen} />
                }
              </a-tooltip>
            :
            null
        }
      </div>
    )
    return () => {
      const headerTitleRender = getPropsSlot(slots, props, 'headerTitle')
      const titleTipRender = getPropsSlot(slots, props, 'titleTip')
      const toolBarBtnRender = getPropsSlot(slots, props, 'toolBarBtn')
      return (
        <div
          id={state.tableId}
          ref={e => state.table = e}
          style={props.tableStyle || null}
          class={
            {
              [`${styles[tableClassName]}`]: true,
              [`${props.tableClassName}`]: props.tableClassName,
              [`${styles[`${tableClassName}-no-scroll`]}`]: !getBindValues.value.scroll,
              [`${styles[`${tableClassName}-has-table-tree`]}`]: false
            }
          }
        >
          {props.search && (
            <TableSearch
              {...props.search}
              loading={getBindValues.value.loading}
              data={getFormDataRef.value}
              onTableSearch={changeTableParams}
            />
          )}
          {
            handleShowProTool() ?
              <div
                style={toolBarStyle.value}
                class={styles[`${tableClassName}-list-toolbar`]}
              >
                {headerTitleRender && toolBarLeft(
                  headerTitleRender,
                  titleTipRender,
                  toolBarBtnRender
                )}
                {Object.keys(state.options).length > 0 ? toolBarRight() : null}
              </div>
              :
              null
          }
          <a-config-provider renderEmpty={defaultEmpty}>
            <a-table
              key={state.tableKey}
              {...getBindValues.value}
              components={{
                header: {
                  cell: resizeableTitle
                }
              }}
              transformCellText={({ text, column }) => {
                const { value, success } = hanndleField(text, column.customize)
                return column.ellipsis ?
                  tooltipSlot(value, success, column)
                  :
                  value
              }}
              onChange={changePage}
              onExpandedRowsChange={expandedRowsChange}
              onExpand={expand}
              v-slots={state.tableSlots}
            />
          </a-config-provider>
        </div>
      )
    }
  }
})
export default WProTable
