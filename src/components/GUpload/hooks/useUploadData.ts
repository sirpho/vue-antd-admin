import { computed, ComputedRef, ref, unref, watch } from 'vue'
import { cloneDeep, omit } from 'lodash-es'
import common from '/@/common/global'
import {
  checkFileType,
  dataURLtoBlob,
  getBlobUrl,
  getFileSuffix,
  getMediaInfos,
  getVideoCoverPicture
} from '/@/utils/util'

import type { MaterialInfo, MaterialListItem } from '../typings'
import type { WUploadProps } from '../Upload'

export function useUploadData(
  propsRef: ComputedRef<WUploadProps>
) {
  const dataValue = ref<MaterialListItem[]>([])
  const getDataValueRef = computed(() => unref(dataValue))
  const getUrlValueRef = computed(() => unref(dataValue).filter(item => item.url)
    .map(item => item.url))
  watch(
    () => unref(propsRef).dataList,
    (list) => {
      getDataList(list)
    },
    {
      deep: true,
      immediate: true
    }
  )

  function getDataList(list) {
    const { coverDataList = [] } = unref(propsRef)
    const newUploadList = list.filter(item => dataValue.value.every(el => el.url !== item))
      .filter(item => item)
    for (let i = 0; i < newUploadList.length; i += 1) {
      const type = checkFileType(newUploadList[i])
      let coverImg = ''
      let allowFormat = true
      if (coverDataList[i] || type === '1' || type === '4') {
        coverImg = coverDataList[i] || ''
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
      } else {
        dataValue.value.push({
          id: newUploadList[i],
          url: newUploadList[i],
          type,
          progress: 0,
          uploadStatus: 'active',
          uploadLoading: true,
          spinning: true,
          loadingText: '正在获取中...'
        })
        const fileSuffix = getFileSuffix(newUploadList[i])
        if (type === '2') {
          allowFormat = fileSuffix ?
            common.audioAllowType.includes(fileSuffix.toLowerCase()) : false
        }
        if (type === '3') {
          allowFormat = fileSuffix ?
            common.videoAllowType.includes(fileSuffix.toLowerCase()) : false
        }
        getMediaInfos({
          url: newUploadList[i],
          fileType: type
        }).then((info: MaterialInfo) => {
          if (type === '3' && info.play) {
            getVideoCoverPicture({
              url: newUploadList[i],
              vidoeAllowPlay: true
            }).then((url: string) => {
              dataValue.value = dataValue.value.map(item => {
                if (item.id === newUploadList[i]) {
                  return {
                    ...item,
                    progress: 100,
                    uploadLoading: false,
                    spinning: false,
                    uploadStatus: 'success',
                    allowPlay: info.play,
                    loadStatusMsg: allowFormat ? info.play && url ? '' : '加载失败' : '无法在线预览',
                    coverImg: getBlobUrl(dataURLtoBlob(url))
                  }
                }
                return item
              })
            }).catch(_ => {
              dataValue.value = dataValue.value.map(item => {
                if (item.id === newUploadList[i]) {
                  return {
                    ...item,
                    progress: 100,
                    uploadLoading: false,
                    spinning: false,
                    uploadStatus: 'success',
                    allowPlay: false,
                    loadStatusMsg: allowFormat ? '加载失败' : '无法在线预览',
                    coverImg: ''
                  }
                }
                return item
              })
            })
          } else if (type === '2' && info.play) {
            dataValue.value = dataValue.value.map(item => {
              if (item.id === newUploadList[i]) {
                return {
                  ...item,
                  progress: 100,
                  uploadLoading: false,
                  spinning: false,
                  uploadStatus: 'success',
                  allowPlay: info.play,
                  loadStatusMsg: allowFormat ? info.play ? '' : '加载失败' : '无法在线预览',
                  coverImg: ''
                }
              }
              return item
            })
          } else {
            dataValue.value = dataValue.value.map(item => {
              if (item.id === newUploadList[i]) {
                return {
                  ...item,
                  progress: 100,
                  uploadLoading: false,
                  spinning: false,
                  uploadStatus: 'success',
                  allowPlay: false,
                  loadStatusMsg: allowFormat ? '加载失败' : '无法在线预览',
                  coverImg: ''
                }
              }
              return item
            })
          }
        }).catch(_ => {
          dataValue.value = dataValue.value.map(item => {
            if (item.id === newUploadList[i]) {
              return {
                ...item,
                progress: 100,
                uploadLoading: false,
                spinning: false,
                uploadStatus: 'success',
                allowPlay: false,
                loadStatusMsg: allowFormat ? '加载失败' : '无法在线预览',
                coverImg: ''
              }
            }
            return item
          })
        })
      }
    }
  }

  function setDataValue(list) {
    dataValue.value = cloneDeep(list)
  }

  function addDataValue(params) {
    dataValue.value.push({ ...params })
  }

  function changeDataValue(idName, params) {
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
