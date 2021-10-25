import { ComputedRef, unref, computed, ref, Ref, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { ProTableProps } from '@wd-pro/pro-table'
import type { ProColumns } from '../types/column'
import { getRandomNumber, isArray } from '/@/utils/util'

interface ActionColums extends ProColumns {
  fixType?: string;
}

export function useColumns(
  propsRef: ComputedRef<ProTableProps>,
  innerWidth: Ref<number>,
  emit: EmitType
) {
  const columnsRef = ref(unref(propsRef).columns) as unknown as Ref<ProColumns[]>
  const actionColumsRef = ref(unref(propsRef).columns) as unknown as Ref<ActionColums[]>
  let cacheColumns = unref(propsRef).columns

  const getColumnsRef = computed(() => {
    const columns = cloneDeep(unref(columnsRef))

    if (!columns) {
      return []
    }
    return columns
  })

  const getActionColumsRef = computed(() => {
    const columns = cloneDeep(unref(actionColumsRef))
    cloneDeep(handleActionColumn(propsRef, innerWidth, columns, cacheColumns))
    return columns
  })

  const getViewColumns = computed(() => {
    const viewColumns = unref(getColumnsRef)

    const columns = cloneDeep(viewColumns)

    cloneDeep(handleActionColumn(propsRef, innerWidth, columns, cacheColumns))

    return columns
      .filter((column) => column.checked || column.checked === undefined)
  })

  watch(
    () => unref(propsRef).columns,
    (columns) => {
      const newColumns = cloneDeep(columns).map(column => {
        return {
          ...column,
          align: column.align || unref(propsRef).align,
          uuid: getRandomNumber().uuid(15)
        }
      })
      if (unref(propsRef).showIndex) handleShowIndex(propsRef, newColumns)
      cacheColumns = cloneDeep(newColumns)
      columnsRef.value = cloneDeep(newColumns)
      actionColumsRef.value = cloneDeep(newColumns)
    }, {
      deep: true,
      immediate: true
    }
  )

  function setColumns(columnList: Partial<ProColumns>[]) {
    const columns: Partial<ProColumns>[] = []
    if (!isArray(columns)) return

    if (columnList.length <= 0) {
      columnsRef.value = []
      return
    }

    columnsRef.value = cloneDeep(columnList)
  }

  function setActionColumns(columnList: Partial<ActionColums>[] | string[], type) {
    const columns: Partial<ProColumns>[] = []
    if (!isArray(columnList)) return

    if (columnList.length <= 0) {
      columnsRef.value = []
      return
    }

    switch (type) {
      case 'visible':
        unref(cacheColumns).map(item => {
          columnList.map(el => {
            if (el.uuid === item.uuid) {
              const record: Partial<ProColumns> = cloneDeep(item)
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
        columnsRef.value = columns
        actionColumsRef.value = actionColumsRef.value.map(item => {
          item.checked = columnList.map(el => el.uuid).includes(item.uuid)
          return item
        })
        break
      case 'drop':
        columnList.map(item => {
          const columsItem = unref(cacheColumns).find(el => el.uuid === item.uuid)
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
        columnsRef.value = columns
        actionColumsRef.value = columns
        break
      case 'fixed':
        columnList.map(item => {
          const columsItem = unref(cacheColumns).find(el => el.uuid === item.uuid)
          if (columsItem) columns.push(columsItem)
          return item
        })
        columnsRef.value = sortFixedColumn(columns, columnList)
        actionColumsRef.value = actionColumsRef.value.map(item => {
          columnList.map(el => {
            if (el.uuid === item.uuid) item.fixType = el.fixType
          })
          return item
        })
        break
    }
    emit('columnsStateChange', cloneDeep(actionColumsRef.value))
  }

  function reSetColumns() {
    columnsRef.value = unref(cacheColumns)
    actionColumsRef.value = unref(cacheColumns)
  }

  function getCacheColumns() {
    return cacheColumns
  }

  return {
    getColumnsRef,
    getActionColumsRef,
    getViewColumns,
    getCacheColumns,
    setColumns,
    setActionColumns,
    reSetColumns
  }
}

function handleActionColumn(
  propsRef: ComputedRef<ProTableProps>,
  innerWidth: Ref<number>,
  columns: ProColumns[],
  cacheColumns: ProColumns[]
) {
  const { automaticScroll, scroll, neverScroll } = unref(propsRef)
  columns.map(item => {
    if (!item.width || item.dataIndex === 'action') {
      if (item.dataIndex === 'action' && !neverScroll) {
        if (automaticScroll) {
          if (scroll?.x) {
            item.width = item.width || 100
            item.fixed = 'right'
          } else {
            const originCol = cacheColumns.find(col =>
              col.dataIndex || col.key === item.key)
            item.width = originCol?.width || ''
            item.fixed = originCol?.fixed
          }
        } else {
          if (scroll?.x && item.dataIndex === 'action') {
            item.width = item.width || 100
            item.fixed = 'right'
          } else if (innerWidth.value < 1540 && item.dataIndex === 'action') {
            item.width = item.width || 100
            item.fixed = 'right'
          } else {
            const originCol = cacheColumns.find(col =>
              col.dataIndex || col.key === item.key)
            item.width = originCol?.width || ''
            item.fixed = originCol?.fixed
          }
        }
      }
    }
    return item
  })
}

function handleShowIndex(
  propsRef: ComputedRef<ProTableProps>,
  columns: ProColumns[]
) {
  const { showIndex, align } = unref(propsRef)
  if (showIndex && columns.every(column => column.dataIndex !== 'sortIndex')) {
    const firstColumsItem = columns[0]
    columns.unshift({
      title: '序号',
      originAlign: '',
      align,
      fixed: firstColumsItem.fixed,
      width: 60,
      uuid: getRandomNumber().uuid(15),
      dataIndex: 'sortIndex'
    })
  } else {
    columns.filter(item => item.dataIndex !== 'sortIndex')
  }
}

function sortFixedColumn(columns: ProColumns[], columnList: Partial<ProColumns>[] | string[]) {
  const fixedLeftColumns: ProColumns[] = []
  const fixedRightColumns: ProColumns[] = []
  const defColumns: ProColumns[] = []
  columns.map(item => {
    columnList.map(el => {
      if (el.uuid === item.uuid) {
        switch (el.fixType) {
          case 'fixedLeft':
            fixedLeftColumns.push({
              ...item,
              fixed: 'left'
            })
            break
          case 'fixedRight':
            fixedRightColumns.push({
              ...item,
              fixed: 'right'
            })
            break
          default:
            defColumns.push({
              ...item,
              fixed: undefined
            })
            break
        }
      }
    })
    return item
  })
  return [ ...fixedLeftColumns, ...defColumns, ...fixedRightColumns ]
}
