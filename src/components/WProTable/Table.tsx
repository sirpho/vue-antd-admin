import {
  defineComponent,
  reactive,
  ref,
  unref,
  toRaw,
  onMounted,
  computed,
  Ref,
  ExtractPropTypes,
  CSSProperties
} from 'vue'
import { Grid } from 'ant-design-vue'
import { cloneDeep, omit } from 'lodash-es'
import {
  LoadingOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue'
import Nodata from '/@/assets/public_image/nodata.png'
import DraggableResizable from '/@/components/DraggableResizable'
import { hanndleField, isBoolean, isObject } from '/@/utils/util'
import { getPrefixCls, getPropsSlot } from '/@/components/_util'
import type { OptionConfig } from './types/table'
import { useLoading } from './hooks/useLoading'
import { useTableSize } from './hooks/useTableSize'
import { useColumns } from './hooks/useColums'
import { usePagination } from './hooks/usePagination'
import { useTableScroll } from './hooks/useTableScroll'
import { useFetchData } from './hooks/useFetchData'
import { useTableForm } from './hooks/useTableForm'
import { proTableProps } from './props'
import { proTableSlots } from './utils'

import TableSearch from './components/TableSearch'
import ActionColumns from './components/ActionColumns'
import { ActionSize } from './components/ActionSize'

import styles from './style.module.less'

export type Breakpoint = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';

export type ProTableProps = Partial<ExtractPropTypes<typeof proTableProps>>;

const { useBreakpoint } = Grid

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
  emits: [
    'reset',
    'submit',
    'sizeChange',
    'refresh',
    'expandedRowsChange',
    'expand',
    'change',
    'requestError',
    'beforeSearchSubmit',
    'columnsStateChange',
    'loadingChange',
    'postData'
  ],
  setup(props, { emit, slots, attrs }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'table'
    })
    const draggingMap: Recordable = {}
    const screens = useBreakpoint()
    const tableRef = ref<any>()
    const fullScreen: Ref<boolean> = ref(false)
    const getProps = computed(() => {
      return { ...cloneDeep(props) } as ProTableProps
    })
    const propsColumnsRef = computed(() => cloneDeep(props.columns))
    const propsParamsRef = computed(() => cloneDeep(props.params))
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
    } = useColumns(getProps, propsColumnsRef, screens, emit)
    const {
      getFormParamsRef,
      getFormDataRef,
      setFormParams
    } = useTableForm(
      getProps,
      {
        propsParamsRef
      }
    )
    const {
      reload,
      isTreeDataRef,
      getDataSourceRef,
      handleTableChange
    } = useFetchData(
      getProps,
      {
        getLoading,
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
      screens,
      getColumnsRef
    )
    const getActionsList = computed(() => unref(getActionColumsRef))
    const getOptionsRef = computed(() => {
      if (props.options) {
        const propsOptions = cloneDeep(isObject(props.options) ? props.options : {})
        return {
          ...defaultOptions,
          ...propsOptions
        }
      }
      return {}
    })
    const state = reactive({
      draggingState: draggingMap
    })
    unref(getViewColumns).forEach(col => {
      if (col.dataIndex && col.key) draggingMap[col.dataIndex || col.key] = col.width
    })
    onMounted(() => {
      if (props.actionRef) getProTable()
    })
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
        reloadAndRest: () => reload({ current: 1, pageSize: 10 })
      })
    }
    const toolBarStyle = computed(() => {
      const style: CSSProperties = props.search ? { paddingTop: '0' } : {}
      if (!screens.value.lg) style.flexWrap = 'wrap'
      return style
    })
    const toolBarItemStyle = computed(() => {
      if (!screens.value.lg) return {
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
    const proTableClassNames = computed(() => [
      {
        [`${attrs.class}`]: attrs.class,
        [`${styles[baseClassName]}`]: true,
        [`${props.baseClassName}`]: props.baseClassName,
        [`${styles[`${baseClassName}-no-scroll`]}`]: !getBindValues.value.scroll,
        [`${styles[`${baseClassName}-has-table-tree`]}`]: isTreeDataRef.value,
        [`wd-pro-table-full-screen`]: fullScreen.value
      }
    ])
    const handleSlots = (children) => {
      const tableSlots = {}
      Object.keys(children).map(item => {
        if (!proTableSlots.includes(item)) {
          tableSlots[item] = children[item]
        }
        return item
      })
      return tableSlots
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 表格列设置-是否展示
     */
    const onColumnsChange = (data) => {
      setActionColumns(data, 'visible')
      emit('columnsStateChange')
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 表格列设置-拖拽
     */
    const onColumnsDrop = (data) => {
      setActionColumns(data, 'drop')
      emit('columnsStateChange')
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 表格列设置-是否固定
     */
    const onChangeFixedColums = (data) => {
      setActionColumns(data, 'fixed')
      emit('columnsStateChange')
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 表格列设置-重置
     */
    const onResetColums = () => {
      reSetColumns()
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 切换全屏
     */
    const handleFullScreen = () => {
      fullScreen.value = !fullScreen.value
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/21
     * @lastTime    2021/7/21
     * @description 判断是否展示头部
     */
    const handleShowProTool = () => {
      return Object.keys(getOptionsRef.value).length > 0 ||
        slots.headerTitle ||
        props.headerTitle ||
        props.titleTip ||
        (props.toolBarBtn && props.toolBarBtn.length > 0)
    }
    const changeTableParams = async (params, reset) => {
      if (reset) {
        emit('reset', props.search.type === 'slots' ? undefined : params)
        if (props.request) {
          setFormParams(params)
        }
      } else if (props.request) {
        emit('submit', params)
        if (props.search.showSearch) {
          setFormParams(params)
          reload()
        } else {
          setFormParams(params)
        }
      } else {
        emit('submit', params)
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
        reload()
      } else {
        emit('refresh')
      }
    }
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
     * @description 表格字段溢出提示
     */
    const tooltipSlot = (value, success, record) => {
      let show = value
      const placement = record.align === 'center'
        ? 'top'
        : record.align === 'left' || !record.align
          ? 'topLeft'
          : 'topRight'
      if (success && record.copyable) {
        show =
          <a-typography-paragraph style={{ margin: '0', width: '100%', padding: '0' }} copyable>
            <a-tooltip title={value} placement={placement}>
              <div class={styles[`${baseClassName}-ellipsis`]}>
                {value}
              </div>
            </a-tooltip>
          </a-typography-paragraph>
      } else if (success && !record.copyable) {
        show = <a-tooltip title={value} placement={placement}>
          {
            isTreeDataRef.value
              ? value
              : (
                <div class={styles[`${baseClassName}-ellipsis`]}>
                  {value}
                </div>
              )
          }
        </a-tooltip>
      }
      return show
    }
    const toolBarLeft = (dom: any, tipDom: any, toolbarDom: any) => (
      <div
        class={styles[`${baseClassName}-list-toolbar-left`]}
        style={{ ...toolBarItemStyle.value, flexWrap: 'wrap' }}
      >
        {(dom || tipDom) && (
          <div
            class={styles[`${baseClassName}-list-toolbar-title`]}
            style={screens.value.lg ? undefined : { width: '100%', marginRight: '0' }}
          >
            {dom}
            {tipDom && (
              <span class={styles[`${baseClassName}-list-toolbar-tip-icon`]}>
                <a-tooltip title={props.titleTipText}>
                  {
                    isBoolean(tipDom) && tipDom
                      ? <InfoCircleOutlined />
                      : tipDom
                  }
                </a-tooltip>
              </span>
            )}
          </div>
        )}
        {toolbarDom && (
          <div
            class={styles[`${baseClassName}-list-toolbar-btns`]}
            style={screens.value.lg
              ? undefined
              : {
                width: '100%',
                marginTop: '16px',
                marginLeft: 0
              }
            }
          >
            <a-space direction={screens.value.lg ? 'horizontal' : 'vertical'}>{toolbarDom}</a-space>
          </div>
        )}
      </div>
    )
    const toolBarRight = () => (
      <div
        class={styles[`${baseClassName}-list-toolbar-right`]}
        style={{ ...toolBarItemStyle.value }}
      >
        {getOptionsRef.value.reload && (
          <a-tooltip title="刷新">
            {
              typeof getOptionsRef.value.reload === 'function'
                ? getOptionsRef.value.reload()
                : getBindValues.value.loading
                  ? <LoadingOutlined class={styles[`${baseClassName}-list-toolbar-setting-items`]} />
                  : (
                    <ReloadOutlined
                      class={styles[`${baseClassName}-list-toolbar-setting-items`]}
                      onClick={refresh}
                    />
                  )
            }
          </a-tooltip>
        )}
        {getOptionsRef.value.density && (
          <ActionSize
            size={unref(getSize)}
            class={styles[`${baseClassName}-list-toolbar-setting-items`]}
            onInput={(size) => setSize(size)}
          />
        )}
        {getOptionsRef.value.setting && (
          <ActionColumns
            columns={unref(getActionsList)}
            scroll={getBindValues.value.scroll || false}
            class={styles[`${baseClassName}-list-toolbar-setting-items`]}
            onChange={onColumnsChange}
            onDrop={onColumnsDrop}
            onReset={onResetColums}
            onChangeFixed={onChangeFixedColums}
            v-slots={handleSlots(slots)}
          />
        )}
        {
          getOptionsRef.value.fullScreen
            ? typeof getOptionsRef.value.fullScreen === 'function'
              ? getOptionsRef.value.fullScreen()
              : (
                <a-tooltip title="全屏">
                  {
                    fullScreen.value
                      ? (
                        <FullscreenExitOutlined
                          class={styles[`${baseClassName}-list-toolbar-setting-items`]}
                          onClick={() => handleFullScreen()}
                        />
                      )
                      : (
                        <FullscreenOutlined
                          class={styles[`${baseClassName}-list-toolbar-setting-items`]}
                          onClick={() => handleFullScreen()}
                        />
                      )
                  }
                </a-tooltip>
              )
            : null
        }
      </div>
    )
    return () => {
      const headerTitleRender = getPropsSlot(slots, props, 'headerTitle')
      const titleTipRender = getPropsSlot(slots, props, 'titleTip')
      const toolBarBtnRender = getPropsSlot(slots, props, 'toolBarBtn')
      const tableSearchRender = slots.search?.()
      return (
        <div
          ref={e => tableRef.value = e}
          style={props.tableStyle || null}
          class={proTableClassNames.value}
        >
          <div class="wd-pro-table-content">
            {props.search && (
              <TableSearch
                {...props.search}
                loading={getBindValues.value.loading}
                searchData={getFormDataRef.value}
                onTableSearch={changeTableParams}
                v-slots={tableSearchRender}
              />
            )}
            {handleShowProTool() && (
              <div
                style={toolBarStyle.value}
                class={styles[`${baseClassName}-list-toolbar`]}
              >
                {(headerTitleRender || titleTipRender || toolBarBtnRender) && toolBarLeft(
                  headerTitleRender,
                  titleTipRender,
                  toolBarBtnRender
                )}
                {Object.keys(getOptionsRef.value).length > 0 ? toolBarRight() : null}
              </div>
            )}
            <a-config-provider renderEmpty={defaultEmpty}>
              <a-table
                {...getBindValues.value}
                components={{
                  header: {
                    cell: resizeableTitle
                  }
                }}
                transformCellText={({ text, column }) => {
                  const { value, success } = hanndleField(
                    text,
                    column.columnEmptyText || props.columnEmptyText
                  )
                  return column.ellipsis
                    ? tooltipSlot(value, success, column)
                    : value
                }}
                onChange={changePage}
                onExpandedRowsChange={expandedRowsChange}
                onExpand={expand}
                v-slots={handleSlots(slots)}
              />
            </a-config-provider>
          </div>
        </div>
      )
    }
  }
})

export default WProTable
