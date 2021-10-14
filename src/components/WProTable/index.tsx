import {
  defineComponent,
  reactive,
  onBeforeUnmount,
  ref,
  watch,
  onMounted,
  computed,
  getCurrentInstance,
  ComponentInternalInstance,
  Ref
} from 'vue'
import { cloneDeep } from 'lodash-es'
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
  getSortIndex,
  handleCurrentPage,
  hanndleField,
  isArray,
  isObject
} from '/@/utils/util'
import { stateTypes } from './types/state'
import { OptionConfig, ProTableProps } from './types/table'
import { proTableProps } from './props'
import DraggableResizable from '../DraggableResizable'
import TableSearch from './components/TableSearch'
import ActionColumns from './components/ActionColumns'
import ActionSize from './components/ActionSize'
import styles from './style.module.less'

const proTableSlots = [ 'search', 'headerTitle', 'toolBarBtn', 'titleTip' ]

const defaultEmpty = () => (
  <div style="text-align: center">
    <img style={{ width: '125px' }} src={Nodata} alt="" />
    <p style={{ color: '#666666', fontSize: '15px' }}>暂时没有数据哦~</p>
  </div>
)
const defaultPageConfig = {
  showQuickJumper: true,
  showSizeChanger: true,
  size: 'normal',
  pageSizeOptions: [ '10', '20', '50', '100' ],
  showTotal: (total) => `共${total < 10 ? 1 : Math.ceil(total / 10)}页 ${total}条记录`
}
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
  setup(props, { emit, slots }) {
    const { proxy }: any = getCurrentInstance()
    const tableClassName = 'wd-pro-table'
    const draggingMap: Recordable = {}
    const defaultConfig = {
      pagination: defaultPageConfig
    }
    let originColums: any = cloneDeep(props.columns).map(item => {
      return {
        ...item,
        align: item.align || props.align,
        uuid: getRandomNumber().uuid(15)
      }
    })
    const state: stateTypes = reactive({
      table: null,
      searchData: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        ...defaultPageConfig
      },
      dataSource: [],
      tableId: getRandomNumber().uuid(15),
      tableKey: getRandomNumber().uuid(15),
      fullScreen: false,
      columns: cloneDeep(originColums).filter(item => item.checked || item.checked === undefined),
      actionColums: cloneDeep(originColums),
      scrollFixed: false,
      tableLoading: false,
      size: props.size || 'middle',
      options: defaultOptions,
      tableSlots: {},
      draggingState: draggingMap
    })
    const innerWidth: Ref<number> = ref(window.innerWidth)
    const pollingSetTimeRef: Ref<any> = ref()
    state.columns.forEach(col => {
      if (col.dataIndex && col.key) draggingMap[col.dataIndex || col.key] = col.width
    })
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description ant-table重新渲染表头
     */
    const resizeableTitle = (titleprops, { ...restProps }) => {
      let thDom: Element | null | ComponentInternalInstance = null
      const { children } = restProps[0]
      const { key } = titleprops
      const col = state.columns.find(col => {
        const k = col.dataIndex || col.key
        return k === key
      })
      const actionCol: any = state.actionColums.find(col => {
        const k = col.dataIndex || col.key
        return k === key
      })
      if (!col || !col.width || col.dataIndex === 'action' || !props.draggabled) {
        if (col && col.dataIndex === 'action' && !props.neverScroll) {
          if (props.automaticScroll) {
            if (props.scroll?.x) {
              col.width = col.width || 100
              col.fixed = 'right'
              actionCol.fixed = 'right'
            } else {
              const originCol = originColums.find(col => {
                const k = col.dataIndex || col.key
                return k === key
              })
              col.width = originCol.width || ''
              col.fixed = originCol.fixed || ''
              actionCol.fixed = originCol.fixed || ''
            }
          } else {
            if (props.scroll?.x && col && col.dataIndex === 'action') {
              col.width = col.width || 100
              col.fixed = 'right'
              actionCol.fixed = 'right'
            } else if (innerWidth.value < 1540 && col && col.dataIndex === 'action') {
              col.width = col.width || 100
              col.fixed = 'right'
              actionCol.fixed = 'right'
            } else {
              const originCol = originColums.find(col => {
                const k = col.dataIndex || col.key
                return k === key
              })
              col.width = originCol.width || ''
              col.fixed = originCol.fixed || ''
              actionCol.fixed = originCol.fixed || ''
            }
          }
        } else {
          if (innerWidth.value < 992 && col && !col.width && !col.ellipsis) {
            col.ellipsis = true
          }
        }
        return <th {...titleprops}>{children}</th>
      }
      const onDrag = x => {
        state.draggingState[key] = 0
        col.width = Math.max(x, 30)
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
    const components = {
      header: {
        cell: resizeableTitle
      }
    }
    onMounted(() => {
      document.addEventListener('fullscreenchange', fullScreenListener)
      document.addEventListener('webkitfullscreenchange', fullScreenListener)
      document.addEventListener('mozfullscreenchange', fullScreenListener)
      document.addEventListener('msfullscreenchange', fullScreenListener)
      window.addEventListener('resize', getWidth)
      if (props.request && !props.polling) tableLoadData()
      if (props.actionRef) getProTable()
    })
    onBeforeUnmount(() => {
      document.removeEventListener('fullscreenchange', fullScreenListener)
      document.removeEventListener('webkitfullscreenchange', fullScreenListener)
      document.removeEventListener('mozfullscreenchange', fullScreenListener)
      document.removeEventListener('msfullscreenchange', fullScreenListener)
      window.removeEventListener('resize', getWidth)
      if (pollingSetTimeRef.value) {
        clearInterval(pollingSetTimeRef.value)
      }
    })
    /**
     * @Author      gx12358
     * @DateTime    2021/9/15
     * @lastTime    2021/9/15
     * @description columns变化
     */
    const handleChanheColums = () => {
      state.columns = cloneDeep(originColums)
        .filter(item => item.checked || item.checked === undefined)
      state.actionColums = cloneDeep(originColums)
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/15
     * @lastTime    2021/7/15
     * @description 初始化是否展示序号
     */
    const handleShowIndex = (value) => {
      if (value && originColums.every(item => item.dataIndex !== 'sortIndex')) {
        const firstColumsItem = originColums[0]
        originColums.unshift({
          title: '序号',
          originAlign: '',
          align: props.align,
          fixed: firstColumsItem.fixed,
          width: 60,
          uuid: getRandomNumber().uuid(15),
          dataIndex: 'sortIndex'
        })
      } else if (!value && originColums.some(item => item.dataIndex === 'sortIndex')) {
        originColums = originColums.filter(item => item.dataIndex !== 'sortIndex')
      }
      handleChanheColums()
    }
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
     * @DateTime    2021/7/21
     * @lastTime    2021/7/21
     * @description 表格搜索serch type: columns 初始化data值
     */
    const handleSearchData = (searchConfig) => {
      let searchData = searchConfig ? searchConfig.data : []
      if (searchConfig && searchConfig.type === 'columns') {
        searchData = []
        props.columns.map(item => {
          if (item.searchConfig) searchData.push(item.searchConfig)
          return item
        })
      }
      state.searchData = cloneDeep(searchData)
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/16
     * @lastTime    2021/7/16
     * @description 获取pro-table内部方法
     */
    const getProTable = () => {
      props.actionRef({
        reload: (info) => tableLoadData(info),
        loadingOperation: (loading) => changeTabelLoading(loading),
        reloadAndRest: () => tableLoadData({ current: 1, pageSize: state.pagination.pageSize })
      })
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/15
     * @lastTime    2021/7/15
     * @description 表格request
     */
    const tableLoadData = async (info: any = {}) => {
      const { pagination, filters, sorter, params = {}, removeTotal = 0, isPolling } = info
      const defaultParams = {}
      if (props.search) {
        if (props.search.type === 'dataSouce' || props.search.type === 'columns') {
          state.searchData.map(item => {
            let defaultValue = item.defaultValue
            const valueUndefined = [ 'select' ]
            const valueNull = [ 'date', 'time', 'dateRange' ]
            if (!defaultValue && valueUndefined.includes(item.valueType)) {
              defaultValue = undefined
            } else if (!defaultValue && valueNull.includes(item.valueType)) {
              defaultValue = null
            } else if (!defaultValue) {
              defaultValue = ''
            }
            if (item.name === 'dateRange') {
              defaultParams[item.rangeStartName || 'start'] = defaultValue ? [ 0 ] : null
              defaultParams[item.rangeEndName || 'end'] = defaultValue ? [ 1 ] : null
            } else {
              defaultParams[item.name] = defaultValue
            }
            return item
          })
        }
      }
      state.tableLoading = !isPolling
      emit('loadingChange', state.tableLoading)
      if (pagination && pagination.current) {
        pagination.current = handleCurrentPage(pagination, removeTotal)
      } else if (props.showPagination && state.pagination.current) {
        state.pagination.current = handleCurrentPage({
          current: state.pagination.current,
          pageSize: state.pagination.pageSize,
          total: state.pagination.total
        }, removeTotal)
      }
      const parameter = {
        pageNum: (pagination && pagination.current) ||
          props.showPagination && state.pagination.current,
        pageSize: (pagination && pagination.pageSize) ||
          props.showPagination && state.pagination.pageSize,
        ...props.params,
        ...defaultParams,
        ...params
      }
      if (sorter && sorter.order) {
        state.columns = state.columns.map(item => {
          if (item.dataIndex === sorter.columnKey) {
            item.sortOrder = sorter.order
          } else {
            item.sortOrder = false
          }
          return item
        })
      } else if (sorter) {
        state.columns = state.columns.map(item => {
          if (item.dataIndex === sorter.columnKey) item.sortOrder = false
          return item
        })
      }
      const result = await props.request(parameter, sorter, filters)
      if (result && result.success) {
        state.tableKey = getRandomNumber().uuid(15)
        state.dataSource = getSortIndex(result.data, pagination)
        hasTableTree(state.dataSource)
        state.pagination.current = parameter.pageNum
        state.pagination.pageSize = parameter.pageSize
        state.pagination.total = result.total
      } else {
        proxy.$message.error(result.msg || '系统错误，请稍后再试！')
      }
      state.tableLoading = false
      emit('loadingChange', state.tableLoading)
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/10/13
     * @lastTime    2021/10/13
     * @description 表格轮询
     */
    const useDebounceFn = async (isPolling: boolean, info: any = {}) => {
      if (pollingSetTimeRef.value) {
        clearInterval(pollingSetTimeRef.value)
      }

      await tableLoadData(info)

      pollingSetTimeRef.value = setInterval(() => {
        tableLoadData({ isPolling, ...info })
        // 这里判断最小要3000ms，不然一直loading
      }, pollingTime.value < 3 ? 3000 : pollingTime.value * 1000)
    }
    watch(innerWidth, (value) => {
      innerWidth.value = value
    })
    watch(() => props.columns, (val) => {
      originColums = cloneDeep(val).map(item => {
        return {
          ...item,
          align: item.align || props.align,
          uuid: getRandomNumber().uuid(15)
        }
      })
      handleChanheColums()
      let searchData: any = []
      if (props.search && props.search.type === 'columns') {
        searchData = []
        props.columns.map(item => {
          if (item.searchConfig) searchData.push(item.searchConfig)
          return item
        })
      }
      state.searchData = cloneDeep(searchData)
    }, {
      deep: true,
      immediate: true
    })
    watch(() => props.size, (value) => {
      state.size = value
    }, {
      deep: true,
      immediate: true
    })
    watch(() => props.align, (value) => {
      originColums = originColums.map(item => {
        item.originAlign = item.originAlign || item.originAlign === ''
          ? item.originAlign
          : (item.align || '')
        item.align = item.originAlign || value
        return item
      })
      handleChanheColums()
    }, {
      deep: true,
      immediate: true
    })
    watch(() => props.showIndex, (value) => {
      handleShowIndex(value)
    }, {
      deep: true,
      immediate: true
    })
    watch(() => props.params, async (val) => {
      if (props.request && props.search && !props.search.showSearch) {
        clearInterval(pollingSetTimeRef.value)
        await tableLoadData({ params: val })
        props.polling && useDebounceFn(props.polling, { params: val })
      }
    }, {
      deep: true,
      immediate: true
    })
    watch(() => props.pagination, (val) => {
      const propsPagination = { ...val }
      delete propsPagination.current
      delete propsPagination.pageSize
      state.pagination = {
        ...state.pagination,
        ...propsPagination
      }
    }, {
      deep: true,
      immediate: true
    })
    watch(() => props.options, (options) => {
      handleOptions(options)
    }, {
      deep: true,
      immediate: true
    })
    watch(() => props.search, (searchConfig) => {
      handleSearchData(searchConfig)
    }, {
      deep: true,
      immediate: true
    })
    watch(() => props.polling, (value) => {
      if (value) {
        useDebounceFn(value)
      } else {
        clearTimeout(pollingSetTimeRef.value)
      }
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
    const pollingTime = computed(() => props.pollingTime)
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
    const changeProps = computed(() => {
      const publicConfig = cloneDeep(defaultConfig)
      publicConfig.pagination = {
        ...publicConfig.pagination,
        ...defaultPageConfig,
        ...props.pagination
      }
      const dataSource: Recordable[] = getSortIndex(props.dataSource, props.pagination)
      hasTableTree(dataSource)
      let scroll = props.scroll ?
        props.scroll
        :
        innerWidth.value < 1540 ?
          { x: props.columns.length * 140 }
          :
          false
      if (props.automaticScroll) {
        if (!props.scroll?.y) {
          scroll = innerWidth.value < 1540 ?
            { y: 235 }
            :
            { y: 400 }
        }
      }
      if (props.neverScroll && innerWidth.value > 992) {
        scroll = false
      }
      const tableProps: ProTableProps = {
        ...props,
        ...publicConfig,
        dataSource
      }
      if (scroll) tableProps.scroll = scroll
      delete tableProps.onChange
      delete tableProps.onExpand
      delete tableProps.onExpandedRowsChange
      return tableProps
    })
    /**
     * @Author      gx12358
     * @DateTime    2021/9/6
     * @lastTime    2021/9/6
     * @description 判断table是否是树形结构并将第一个改为原ant-table溢出隐藏结构
     */
    const hasTableTree = (data) => {
      if (data.some(item => item.children && item.children.length > 0)) {
        state.columns = state.columns.map((item, index) => {
          return index === 0 ? { ...item, hasTableTree: true } : item
        })
      }
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
    const changeTabelLoading = (loading) => {
      if (props.request) {
        state.tableLoading = loading
      }
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description change表格size
     */
    const changeTableSize = (key) => {
      state.size = key
      emit('sizeChange', key)
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 表格列设置-是否展示
     */
    const onColumnsChange = (info) => {
      const columns: any = []
      if (isArray(info)) {
        originColums.map(item => {
          info.map(el => {
            if (el.uuid === item.uuid) {
              const record = cloneDeep(item)
              switch (el.fixType) {
                case 'fixedLeft':
                  record.fixed = 'left'
                  break
                case 'fixedRight':
                  record.fixed = 'right'
                  break
                default:
                  record.fixed = undefined
                  break
              }
              columns.push(record)
            }
            return el
          })
          return item
        })
        state.columns = cloneDeep(columns)
        state.actionColums = state.actionColums.map(item => {
          item.checked = info.map(el => el.uuid).includes(item.uuid)
          return item
        })
        emit('columnsStateChange', cloneDeep(state.actionColums))
      }
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 表格列设置-拖拽
     */
    const onColumnsDrop = (info) => {
      const columns: any = []
      info.map(item => {
        const columsItem = cloneDeep(originColums).find(el => el.uuid === item.uuid)
        if (columsItem) {
          switch (item.fixType) {
            case 'fixedLeft':
              columsItem.fixed = 'left'
              break
            case 'fixedRight':
              columsItem.fixed = 'right'
              break
            default:
              columsItem.fixed = undefined
              break
          }
          columns.push(columsItem)
        }
        return item
      })
      state.columns = cloneDeep(columns)
      state.actionColums = cloneDeep(columns)
      emit('columnsStateChange', cloneDeep(state.actionColums))
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 表格列设置-是否固定
     */
    const onChangeFixedColums = (info) => {
      let leftColumns: any = []
      let noColumns: any = []
      let rightColumns: any = []
      const columns: any = []
      info.map(item => {
        const columsItem = cloneDeep(originColums).find(el => el.uuid === item.uuid)
        if (columsItem) columns.push(columsItem)
        return item
      })
      columns.map(item => {
        info.map(el => {
          if (el.uuid === item.uuid) {
            const record = cloneDeep(item)
            switch (el.fixType) {
              case 'fixedLeft':
                leftColumns.push(cloneDeep(record))
                break
              case 'fixedRight':
                rightColumns.push(cloneDeep(record))
                break
              default:
                noColumns.push(cloneDeep(record))
                break
            }
          }
        })
        return item
      })
      leftColumns = leftColumns.map(item => {
        return {
          ...item,
          fixed: 'left'
        }
      })
      noColumns = noColumns.map(item => {
        return {
          ...item,
          fixed: undefined
        }
      })
      rightColumns = rightColumns.map(item => {
        return {
          ...item,
          fixed: 'right'
        }
      })
      state.columns = cloneDeep([ ...leftColumns, ...noColumns, ...rightColumns ])
      state.actionColums = state.actionColums.map(item => {
        info.map(el => {
          if (el.uuid === item.uuid) item.fixType = el.fixType
        })
        return item
      })
      emit('columnsStateChange', cloneDeep(state.actionColums))
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 表格列设置-重置
     */
    const onResetColums = () => {
      handleChanheColums()
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
            clearInterval(pollingSetTimeRef.value)
            await tableLoadData({ params: props.params })
            props.polling && useDebounceFn(props.polling, { params: props.params })
          }
        } else {
          clearInterval(pollingSetTimeRef.value)
          await tableLoadData({ params })
          props.polling && useDebounceFn(props.polling, { params })
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
      if (props.request) {
        clearInterval(pollingSetTimeRef.value)
        await tableLoadData({ pagination, filters, sorter })
        props.polling && useDebounceFn(props.polling, { pagination, filters, sorter })
      } else {
        emit('change', pagination, filters, sorter)
      }
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
        clearInterval(pollingSetTimeRef.value)
        await tableLoadData()
        props.polling && useDebounceFn(props.polling)
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
    const toolBarLeft = () => (
      <div
        class={styles[`${tableClassName}-list-toolbar-left`]}
        style={{ ...toolBarItemStyle.value, flexWrap: 'wrap' }}
      >
        <div
          class={styles[`${tableClassName}-list-toolbar-title`]}
          style={innerWidth.value < 992 ? { width: '100%' } : undefined}
        >
          {
            props.headerTitle
              ? typeof props.headerTitle === 'string'
                ? props.headerTitle
                : props.headerTitle()
              : slots.headerTitle
                ? slots.headerTitle()
                : null
          }
          {
            props.titleTip || props.titleTip === '' ?
              <span class={styles[`${tableClassName}-list-toolbar-tip-icon`]}>
                <a-tooltip title={props.titleTipText}>
                  {
                    props.titleTip ?
                      props.titleTip()
                      :
                      slots.titleTip ?
                        slots.titleTip()
                        : <InfoCircleOutlined />
                  }
                </a-tooltip>
              </span>
              :
              null
          }
        </div>
        {
          props.toolBarBtn && props.toolBarBtn.length > 0 ?
            <div
              class={styles[`${tableClassName}-list-toolbar-btns`]}
              style={innerWidth.value < 992 ? {
                width: '100%',
                marginTop: '16px',
                marginLeft: 0
              } : undefined}
            >
              <a-space>
                {
                  props.toolBarBtn.map(item => item())
                }
              </a-space>
            </div>
            :
            slots.toolBarBtn ?
              <div
                class={styles[`${tableClassName}-list-toolbar-btns`]}
                style={innerWidth.value < 992 ? {
                  width: '100%',
                  marginTop: '16px',
                  marginLeft: 0
                } : undefined}
              >
                <a-space>
                  {
                    slots.toolBarBtn()
                  }
                </a-space>
              </div>
              :
              null
        }
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
                  changeProps.value.loading ?
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
              size={state.size}
              class={styles[`${tableClassName}-list-toolbar-setting-items`]}
              onInput={changeTableSize}
            />
            :
            null
        }
        {
          state.options.setting ?
            <ActionColumns
              columns={state.actionColums}
              scroll={changeProps.value.scroll || false}
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
    return () => (
      <div
        id={state.tableId}
        ref={e => state.table = e}
        style={props.tableStyle || null}
        class={
          {
            [`${styles[tableClassName]}`]: true,
            [`${props.tableClassName}`]: props.tableClassName,
            [`${styles[`${tableClassName}-no-scroll`]}`]: !changeProps.value.scroll,
            [`${styles[`${tableClassName}-has-table-tree`]}`]: state.columns.some(item => item.hasTableTree)
          }
        }
      >
        {
          props.search ?
            <TableSearch
              {...props.search}
              loading={props.request ? state.tableLoading : changeProps.value.loading}
              data={
                props.search.type === 'dataSouce' || props.search.type === 'columns' ?
                  state.searchData
                  :
                  slots.search ?
                    slots.search() : null
              }
              onTableSearch={changeTableParams}
            />
            :
            null
        }
        {
          handleShowProTool() ?
            <div
              style={toolBarStyle.value}
              class={styles[`${tableClassName}-list-toolbar`]}
            >
              {toolBarLeft()}
              {Object.keys(state.options).length > 0 ? toolBarRight() : null}
            </div>
            :
            null
        }
        <a-config-provider renderEmpty={defaultEmpty}>
          <a-table
            key={state.tableKey}
            {...changeProps.value}
            size={state.size}
            dataSource={props.request ? state.dataSource : changeProps.value.dataSource}
            loading={props.request ? state.tableLoading : changeProps.value.loading}
            pagination={props.showPagination ? props.request ? state.pagination : changeProps.value.pagination : false}
            columns={state.columns}
            components={components}
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
})
export default WProTable
