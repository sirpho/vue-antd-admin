import { computed, defineComponent, onMounted, onUnmounted, ref, toRaw, toRef, unref } from 'vue'
import { proTableProps } from '@gx-design/ProTable/props'
import { useTableSize } from '@gx-design/ProTable/hooks/useTableSize'
import { Table, Grid, TableProps } from 'ant-design-vue'
import { omit } from 'lodash-es'
import { useConfigScroll, useTableScroll } from '@gx-design/ProTable/hooks/useTableScroll'
import { ProColumns } from '@gx-design/ProTable/types/column'
import { getRandomNumber } from '@/utils/util'
import { handleShowIndex, proTableSlots } from '@gx-design/ProTable/utils'
import { useColumns, useConfigColumns } from '@gx-design/ProTable/hooks/useColumns'
import Nodata from '@/assets/public_images/nodata.png'

const { useBreakpoint } = Grid

const defaultEmpty = (prefixCls: string) => (
  <div class={prefixCls}>
    <img style={{ width: '150px' }} src={Nodata} alt="" />
    <p class="text-hex-666666 text-base-15px">暂时没有数据哦~</p>
  </div>
)

const TabsPaneTable = defineComponent({
  name: 'TabsPaneTable',
  props: proTableProps,
  setup(props, { emit, slots, attrs }) {
    const screens = useBreakpoint()

    const innerWidth = ref<number>(window.innerWidth)
    /**
     * @description 监听屏幕宽度
     */
    const getWidth = () => {
      innerWidth.value = window.innerWidth
    }

    onMounted(() => {
      window.addEventListener('resize', getWidth)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', getWidth)
    })

    const cacheColumns = computed(() => {
      const columnsList: ProColumns = (props.columns || []).map((item) => {
        return {
          ...item,
          key: item.key || (item.dataIndex as string),
          align: item.align || props.align,
          uuid: getRandomNumber().uuid(15)
        }
      })
      return handleShowIndex(columnsList, {
        align: props.align,
        showIndex: props.showIndex
      })
    })

    /**
     * @description Table-size hooks 方法
     */
    const { sizeRef } = useTableSize({ emit, size: toRef(props, 'size') })

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
    const { getProColumns } = useColumns({
      ...configColumns,
      breakpoint,
      scroll: getScrollRef,
      columns: cacheColumns
    })

    /**
     * @description 表格属性自适应
     */
    const getBindValues = computed(() => {
      const dataSource = unref(props.dataSource)
      let propsData: TableProps = {
        ...attrs,
        ...props,
        size: unref(sizeRef),
        scroll: unref(getScrollRef),
        columns: toRaw(
          unref(getProColumns).filter((column) => column.show || column.show === undefined)
        ),
        pagination: false,
        dataSource
      }

      propsData = omit(propsData, ['class', 'onChange', 'onExpand', 'onExpandedRowsChange'])
      return propsData
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

    return () => {
      return (
        <div class="tabs-pane-table-wrapper">
          <Table
            {...getBindValues.value}
            class="tabs-pane-table"
            rowKey={(record) => record[props.rowKey || 'sortIndex']}
            v-slots={{
              emptyText: () => defaultEmpty(`tabs-pane-table-empty`),
              ...handleSlots(slots)
            }}
          />
        </div>
      )
    }
  }
})

export default TabsPaneTable
