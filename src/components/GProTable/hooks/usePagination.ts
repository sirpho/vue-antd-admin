import { computed, unref, ref, ComputedRef, watch } from 'vue'
import { PaginationProps } from 'ant-design-vue/lib/pagination'
import { isBoolean } from '/@/utils/validate'
import { ProTableProps } from '@gx-pro/pro-table'

export function usePagination(refProps: ComputedRef<ProTableProps>) {
  const configRef = ref<PaginationProps>({})
  const show = ref(unref(refProps).showPagination)

  watch(
    () => unref(refProps).pagination,
    (pagination) => {
      if (!isBoolean(pagination) && pagination) {
        configRef.value = {
          ...unref(configRef),
          ...(pagination ?? {})
        }
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

    if (!unref(show) || (isBoolean(pagination) && !pagination)) {
      return false
    }

    return {
      current: 1,
      pageSize: 10,
      size: 'normal',
      showTotal: (total) => `共${total < 10 ? 1 : Math.ceil(total / 10)}页 ${total}条记录`,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: [ '10', '20', '50', '100' ],
      ...(isBoolean(pagination) ? {} : pagination),
      ...unref(configRef)
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
