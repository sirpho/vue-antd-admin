import { computed, unref, reactive, watchEffect, Ref, Slots, ComputedRef } from 'vue'
import { PaginationProps } from 'ant-design-vue/lib/pagination'
import { isBoolean, isFunction } from '/@/utils/validate'
import { ProTableProps } from '../Table'
import { getPropsSlotfn } from '@gx-admin/utils'

export type GProTablePaginationProps = (PaginationProps & {
  position?: string;
})

export function usePagination({ slots, props, pagination }: {
  slots: Slots
  props: ComputedRef<ProTableProps>;
  pagination: Ref<ProTableProps['pagination']>;
}) {
  const configRef = reactive<PaginationProps>({})

  watchEffect(() => {
    if (pagination.value || pagination.value === undefined) {
      Object.assign(configRef, { ...(pagination.value ?? {}) })
    } else {
      for (const key in configRef) delete configRef[key]
    }
  })

  const getPaginationInfo = computed((): GProTablePaginationProps | boolean => {
    if (isBoolean(pagination.value) && !pagination.value) {
      return false
    }

    const pageItemRender = getPropsSlotfn(slots, unref(props), 'pageItemRender')
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
      ...(pagination.value || {}),
      ...unref(configRef),
      ...itemRenderProps
    } as GProTablePaginationProps

    if (!pagination.value?.showTotal) {
      pageInfo.showTotal = (total) => `共${total < pageInfo.pageSize
        ? 1
        : Math.ceil(total / pageInfo.pageSize)}页 ${total}条记录`
    }
    return pageInfo
  })

  function setPagination(info: Partial<PaginationProps>) {
    const paginationInfo = unref(getPaginationInfo)
    Object.assign(configRef, {
      ...(paginationInfo as GProTablePaginationProps || {}),
      ...info
    })
  }

  return { getPaginationInfo, setPagination }
}
