import type { Slots } from 'vue'
import { computed, unref, ref, ComputedRef, watch } from 'vue'
import { PaginationProps } from 'ant-design-vue/lib/pagination'
import { isBoolean, isFunction } from '/@/utils/validate'
import { getPropsSlotfn } from '@gx-design/pro-utils'
import { ProTableProps } from '@gx-pro/pro-table'

export function usePagination(refProps: ComputedRef<ProTableProps>, slots: Slots) {
  const configRef = ref<PaginationProps>({})
  const show = ref(unref(refProps).showPagination)

  watch(
    () => unref(refProps).pagination,
    (pagination) => {
      if (!isBoolean(pagination) && pagination) {
        configRef.value = {
          ...(pagination ?? {})
        }
      } else {
        configRef.value = {}
      }
    }
  )

  watch(
    () => unref(refProps).showPagination,
    (value) => {
      show.value = value
    }
  )

  const getPaginationInfo = computed((): PaginationProps | boolean => {
    const { pagination } = unref(refProps)
    const pageItemRender = getPropsSlotfn(slots, unref(refProps), 'pageItemRender')

    if (!unref(show) || (isBoolean(pagination) && !pagination)) {
      return false
    }

    const itemRenderProps = isFunction(pageItemRender)
      ? {
        itemRender: ({page, type, originalElement}) => {
          return pageItemRender({page, type, originalElement})
        }
      }
      : {}

    return {
      current: 1,
      pageSize: 10,
      size: 'normal',
      showTotal: (total) => `共${total < 10 ? 1 : Math.ceil(total / 10)}页 ${total}条记录`,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: [ '10', '20', '50', '100' ],
      ...(isBoolean(pagination) ? {} : pagination),
      ...unref(configRef),
      ...itemRenderProps
    }
  })

  function setPagination(info: Partial<PaginationProps>) {
    const paginationInfo = unref(getPaginationInfo)
    configRef.value = {
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info
    }
  }

  function getPagination() {
    return unref(getPaginationInfo)
  }

  return { getPagination, getPaginationInfo, setPagination }
}
