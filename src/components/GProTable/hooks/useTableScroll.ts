import type { ComputedRef, Ref } from 'vue'
import { unref, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { ProTableProps } from '@gx-pro/pro-table'
import { isBoolean, isNumber, isString } from '/@/utils/validate'
import type { ProColumns } from '../types/column'

type useTableScrollType = {
  propsRef: ComputedRef<ProTableProps>,
  screensRef: Ref<Partial<Record<Breakpoint, boolean>>>,
  columnsRef: ComputedRef<ProColumns<RecordType>[]>,
  innerWidth: Ref<number>
}

export function useTableScroll({
  propsRef,
  screensRef,
  columnsRef,
  innerWidth
} : useTableScrollType) {
  const getScrollX = computed(() => {
    const { rowSelection } = unref(propsRef)
    let width = 0
    const rowSelectWidth = rowSelection ? 60 : 0
    const NORMAL_WIDTH = 150
    const columns = cloneDeep(unref(columnsRef))
    columns.forEach((item) => {
      width += Number.parseInt(item.width as string) || 0
    })
    const unsetWidthColumns = columns.filter((item) => !Reflect.has(item, 'width'))

    const len = unsetWidthColumns.length
    if (len !== 0) {
      width += len * NORMAL_WIDTH
    }
    if (rowSelectWidth) width += rowSelectWidth
    return width
  })
  const getScrollRef = computed(() => {
    const { lg } = screensRef.value
    let breakpoint = screensRef.value.xl
    const { scroll, automaticScroll, neverScroll, scrollBreakpoint } = unref(propsRef)
    if (neverScroll && lg) return false
    if (automaticScroll) {
      return {
        y: scroll?.y || (breakpoint ? 400 : 235)
      }
    }
    if (scroll) return scroll
    if (scrollBreakpoint) breakpoint = isNumber(scrollBreakpoint)
      ? innerWidth.value > scrollBreakpoint
      : isString(scrollBreakpoint) ? screensRef.value?.[scrollBreakpoint] : breakpoint
    return breakpoint
      ? false
      : isBoolean(breakpoint) ? { x: unref(getScrollX) } : false
  })

  return { getScrollRef }
}
