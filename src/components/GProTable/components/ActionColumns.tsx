import type { ExtractPropTypes } from 'vue'
import {
  defineComponent,
  reactive,
  watch,
  ref,
  computed,
  renderSlot,
  unref
} from 'vue'
import { cloneDeep } from 'lodash-es'
import {
  SettingOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined
} from '@ant-design/icons-vue'
import { PropTypes } from '/@/utils'

export interface ColumnsState {
  uuid?: string;
  dataIndex?: string;
  key?: string;
  title?: string;
  checked?: boolean;
  slots?: any;
  fixType?: 'nofixed' | 'fixedLeft' | 'fixedRight';
  children?: ColumnsState[];
}

const actionColumnsProps = {
  className: PropTypes.string,
  columns: {
    type: [ Array ] as PropType<ColumnsState[]>,
    default: () => []
  },
  scroll: {
    type: [ Object, Boolean ] as PropType<{
      x?: boolean | number | string;
      y?: boolean | number | string;
    } | boolean>
  }
}

export type ActionColumnsProps = Partial<ExtractPropTypes<typeof actionColumnsProps>>;

const ActionColumns = defineComponent({
  props: actionColumnsProps,
  setup(props, { emit, slots }) {
    const baseClassName = computed(() => `${props.className}-action-columns`)
    const actionRef = ref()
    const state = reactive({
      leftCheckedKeys: [] as string[],
      leftColumnsData: [] as ColumnsState[],
      rightCheckedKeys: [] as string[],
      rightColumnsData: [] as ColumnsState[],
      checkedKeys: [] as string[],
      columnsData: [] as ColumnsState[],
      treeCheckKeys: [] as string[],
      treeColumnsData: [] as ColumnsState[],
      fixType: [ 'nofixed' ]
    })
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 列初始化-将colums数据转为组件所需数据
     */
    const formatColumns = (columns) => {
      state.treeColumnsData = cloneDeep(columns).map((item, index) => {
        delete item.slots
        return {
          ...item,
          key: `0-${index}`,
          children: []
        }
      })
      // 不固定
      state.columnsData = state.treeColumnsData.filter(item => item.fixType === 'nofixed')
      state.checkedKeys = state.columnsData.filter(item => item.checked).map(item => item.key)
      if (state.columnsData.length === 0) {
        state.fixType = state.fixType.filter(item => item !== 'nofixed')
      } else {
        if (state.fixType.every(item => item !== 'nofixed')) state.fixType.push('nofixed')
      }
      // 固定在左侧
      state.leftColumnsData = state.treeColumnsData.filter(item => item.fixType === 'fixedLeft')
      state.leftCheckedKeys = state.leftColumnsData.filter(item => item.checked)
        .map(item => item.key)
      if (state.leftColumnsData.length === 0) {
        state.fixType = state.fixType.filter(item => item !== 'fixedLeft')
      } else {
        if (state.fixType.every(item => item !== 'fixedLeft')) state.fixType.push('fixedLeft')
      }
      // 固定在右侧
      state.rightColumnsData = state.treeColumnsData.filter(item => item.fixType === 'fixedRight')
      state.rightCheckedKeys = state.rightColumnsData.filter(item => item.checked)
        .map(item => item.key)
      if (state.rightColumnsData.length === 0) {
        state.fixType = state.fixType.filter(item => item !== 'fixedRight')
      } else {
        if (state.fixType.every(item => item !== 'fixedRight')) state.fixType.push('fixedRight')
      }
      state.treeCheckKeys = [
        ...state.leftCheckedKeys,
        ...state.checkedKeys,
        ...state.rightCheckedKeys
      ]
    }
    const checkAllRef = computed(() =>
      state.treeCheckKeys.length === state.treeColumnsData.length)
    const indeterminateRef = computed(() =>
      state.treeCheckKeys.length > 0 &&
      state.treeCheckKeys.length < state.treeColumnsData.length)
    watch(
      () => props.columns,
      (newVal, oldVal) => {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          formatColumns(newVal)
        }
      }, {
        deep: true,
        immediate: true
      }
    )
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 列全选或全取消
     */
    const onCheckAllChange = (e) => {
      if (e.target.checked) {
        state.leftCheckedKeys = state.leftColumnsData.map(item => item.key)
        state.checkedKeys = state.columnsData.map(item => item.key)
        state.rightCheckedKeys = state.rightColumnsData.map(item => item.key)
        state.treeCheckKeys = [
          ...state.leftCheckedKeys,
          ...state.checkedKeys,
          ...state.rightCheckedKeys
        ]
      } else {
        state.leftCheckedKeys = []
        state.checkedKeys = []
        state.rightCheckedKeys = []
        state.treeCheckKeys = []
      }
      changeColumns('change')
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 列拖拽
     */
    const popoverDrop = (info, type) => {
      if (info.dropToGap && info.dragNode && info.node) {
        const dropKey = info.node.eventKey
        const dragKey = info.dragNode.eventKey
        const dropPos = info.node.pos.split('-')
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
        const loop = (data, key, callback) => {
          data.forEach((item, index, arr) => {
            if (item.key === key) {
              return callback(item, index, arr)
            }
            if (item.children) {
              return loop(item.children, key, callback)
            }
          })
        }
        let data: any = []
        switch (type) {
          case 'fixedLeft':
            data = [ ...state.leftColumnsData ]
            break
          case 'nofixed':
            data = [ ...state.columnsData ]
            break
          case 'fixedRight':
            data = [ ...state.rightColumnsData ]
            break
        }
        let dragObj: any = {}
        loop(data, dragKey, (item, index, arr) => {
          arr.splice(index, 1)
          dragObj = item
        })
        if (
          (info.node.children || []).length > 0 &&
          info.node.expanded &&
          dropPosition === 1
        ) {
          loop(data, dropKey, (item) => {
            item.children = item.children || []
            item.children.unshift(dragObj)
          })
        } else {
          let ar: any = []
          let i = 0
          loop(data, dropKey, (_, index, arr) => {
            ar = arr
            i = index
          })
          if (dropPosition === -1) {
            ar.splice(i, 0, dragObj)
          } else {
            ar.splice(i + 1, 0, dragObj)
          }
        }
        switch (type) {
          case 'fixedLeft':
            state.leftColumnsData = data
            break
          case 'nofixed':
            state.columnsData = data
            break
          case 'fixedRight':
            state.rightColumnsData = data
            break
        }
        state.treeColumnsData = [
          ...state.leftColumnsData,
          ...state.columnsData,
          ...state.rightColumnsData
        ]
        changeColumns('drop')
      }
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 列点击checkbox
     */
    const popoverCheck = (info, type) => {
      switch (type) {
        case 'fixedLeft':
          state.leftCheckedKeys = info
          break
        case 'nofixed':
          state.checkedKeys = info

          break
        case 'fixedRight':
          state.rightCheckedKeys = info
          break
      }
      state.treeCheckKeys = [
        ...state.leftCheckedKeys,
        ...state.checkedKeys,
        ...state.rightCheckedKeys
      ]
      changeColumns('change')
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 列增加固定
     */
    const addFixed = (type, record, originType) => {
      if (state.fixType.every(item => item !== type)) state.fixType.push(type)
      switch (type) {
        case 'fixedLeft':
          const leftIds = [ ...state.leftColumnsData.map(item => item.uuid), record.uuid ]
          const leftColumnsData: any = []
          state.treeColumnsData.map(item => {
            if (leftIds.includes(item.uuid)) leftColumnsData.push(item)
            return item
          })
          state.leftColumnsData = leftColumnsData
          state.leftCheckedKeys = state.leftColumnsData.filter(item => item.checked)
            .map(item => item.key)
          break
        case 'fixedRight':
          const rightIds = [ ...state.rightColumnsData.map(item => item.uuid), record.uuid ]
          const rightColumnsData: any = []
          state.treeColumnsData.map(item => {
            if (rightIds.includes(item.uuid)) rightColumnsData.push(item)
            return item
          })
          state.rightColumnsData = rightColumnsData
          state.rightCheckedKeys = state.rightColumnsData.filter(item => item.checked)
            .map(item => item.key)
          break
      }
      switch (originType) {
        case 'fixedLeft':
          state.leftColumnsData = state.leftColumnsData.filter(item => item.uuid !== record.uuid)
          state.leftCheckedKeys = state.leftColumnsData.filter(item => item.checked)
            .map(item => item.key)
          if (state.leftColumnsData.length === 0) state.fixType = state.fixType.filter(item => item !== originType)
          break
        case 'nofixed':
          state.columnsData = state.columnsData.filter(item => item.uuid !== record.uuid)
          state.checkedKeys = state.columnsData.filter(item => item.checked).map(item => item.key)
          if (state.columnsData.length === 0) state.fixType = state.fixType.filter(item => item !== originType)
          break
        case 'fixedRight':
          state.rightColumnsData = state.rightColumnsData.filter(item => item.uuid !== record.uuid)
          state.rightCheckedKeys = state.rightColumnsData.filter(item => item.checked)
            .map(item => item.key)
          if (state.rightColumnsData.length === 0) state.fixType = state.fixType.filter(item => item !== originType)
          break
      }
      changeColumnsType()
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 列取消固定
     */
    const cancelFixed = (type, record) => {
      switch (type) {
        case 'fixedLeft':
          state.leftColumnsData = state.leftColumnsData.filter(item => item.uuid !== record.uuid)
          state.leftCheckedKeys = state.leftColumnsData.filter(item => item.checked)
            .map(item => item.key)
          if (state.leftColumnsData.length === 0) state.fixType = state.fixType.filter(item => item !== type)
          break
        case 'fixedRight':
          state.rightColumnsData = state.rightColumnsData.filter(item => item.uuid !== record.uuid)
          state.rightCheckedKeys = state.rightColumnsData.filter(item => item.checked)
            .map(item => item.key)
          if (state.rightColumnsData.length === 0) state.fixType = state.fixType.filter(item => item !== type)
          break
      }
      if (!state.fixType.includes('nofixed')) state.fixType.push('nofixed')
      const ids = [ ...state.columnsData.map(item => item.uuid), record.uuid ]
      const columnsData: any = []
      state.treeColumnsData.map(item => {
        if (ids.includes(item.uuid)) columnsData.push(item)
        return item
      })
      state.columnsData = columnsData
      state.checkedKeys = state.columnsData.filter(item => item.checked).map(item => item.key)
      changeColumnsType()
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 将列是否展示属性回调给父组件
     */
    const changeColumns = (type) => {
      const checkedColumns = state.treeColumnsData.filter(item => state.treeCheckKeys.includes(item.key))
      emit(type, checkedColumns)
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 将列是否固定属性回调给父组件
     */
    const changeColumnsType = () => {
      const leftIds = state.leftColumnsData.filter(item => state.leftCheckedKeys.includes(item.key))
        .map(item => item.uuid)
      const ids = state.columnsData.filter(item => state.checkedKeys.includes(item.key))
        .map(item => item.uuid)
      const rightIds = state.rightColumnsData.filter(item => state.rightCheckedKeys.includes(item.key))
        .map(item => item.uuid)
      const checkedColumns = state.treeColumnsData.map(item => {
        if (leftIds.includes(item.uuid)) item.fixType = 'fixedLeft'
        if (ids.includes(item.uuid)) item.fixType = 'nofixed'
        if (rightIds.includes(item.uuid)) item.fixType = 'fixedRight'
        return item
      })
      emit('changeFixed', checkedColumns)
    }

    const popoverTitle = () => (
      <div class={`${unref(baseClassName)}-popover-title`}>
        <div>
          <a-checkbox
            indeterminate={indeterminateRef.value}
            checked={checkAllRef.value}
            class={`${unref(baseClassName)}-popover-title-check`}
            onChange={onCheckAllChange}
          />
          列展示
        </div>
        <a-button type="link" size="small" onClick={() => emit('reset')}>重置</a-button>
      </div>
    )

    const treeTitleSlots = (record) => {
      const columnsItem: any = props.columns.find(item => item.uuid === record.uuid)
      return record.title || renderSlot(
        slots,
        'headerCell',
        {
          title: columnsItem.title,
          column: columnsItem
        },
        () => [ columnsItem.title as any ]
      )
    }

    const TreeTitle = (record, type) => (
      <div class={`${unref(baseClassName)}-list-item`}>
        <div style={{ flex: '1 1' }}>
          {treeTitleSlots(record)}
        </div>
        <span
          class={`${unref(baseClassName)}-list-item-actions`}
        >
          {type === 'nofixed' && (
            <span>
              <a-tooltip title="固定在列首">
                <VerticalAlignTopOutlined
                  onClick={() => addFixed('fixedLeft', record, type)}
                />
              </a-tooltip>
            </span>
          )}
          {(type === 'fixedLeft' || type === 'fixedRight') && (
            <span>
              <a-tooltip title="不固定">
                <VerticalAlignMiddleOutlined
                  onClick={() => cancelFixed(type, record)}
                />
              </a-tooltip>
            </span>
          )}
          {type === 'nofixed' && (
            <span>
              <a-tooltip title="固定在列尾">
                <VerticalAlignBottomOutlined
                  onClick={() => addFixed('fixedRight', record, type)}
                />
              </a-tooltip>
            </span>
          )}
        </span>
      </div>
    )

    const popoverContent = () => {
      return (
        <>
          {state.fixType.includes('fixedLeft') && (
            <>
              <div class={`${unref(baseClassName)}-list-group`}>
                固定在左侧
              </div>
              <a-tree
                draggable
                checkable
                checkedKeys={state.leftCheckedKeys}
                tree-data={state.leftColumnsData}
                style={{ width: '100%' }}
                onDrop={info => popoverDrop(info, 'fixedLeft')}
                onCheck={info => popoverCheck(info, 'fixedLeft')}
                v-slots={{
                  title: (e) => TreeTitle(e, 'fixedLeft')
                }}
              />
            </>
          )}
          {state.fixType.includes('nofixed') && (
            <>
              {
                (state.fixType.includes('fixedLeft') || state.fixType.includes('fixedRight')) && (
                  <div class={`${unref(baseClassName)}-list-group`}>
                    不固定
                  </div>
                )}
              <a-tree
                draggable
                checkable
                checkedKeys={state.checkedKeys}
                tree-data={state.columnsData}
                style={{ width: '100%' }}
                onDrop={info => popoverDrop(info, 'nofixed')}
                onCheck={info => popoverCheck(info, 'nofixed')}
                v-slots={{
                  title: (e) => TreeTitle(e, 'nofixed')
                }}
              />
            </>
          )}
          {state.fixType.includes('fixedRight') && (
            <>
              <div class={`${unref(baseClassName)}-list-group`}>
                固定在右侧
              </div>
              <a-tree
                draggable
                checkable
                checkedKeys={state.rightCheckedKeys}
                tree-data={state.rightColumnsData}
                style={{ width: '100%' }}
                onDrop={info => popoverDrop(info, 'fixedRight')}
                onCheck={info => popoverCheck(info, 'fixedRight')}
                v-slots={{
                  title: (e) => TreeTitle(e, 'fixedRight')
                }}
              />
            </>
          )}
        </>
      )
    }

    return () => (
      <div class={`${unref(baseClassName)}`} ref={e => actionRef.value = e}>
        <a-popover
          title={popoverTitle()}
          content={popoverContent()}
          placement="bottomRight"
          trigger="click"
          get-popup-container={() => actionRef.value}
        >
          <a-tooltip title="列配置">
            <SettingOutlined />
          </a-tooltip>
        </a-popover>
      </div>
    )
  }
})

export default ActionColumns
