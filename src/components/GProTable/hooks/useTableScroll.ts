import { ComputedRef, unref, computed, Ref } from 'vue'
import type { ProTableProps } from '@gx-pro/pro-table'
import type { ProColumns } from '../types/column'

export function useTableScroll(
  propsRef: ComputedRef<ProTableProps>,
  screensRef: Ref<Partial<Record<Breakpoint, boolean>>>,
  columnsRef: ComputedRef<ProColumns<RecordType>[]>
) {
  const getScrollX = computed(() => {
    const { rowSelection } = unref(propsRef)
    let width = 0
    const rowSelectWidth = rowSelection ? 60 : 0
    const NORMAL_WIDTH = 150
    const columns = unref(columnsRef)
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
    const { xl, lg } = screensRef.value
    const { scroll, automaticScroll, neverScroll } = unref(propsRef)
    if (neverScroll && lg) return false
    if (automaticScroll) {
      return {
        y: scroll?.y || (xl ? 400 : 235)
      }
    }
    if (scroll) return scroll
    return xl
      ? {}
      : { x: unref(getScrollX) }
  })

  return { getScrollRef }
}
