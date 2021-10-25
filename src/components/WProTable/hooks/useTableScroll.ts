import { ComputedRef, unref, computed, Ref } from 'vue'
import type { ProTableProps } from '@wd-pro/pro-table'
import type { ProColumns } from '../types/column'

export function useTableScroll(
  propsRef: ComputedRef<ProTableProps>,
  innerWidth: Ref<number>,
  columnsRef: ComputedRef<ProColumns[]>
) {
  const getScrollX = computed(() => {
    let width = 0
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
    return width
  })
  const getScrollRef = computed(() => {
    const { scroll, automaticScroll, neverScroll } = unref(propsRef)
    if (neverScroll && innerWidth.value > 992) return false
    if (automaticScroll) {
      return {
        y: scroll?.y || innerWidth.value < 1540 ? 235 : 400
      }
    }
    if (scroll) return scroll
    return innerWidth.value < 1540
      ? { x: unref(getScrollX) }
      : {}
  })

  return { getScrollRef }
}
