import { Ref, ComputedRef } from 'vue'
import { computed, ref, unref, watch } from 'vue'
import { cloneDeep, omit } from 'lodash-es'
import { checkFileType } from '@/utils/util'
import type { MaterialListItem } from '../typings'
import type { WUploadProps } from '../Upload'

export function useUploadData(
  listRef: Ref<WUploadProps['dataList']>,
  propsRef: ComputedRef<WUploadProps>
) {
  const dataValue = ref<MaterialListItem[]>([])
  const getDataValueRef = computed(() => unref(dataValue))
  const getUrlValueRef = computed(() => unref(dataValue).filter(item => item.url)
    .map(item => item.url))

  watch(
    () => listRef.value,
    (data) => {
      getDataList(data)
    },
    {
      deep: true,
      immediate: true
    }
  )

  function getDataList(list) {
    const { coverDataList = [], limit } = unref(propsRef)
    const newUploadList = list.filter(item => dataValue.value.every(el => el.url !== item))
      .filter(item => item)
    for (let i = 0; i < newUploadList.length; i += 1) {
      if (dataValue.value.length > limit - 1) return
      const type = checkFileType(newUploadList[i])
      const coverImg = coverDataList[i] || ''
      dataValue.value.push({
        id: newUploadList[i],
        url: newUploadList[i],
        type,
        progress: 100,
        uploadLoading: false,
        allowPlay: true,
        coverImg: coverImg,
        uploadStatus: 'success'
      })
    }
  }

  function setDataValue(list) {
    dataValue.value = cloneDeep(list)
  }

  function addDataValue(params: MaterialListItem) {
    dataValue.value.push({ ...params })
  }

  function changeDataValue(idName, params: MaterialListItem) {
    dataValue.value = dataValue.value.map(item => {
      if (item.id === idName) {
        return {
          ...item,
          ...params
        }
      }
      return item
    })
  }

  function batchChangeDataValue(list) {
    list.map(item => {
      dataValue.value = dataValue.value.map(el => {
        if (el.id === item.id) {
          return {
            ...el,
            ...omit(item, [ 'id' ])
          }
        }
        return el
      })
      return item
    })
  }

  function changeFileDataValue(file, params) {
    dataValue.value = dataValue.value.map(item => {
      if (item.name === file.name && item.size === file.size) {
        return {
          ...item,
          ...params
        }
      }
      return item
    })
  }

  function deleteDataValue(idName) {
    dataValue.value = dataValue.value.filter(item => item.id !== idName)
  }

  function deleteFileDataValue(file) {
    dataValue.value = dataValue.value.filter(item =>
      item.name !== file.name || item.size !== file.size)
  }

  return {
    getUrlValueRef,
    getDataValueRef,
    setDataValue,
    addDataValue,
    changeDataValue,
    batchChangeDataValue,
    changeFileDataValue,
    deleteDataValue,
    deleteFileDataValue
  }
}
