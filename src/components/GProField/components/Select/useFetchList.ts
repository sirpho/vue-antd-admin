import { computed, onMounted, ref, unref } from 'vue'
import type { ComputedRef } from 'vue'
import type { SelectProps } from './SearchSelect'
import { useTimeoutFn } from '@gx-design/pro-hooks/core'
import { ProFieldValueEnumType, ProSchemaValueEnumMap } from '@gx-design/pro-utils'
import { isFunction } from '/@/utils/validate'
import type { FieldSelectProps } from './index'

export function useFetchList(
  propsRef: ComputedRef<FieldSelectProps>
) {
  const loading = ref<boolean>(false)
  const keyWords = ref<string | undefined>('')
  const requestData = ref<any>([])
  const resOptions = ref<any>([])

  const getResOptionsRef = computed(() => {
    return unref(propsRef).request ? unref(requestData):  unref(resOptions)
  })

  const fetchList = async () => {
    const { request, valueEnum, fieldProps, params } = unref(propsRef)
    if (!request || !isFunction(request)) {
      if (valueEnum) {
        const options: SelectProps['options'] = proFieldParsingValueEnumToArray(ObjToMap(
          valueEnum))
          .map(({ value, text, ...rest }) => ({
            label: text,
            value,
            key: value,
            ...rest
          }))

        let opt = options?.map((item) => {
          if (typeof item === 'string') {
            return {
              label: item,
              value: item
            }
          }
          if (item?.optionType === 'optGroup' && (item.children || item.options)) {
            const childrenOptions = [ ...(item.children || []), ...(item.options || []) ].filter(
              (mapItem) => {
                return filerByItem(mapItem, keyWords.value)
              }
            )
            return {
              ...item,
              children: childrenOptions,
              options: childrenOptions
            }
          }
          return item
        })

        // filterOption 为 true 时 filter数据, filterOption 默认为true
        if (fieldProps?.filterOption === true || fieldProps?.filterOption === undefined) {
          opt = opt?.filter((item) => {
            if (!item) return false
            if (!keyWords.value) return true
            return filerByItem(item as any, keyWords.value)
          })
        }
        resOptions.value = opt
      }
    } else {
      loading.value = true
      const loadData = await request({ ...params })
      loading.value = false
      requestData.value = loadData
    }
  }

  onMounted(() => {
    useTimeoutFn(() => {
      fetchList()
    }, 16)
  })

  return {
    loading,
    getResOptionsRef,
    fetchList
  }
}

/**
 * 获取类型的 type
 *
 * @param obj
 */
function getType(obj: any) {
  // @ts-ignore
  const type = Object.prototype.toString
    .call(obj)
    .match(/^\[object (.*)\]$/)[1]
    .toLowerCase()
  if (type === 'string' && typeof obj === 'object') return 'object' // Let "new String('')" return 'object'
  if (obj === null) return 'null' // PhantomJS has type "DOMWindow" for null
  if (obj === undefined) return 'undefined' // PhantomJS has type "DOMWindow" for undefined
  return type
}

/**
 * 递归筛选 item
 *
 * @param item
 * @param keyWords
 * @returns
 */
function filerByItem(
  item: {
    label: string;
    value: string;
    optionType: string;
    children: any[];
    options: any[];
  },
  keyWords?: string
) {
  if (!keyWords) return true
  if (
    item?.label?.toString().toLowerCase().includes(keyWords.toLowerCase()) ||
    item?.value?.toString().toLowerCase().includes(keyWords.toLowerCase())
  ) {
    return true
  }
  if (item.optionType === 'optGroup' && (item.children || item.options)) {
    const findItem = [ ...(item.children || []), item.options || [] ].find((mapItem) => {
      return filerByItem(mapItem, keyWords)
    })
    if (findItem) return true
  }
  return false
}

export function ObjToMap(value: ProFieldValueEnumType | undefined): ProSchemaValueEnumMap {
  if (getType(value) === 'map') {
    return value as ProSchemaValueEnumMap
  }
  return new Map(Object.entries(value || {}))
}

/**
 * 把 value 的枚举转化为数组
 *
 * @param valueEnum
 */
export const proFieldParsingValueEnumToArray = (
  valueEnumParams: ProFieldValueEnumType
): {
  value: string | number;
  text: string;
}[] => {
  const enumArray: {
    value: string | number;
    text: string;
    /** 是否禁用 */
    disabled?: boolean;
  }[] = []
  const valueEnum = ObjToMap(valueEnumParams)

  valueEnum.forEach((_, key) => {
    const value = (valueEnum.get(key) || valueEnum.get(`${key}`)) as {
      text: string;
      disabled?: boolean;
    }

    if (!value) {
      return
    }

    if (typeof value === 'object' && value?.text) {
      enumArray.push({
        text: value?.text as unknown as string,
        value: key,
        disabled: value.disabled
      })
      return
    }
    enumArray.push({
      text: value as unknown as string,
      value: key
    })
  })
  return enumArray
}
