import type { ExtractPropTypes } from 'vue'
import {
  defineComponent,
  ref,
  toRef,
  unref,
  toRaw,
  onMounted,
  computed,
  onUnmounted,
  watchEffect,
  isVNode
} from 'vue'
import { cloneDeep, omit } from 'lodash-es'
import { useFullscreen } from '@vueuse/core'
import { Table, Grid, Spin, Pagination, Typography, TableProps } from 'ant-design-vue'
import Nodata from '@/assets/public_images/nodata.png'
import type { PaginationProps } from 'ant-design-vue/lib/pagination'
import { getPrefixCls, getSlotVNode } from '@gx-admin/utils'
import { warning } from '@gx-design/utils'
import { isObject } from '@sirpho/utils/validate'
import { getRandomNumber, handleTableField } from '@sirpho/utils'
import type { ProTablePaginationConfig, OptionConfig } from './types/table'
import type { ProColumns } from './types/column'
import { useLoading } from './hooks/useLoading'
import { useTableSize } from './hooks/useTableSize'
import { usePagination } from './hooks/usePagination'
import { useRowSelection } from './hooks/useRowSelection'
import { useFetchData, useConfigFetchData } from './hooks/useFetchData'
import { useTableForm } from './hooks/useTableForm'
import { useColumnSetting } from './hooks/useColumnSetting'
import { useColumns, useConfigColumns } from './hooks/useColumns'
import { useTableScroll, useConfigScroll } from './hooks/useTableScroll'
import { provideTableContext } from './context/TableContext'
import Form from './components/Form'
import Toolbar from './components/ToolBar'
import OverflowTooltip from './components/OverflowTooltip'
import { proTableProps } from './props'
import { proTableSlots, handleShowIndex } from './utils'

import './style.less'

export type ProTableProps = Partial<ExtractPropTypes<typeof proTableProps>>

const { useBreakpoint } = Grid

