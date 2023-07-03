import type { ProSearchMap } from '../types/column'
import { ProColumns } from '../types/column'
import { AlignType } from 'ant-design-vue/lib/vc-table/interface'
import { getRandomNumber } from '@sirpho/utils'
import { cloneDeep } from 'lodash-es'

export const proTableSlots: string[] = [
  'search',
  'headerTitle',
  'toolBarBtn',
  'titleTip',
  'settingExtra',
  'optionsExtra',
  'pageItemRender',
  'customize'
]

/**
 * 根据 key 和 dataIndex 生成唯一 id
 *
 * @param key 用户设置的 key
 * @param dataIndex 在对象中的数据
 * @param index 序列号，理论上唯一
 */
export const genColumnKey = (key?: string | number | undefined, index?: number): string => {
  if (key) {
    return Array.isArray(key) ? key.join('-') : key.toString()
  }
  return `${index}`
}

export function handleShowIndex(
  columns: ProColumns,
  {
    align,
    showIndex
  }: {
    align: AlignType;
    showIndex: boolean;
  }
) {
  const columnsList = cloneDeep(columns)
  if (showIndex && columns.length && columns.every(column => column.dataIndex !== 'sortIndex')) {
    const firstColumnsItem = columns[0]
    columnsList.unshift({
      title: '序号',
      align,
      fixed: firstColumnsItem.fixed,
      width: 60,
      uuid: getRandomNumber().uuid(15),
      dataIndex: 'sortIndex',
      key: 'sortIndex'
    })
  } else {
    columnsList.filter(item => item.dataIndex !== 'sortIndex')
  }
  return columnsList
}

export function handleFormDefaultValue(data: ProSearchMap[]) {
  const defaultParams = {}
  data.map(item => {
    let initialValue = item.initialValue
    const valueUndefined = [ 'select' ]
    const valueNull = [ 'date', 'time', 'dateRange' ]
    if (!initialValue && valueUndefined.includes(item.valueType)) {
      initialValue = undefined
    } else if (!initialValue && valueNull.includes(item.valueType)) {
      initialValue = null
    } else if (!initialValue) {
      initialValue = ''
    }
    if (item.valueType === 'dateRange') {
      defaultParams[item.rangeStartName || 'start'] = initialValue ? initialValue[0] : null
      defaultParams[item.rangeEndName || 'end'] = initialValue ? initialValue[1] : null
    } else {
      defaultParams[item.dataIndex as string] = initialValue
    }
    return item
  })
  return defaultParams
}


/**
 * @description 添加序号
 */
export function getSortIndex(
  data: any[] = [],
  pageConfig = {} as
    | {
    current?: number
    pageSize?: number | boolean
  }
    | boolean,
  childrenKey = 'children'
) {
  function getChildSortIndex(parentSort, data) {
    return data.map((item, index) => {
      const sortIndex = `${parentSort}-${index + 1}`
      if (item[childrenKey]) item[childrenKey] = getChildSortIndex(sortIndex, item[childrenKey])
      item.sortIndex = sortIndex
      return item
    })
  }

  return cloneDeep(data).map((item: any, index: number) => {
    let sortIndex = index
    if (pageConfig) {
      const current = pageConfig?.['current'] || 1
      const pageSize = pageConfig?.['pageSize'] || 10
      sortIndex = current ? (current - 1) * pageSize + (index + 1) : index + 1
    }
    if (item[childrenKey]) item[childrenKey] = getChildSortIndex(sortIndex, item[childrenKey])
    item.sortIndex = sortIndex
    return item
  })
}

/**
 * @description 判断删除是否到当前页最后一条
 */
export function handleCurrentPage(
  pageConfig = {} as {
    current: number
    pageSize: number | undefined
    total: number | undefined
  },
  number
) {
  const { pageSize = 10, total = 0 } = pageConfig
  let { current = 1 } = pageConfig
  if (total - number <= pageSize * (current - 1)) {
    current = current - 1
  }
  return current === 0 ? 1 : current
}
