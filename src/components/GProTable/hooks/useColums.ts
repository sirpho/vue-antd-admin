import { ComputedRef, unref, computed, ref, Ref, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { ProTableProps } from '@gx-pro/pro-table'
import { getRandomNumber } from '/@/utils/util'
import { isArray } from '/@/utils/validate'
import type { ColumnsType } from '../typings'
import type { ProColumns } from '../types/column'
import type { ColumnsState } from '../components/ActionColumns'

export function useColumns(
  propsRef: ComputedRef<ProTableProps>,
  propsColumnsRef: ComputedRef<ProColumns<DefaultRecordType>[] | ColumnsType<DefaultRecordType>[]>,
  screensRef: Ref<Partial<Record<Breakpoint, boolean>>>,
  emit: EmitType
) {
  const columnsRef = ref(unref(propsRef).columns) as unknown as Ref<ProColumns<DefaultRecordType>[]>
  const actionColumsRef = ref(unref(propsRef).columns) as unknown as Ref<ColumnsState[]>
  let cacheColumns: any = unref(propsRef).columns

  const getColumnsRef = computed(() => {
    const columns = cloneDeep(unref(columnsRef))

    if (!columns) {
      return []
    }
    return columns
  })

  const getActionColumsRef = computed(() => {
    const columns = cloneDeep(unref(actionColumsRef))
    cloneDeep(handleActionColumn(propsRef, screensRef, columns, cloneDeep(cacheColumns), true))
    return columns
  })

  const getViewColumns = computed(() => {
    const viewColumns = unref(getColumnsRef)

    const columns = cloneDeep(viewColumns)

    cloneDeep(handleActionColumn(propsRef, screensRef, columns, cloneDeep(cacheColumns)))

    return columns
      .filter((column) => column.checked || column.checked === undefined)
  })

  watch(
    () => unref(propsColumnsRef),
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
      actionColumsRef.value = handleActionsColumn(cloneDeep(newColumns)) as ColumnsState[]
    }, {
      deep: true,
      immediate: true
    }
  )

  function resizeColumnWidth (w, col) {
    let newColumns: ProColumns<DefaultRecordType>[] = cloneDeep(columnsRef.value)

    newColumns = newColumns.map(item => {
      if (item.uuid === col.uuid) {
        item.width = w
      }
      return item
    })

    columnsRef.value = cloneDeep(newColumns)
  }

  function setColumns(columnList: ProColumns<DefaultRecordType>[]) {
    const columns: ProColumns<DefaultRecordType>[] = []
    if (!isArray(columns)) return

    if (columnList.length <= 0) {
      columnsRef.value = []
      return
    }

    columnsRef.value = cloneDeep(columnList)
  }

  function setActionColumns(columnList: ColumnsState[], type) {
    const columns: ProColumns<DefaultRecordType>[] = []
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
              const record: ProColumns<DefaultRecordType> = cloneDeep(item)
              switch (el.fixType) {
                case 'fixedLeft':
                  record.fixed = 'left'
                  break
                case 'fixedRight':
                  record.fixed = 'right'
                  break
                default:
                  record.fixed = false
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
        actionColumsRef.value = handleActionsColumn(columns)
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
    columnsRef.value = cloneDeep(unref(cacheColumns))
    actionColumsRef.value = handleActionsColumn(cloneDeep(unref(cacheColumns)))
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
    reSetColumns,
    resizeColumnWidth
  }
}

function handleActionsColumn(columns: any[]) {
  return cloneDeep(columns).map((item, index) => {
    const actionItems: ColumnsState = {
      uuid: item.uuid || '',
      dataIndex: item.dataIndex || '',
      title: item.title as string,
      checked: item.checked || true,
      slots: item.slots,
      key: `0-${index}`,
      children: []
    }
    if (item.fixType) {
      actionItems.fixType = item.fixType
    } else {
      switch (item.fixed) {
        case 'left':
          actionItems.fixType = 'fixedLeft'
          break
        case 'right':
          actionItems.fixType = 'fixedRight'
          break
        default:
          actionItems.fixType = 'nofixed'
          break
      }
    }
    return actionItems
  })
}

function handleActionColumn(
  propsRef: ComputedRef<ProTableProps>,
  screensRef: Ref<Partial<Record<Breakpoint, boolean>>>,
  columns: ProColumns<DefaultRecordType>[] | ColumnsState[],
  cacheColumns: ProColumns<DefaultRecordType>[],
  type?: boolean
) {
  const { automaticScroll, scroll, neverScroll } = unref(propsRef)
  const { xl } = screensRef.value
  columns.map(item => {
    if (!item.width || item.dataIndex === 'action') {
      if (item.dataIndex === 'action' && !neverScroll) {
        if (automaticScroll) {
          if (scroll?.x) {
            if (type) {
              item.fixType = 'fixedRight'
            }
            item.width = item.width || 100
            item.fixed = 'right'
          } else {
            const originCol = cacheColumns.find(col =>
              col.dataIndex === item.dataIndex)
            if (type) {
              item.fixType = 'right'
            } else {
              item.width = originCol?.width || ''
              item.fixed = originCol?.fixed
            }
          }
        } else {
          if (scroll?.x) {
            if (type) {
              item.fixType = 'fixedRight'
            } else {
              item.width = item.width || 100
              item.fixed = 'right'
            }
          } else if (!xl) {
            if (type) {
              item.fixType = 'fixedRight'
            } else {
              item.width = item.width || 100
              item.fixed = 'right'
            }
          } else {
            const originCol = cacheColumns.find(col =>
              col.dataIndex === item.dataIndex)
            if (type) {
              item.fixType = 'fixedRight'
            } else {
              item.width = originCol?.width || ''
              item.fixed = originCol?.fixed
            }
          }
        }
      }
    }
    return item
  })
}

function handleShowIndex(
  propsRef: ComputedRef<ProTableProps>,
  columns: ProColumns<DefaultRecordType>[]
) {
  const { showIndex, align } = unref(propsRef)
  if (showIndex && columns.every(column => column.dataIndex !== 'sortIndex')) {
    const firstColumsItem: ProColumns<DefaultRecordType> = columns[0]
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

function sortFixedColumn(columns: ProColumns<DefaultRecordType>[], columnList: ProColumns<DefaultRecordType>[] | ColumnsState[]) {
  const fixedLeftColumns: ProColumns<DefaultRecordType>[] = []
  const fixedRightColumns: ProColumns<DefaultRecordType>[] = []
  const defColumns: ProColumns<DefaultRecordType>[] = []
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
      return el
    })
    return item
  })
  return [ ...fixedLeftColumns, ...defColumns, ...fixedRightColumns ]
}