const defaultEmpty = (prefixCls: string) => (
  <div class={prefixCls}>
    <img style={{ width: '150px' }} src={Nodata} alt="" />
    <p class="text-hex-666666 text-base-15px">暂时没有数据哦~</p>
  </div>
)
const defaultOptions: OptionConfig = {
  reload: true,
  density: false,
  setting: true,
  fullScreen: true
}
const GProTable = defineComponent({
  name: 'GProTable',
  props: proTableProps,
  emits: [
    'reset',
    'reload',
    'submit',
    'sizeChange',
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
      suffixCls: 'table',
      isPor: true
    })
    const screens = useBreakpoint()

    const innerWidth = ref<number>(window.innerWidth)
    const tableRef = ref<any>()
    const formRef = ref<any>()

    const { toggle, isFullscreen } = useFullscreen(tableRef)

    const getProps = computed<ProTableProps>(() => {
      return { ...props }
    })

    const needVirtualScroll = computed(() => {
      if (props.virtualScroll) {
        warning(!props.scroll?.y, '参数scroll的Y值不能为空！')
      }
      return props.scroll?.y && props.virtualScroll
    })

    const cacheColumns = computed(() => {
      // @ts-ignore
      const columnsList: ProColumns = (props.columns || []).map((item: any) => {
        return {
          ...item,
          key: item.key || (item.dataIndex as string),
          align: item.align || props.align,
          // 不使用antd自带的ellipsis功能，采用自定义的overflow-tooltip组件实现
          ellipsis: false,
          tooltip: item.tooltip === false ? false : item.tooltip || props.tooltip,
          overflowLine: item.overflowLine || props.overflowLine,
          uuid: getRandomNumber().uuid(15)
        }
      })
      return handleShowIndex(columnsList, {
        align: props.align,
        showIndex: props.showIndex
      })
    })

    /**
     * @description Table-loading hooks 方法
     */
    const { getLoading, setLoading } = useLoading({
      emit,
      loading: toRef(props, 'loading')
    })

    /**
     * @description Table-size hooks 方法
     */
    const { sizeRef, setTableSize } = useTableSize({ emit, size: toRef(props, 'size') })

    /**
     * @description Table-pagination hooks 方法
     */
    const { getPaginationInfo, setPagination } = usePagination({
      slots,
      props: getProps,
      pagination: toRef(props, 'pagination')
    })

    /**
     * @description Table-scroll hooks 方法
     */
    const configScroll = useConfigScroll(props)
    const { getScrollRef, breakpoint } = useTableScroll({
      ...configScroll,
      innerWidth,
      columns: cacheColumns,
      screensRef: screens
    })

    /**
     * @description Table-columns hooks 方法
     */
    const configColumns = useConfigColumns(props)
    const { getProColumns, cacheProColumns, setColumns, changeColumns, resizeColumnWidth } =
      useColumns({
        ...configColumns,
        breakpoint,
        scroll: getScrollRef,
        columns: cacheColumns
      })

    /**
     * @description Table-settingColumns hooks 方法
     */
    const {
      columnsMap,
      operationType,
      setColumnsMap,
      sortKeyColumns,
      cacheColumnsMap,
      setSortKeyColumns
    } = useColumnSetting({
      columns: cacheProColumns,
      columnsState: toRef(props, 'columnsState'),
      changeColumns
    })

    /**
     * @description Table-Form(搜索) hooks 方法
     */
    const { formDataRef, formParamsRef, defaultParamsRef, setFormParams } = useTableForm({
      search: toRef(props, 'search'),
      searchMap: toRef(props, 'searchMap'),
      params: toRef(props, 'params'),
      columns: cacheColumns
    })

    const { selectedKey, changeRowKey, selectRowKey, selectAllRowKey, removeRowKeys, clearRowKey } =
      useRowSelection(toRef(props, 'rowKey'), toRef(props, 'rowSelection'))

    /**
     * @description Table-datasource hooks 方法
     */
    const configFetchData = useConfigFetchData(props)
    const {
      reload,
      reSetDataList,
      changeDataValue,
      isTreeDataRef,
      getDataSourceRef,
      handleTableChange
    } = useFetchData(
      { ...configFetchData },
      {
        getLoading,
        getPaginationInfo,
        setPagination,
        removeRowKeys,
        setLoading,
        setColumns,
        columns: getProColumns,
        formParamsRef,
        beforeSearchSubmit: props.beforeSearchSubmit
      },
      emit,
      props.afterRequest
    )

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

    /**
     * @description 获取pro-table内部方法
     */
    const getProTable = () => {
      props.actionRef({
        formRef,
        formParams: unref(formParamsRef),
        pageParams: getPaginationInfo.value,
        reload: (info) => reload(info),
        reloadAndRest: () => reload({ current: 1, pageSize: 10 }),
        reSetDataList,
        changePageInfo: (pagination, filters, sorter) => changePage(pagination, filters, sorter),
        changeDataValue: ({ key, value }) => changeDataValue({ key, value }),
        loadingOperation: (loading) => setLoading(loading)
      })
    }

    watchEffect(() => {
      if (props.actionRef) getProTable()
    })

    onMounted(() => {
      window.addEventListener('resize', getWidth)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', getWidth)
    })

    /**
     * @description 监听屏幕宽度
     */
    const getWidth = () => {
      innerWidth.value = window.innerWidth
    }

    /**
     * @description 表格属性自适应
     */
    const getBindValues = computed(() => {
      const dataSource = unref(getDataSourceRef)
      let propsData: TableProps & {
        virtualScroll?: boolean
      } = {
        ...attrs,
        ...props,
        virtualScroll: needVirtualScroll.value,
        size: unref(sizeRef),
        scroll: unref(getScrollRef),
        loading: !!unref(getLoading),
        columns: toRaw(
          unref(getProColumns).filter((column) => column.show || column.show === undefined)
        ),
        pagination: toRaw(unref(getPaginationInfo)) as TableProps['pagination'],
        dataSource
      }

      propsData = omit(propsData, ['class', 'onChange', 'onExpand', 'onExpandedRowsChange'])
      return propsData
    })
    const proTableClassNames = computed(() => [
      {
        [`${baseClassName}`]: true,
        [`${attrs.class}`]: attrs.class,
        [`${props.tableClassName}`]: props.tableClassName,
        [`${baseClassName}-no-scroll`]: !Object.keys(getBindValues.value?.scroll || {}).length,
        [`${baseClassName}-table-tree`]: isTreeDataRef.value,
        [`${baseClassName}-full-screen`]: isFullscreen.value
      }
    ])

    provideTableContext({
      tableSize: sizeRef,
      columns: getProColumns,
      cacheColumns,
      action: {
        setTableSize,
        reload: (info) => reload(info),
        toggle
      },
      settingsAction: {
        autoScroll: toRef(props, 'autoScroll'),
        columnsMap,
        operationType,
        setColumnsMap,
        sortKeyColumns,
        cacheColumnsMap,
        setSortKeyColumns
      },
      changeColumns,
      slots
    })

    const handleSlots = (children) => {
      const tableSlots = {}
      Object.keys(children).map((item) => {
        if (!proTableSlots.includes(item)) {
          tableSlots[item] = children[item]
        }
        return item
      })
      return tableSlots
    }

    const handlePagePosition = computed(() => {
      const defaultPosition = unref(getProps).direction === 'rtl' ? 'left' : 'right'
      let position = (unref(getPaginationInfo) as ProTablePaginationConfig)?.position
      if (position !== null && Array.isArray(position)) {
        const topPos = position.find((p) => p.indexOf('top') !== -1)
        const bottomPos = position.find((p) => p.indexOf('bottom') !== -1)
        const isDisable = position.every((p) => `${p}` === 'none')
        if (!topPos && !bottomPos && !isDisable) {
          position = defaultPosition
        }
        if (topPos) {
          position = topPos!.toLowerCase().replace('top', '')
        }
        if (bottomPos) {
          position = bottomPos!.toLowerCase().replace('bottom', '')
        }
      } else {
        position = defaultPosition
      }
      return position
    })

    const handleTableSearch = (params: RecordType) => {
      clearRowKey()
      if (props.search.showSearch === false) {
        setFormParams(params)
      } else {
        setFormParams({ ...params, ...((props.params || {}) as RecordType) })
        setPagination({
          current: 1
        })
        reload()
      }
    }

    const handleTableSubmit = (params: RecordType, reset?: boolean) => {
      reset ? emit('reset', params) : emit('submit', params)
      props.request && handleTableSearch(params)
    }
    /**
     * @description ant-table原始方法
     */
    const changePage = async (pagination: Partial<PaginationProps>, filters, sorter) => {
      setPagination({
        current: pagination.current,
        pageSize: pagination.pageSize
      })
      clearRowKey()
      handleTableChange(pagination, filters, sorter)
    }

    const handleChangePage = (page, pageSize) => {
      setPagination({
        current: page,
        pageSize: pageSize
      })
      handleTableChange(
        {
          current: page,
          pageSize: pageSize,
          total: unref(getPaginationInfo)['total'] || (0 as number)
        },
        false,
        false
      )
    }

    const expandedRowsChange = (expandedRows) => {
      emit('expandedRowsChange', expandedRows)
    }
    const expand = (expanded, record) => {
      emit('expand', expanded, record)
    }
    const handleResizeColumn = (w, col) => resizeColumnWidth(w, col)

    /**
     * @description 表格字段溢出提示
     */
    const tooltipSlot = (value, success, record) => {
      let show = value
      const content = record.tooltip ? (
        <OverflowTooltip overflowLine={record.overflowLine} title={value}>
          {value}
        </OverflowTooltip>
      ) : (
        value
      )
      if (success) {
        if (record.copyable && value && value.length > 0) {
          show = (
            <Typography.Paragraph
              class={`${baseClassName}-copyable`}
              style={{ margin: '0', width: '100%', padding: '0' }}
              copyable
            >
              {content}
            </Typography.Paragraph>
          )
        } else {
          show = content
        }
      }

      return show
    }

    const toolbarDom = (headerTitle, toolBarBtn, titleTip) => (
      <Toolbar
        headerTitle={headerTitle}
        titleTip={titleTip}
        titleTipText={props.titleTipText}
        options={unref(getOptionsRef)}
        settingExtra={getSlotVNode(slots, props, 'settingExtra')}
        optionsExtra={getSlotVNode(slots, props, 'optionsExtra')}
        toolBarBtn={toolBarBtn}
      />
    )

    return () => {
      const headerTitleRender = getSlotVNode(slots, props, 'headerTitle')
      const titleTipRender = getSlotVNode(slots, props, 'titleTip')
      const toolBarBtnRender = getSlotVNode(slots, props, 'toolBarBtn')
      const customizeRender = getSlotVNode(slots, props, 'customize')

      return (
        <div
          ref={(e) => (tableRef.value = e)}
          style={props.tableStyle || null}
          class={proTableClassNames.value}
        >
          <div class="gx-pro-table-content">
            {(!!formDataRef.value.length || !!slots.search?.()) && (
              <Form
                ref={(e) => (formRef.value = e)}
                search={props.search}
                modal={props.modalScroll}
                searchMap={formDataRef.value}
                prefixCls={baseClassName}
                loading={!!unref(getLoading)}
                onSearch={handleTableSubmit}
                onCollapse={() => {
                  props.search?.onCollapse?.()
                }}
                defaultParams={defaultParamsRef}
                v-slots={{
                  default: () => slots.search?.()
                }}
              />
            )}
            {!needVirtualScroll.value &&
              toolbarDom(headerTitleRender, toolBarBtnRender, titleTipRender)}
            {customizeRender ? (
              <Spin spinning={!!unref(getLoading)}>
                {props.customize
                  ? props.customize(unref(getDataSourceRef))
                  : slots.customize(unref(getDataSourceRef))}
                {unref(getDataSourceRef).length > 0 && props.pagination !== false && (
                  <Pagination
                    class={{
                      ['ant-table-pagination']: true,
                      [`ant-table-pagination-${handlePagePosition.value}`]: handlePagePosition.value
                    }}
                    {...toRaw(unref(getPaginationInfo))}
                    onChange={handleChangePage}
                  />
                )}
              </Spin>
            ) : (
              <Table
                {...getBindValues.value}
                rowKey={(record) => record[props.rowKey || 'sortIndex']}
                transformCellText={({ text, column }) => {
                  let isVNodeCell = false
                  if (Array.isArray(text) && text.length > 0) {
                    isVNodeCell = isVNode(text[0])
                  } else {
                    isVNodeCell = isVNode(text)
                  }
                  if (isVNodeCell) return text
                  const { value, success } = handleTableField(
                    text,
                    (column as any)?.columnEmptyText || props?.columnEmptyText
                  )
                  return (column as any)?.tooltip || (column as any)?.copyable
                    ? tooltipSlot(value, success, column as ProColumns)
                    : value
                }}
                rowSelection={
                  props.rowSelection
                    ? {
                        ...omit(
                          props.rowSelection,
                          'onSelect',
                          'onSelectAll',
                          'onChange',
                          'selectedRowKeys'
                        ),
                        selectedRowKeys: selectedKey.value,
                        onSelect: selectRowKey,
                        onSelectAll: selectAllRowKey,
                        onChange: changeRowKey
                      }
                    : undefined
                }
                onChange={changePage}
                onExpandedRowsChange={expandedRowsChange}
                onExpand={expand}
                onResizeColumn={handleResizeColumn}
                v-slots={{
                  emptyText: () => defaultEmpty(`${baseClassName}-empty`),
                  ...handleSlots(slots)
                }}
              />
            )}
          </div>
        </div>
      )
    }
  }
})

export default GProTable
