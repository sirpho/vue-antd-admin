import type { Slots } from 'vue'
import { computed, unref, ref, ComputedRef, watch } from 'vue'
import { PaginationProps } from 'ant-design-vue/lib/pagination'
import { getPropsSlotfn } from '@gx-admin/utils'
import { isBoolean, isFunction } from '/@/utils/validate'
import type { ProTableProps } from '../'

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
        itemRender: ({ page, type, originalElement }) => {
          return pageItemRender({ page, type, originalElement })
        }
      }
      : {}

    const pageInfo = {
      current: 1,
      pageSize: 10,
      size: 'normal',
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: [ '10', '20', '50', '100' ],
      ...(isBoolean(pagination) ? {} : pagination),
      ...unref(configRef),
      ...itemRenderProps
    }

    pageInfo.showTotal = (total) => pageInfo.showTotal || `共${total < pageInfo.pageSize
      ? 1
      : Math.ceil(total / pageInfo.pageSize)}页 ${total}条记录`

    return pageInfo
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
