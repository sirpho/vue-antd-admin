import type { ExtractPropTypes, CSSProperties } from 'vue'
import {
  computed,
  defineComponent,
  onDeactivated,
  onUnmounted,
  ref,
  unref,
  reactive,
  toRef
} from 'vue'
import { cloneDeep } from 'lodash-es'
import { message, Upload } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { download } from '@/services/common'
import global from '@/common/global'
import { useEffect } from '@gx-admin/hooks/core'
import { getPrefixCls, getSlotVNode } from '@gx-admin/utils'
import { fileName } from '@/utils/uploadFile'
import {
  checkFileType,
  getFileSuffix,
  getMediaInfos,
  dataURLtoFile,
  getBase64,
  dataURLtoBlob,
  getBlobUrl
} from '@/utils/util'
import { proUploadProps } from './props'
import { provideUploadContext } from './UploadContext'
import { useUploadData } from './hooks/useUploadData'
import UploadCard from './components/UploadCard'

import type { MaterialListItem } from './typings'

import './style.less'

export type WUploadProps = Partial<ExtractPropTypes<typeof proUploadProps>>

const GUpload = defineComponent({
  props: proUploadProps,
  emits: ['deleteBefore', 'errorRequest', 'change', 'downLoad'],
  setup(props, { emit, attrs, slots }) {
    const uploadCard = ref()
    const previewConfig = reactive({
      type: '',
      url: '',
      visible: false
    })
    const baseClassName = getPrefixCls({
      suffixCls: 'upload'
    })
    const getClassName = computed(() => {
      return {
        [`${baseClassName}`]: true,
        [`${attrs.class}`]: attrs.class
      }
    })
    const getProps = computed(() => cloneDeep(props))
    const {
      getUrlValueRef,
      getDataValueRef,
      setDataValue,
      changeDataValue,
      batchChangeDataValue,
      deleteDataValue,
      deleteFileDataValue
    } = useUploadData(toRef(props, 'dataList'), getProps)
    onUnmounted(() => {
      setDataValue([])
    })
    onDeactivated(() => {
      setDataValue([])
    })
    const handleProgress = () => {
      batchChangeDataValue(getProps.value.progressInfo)
    }
    useEffect(() => {
      handleProgress()
    }, [() => getProps.value.progressInfo])
    const beforeUpload = async (file) => {
      const fileSuffix = getFileSuffix(file.name)
      let isFileType = true
      let isFileSize = true
      if (props.fileType.length > 0) {
        if (props.fileType.length === 1 && props.fileType[0] == '*') {
          isFileType = true
        } else {
          isFileType = props.fileType.includes(fileSuffix.toLowerCase())
          if (!isFileType) {
            const fileName = props.fileType.join('，')
            message.error(
              `请选择${props.fileType.length === 1 ? fileName : `（${fileName}）`}格式上传!`
            )
          }
        }
      }
      isFileSize = props.fileSize ? file.size / 1024 / 1024 < props.fileSize : true
      if (!isFileSize) {
        message.error(`请上传${props.fileSize}MB以内的文件!`)
      }
      return new Promise<File | boolean>((resolve, reject) => {
        if (isFileType && isFileSize) {
          resolve(file)
        } else {
          reject(false)
          deleteFileDataValue(file)
        }
      })
    }
    const uploadHttp = async ({ file }) => {
      const idName = fileName(file)
      const type = checkFileType(file.name)
      if (props.beforeEditable && type === '1') {
        const base64: string | ArrayBuffer | null = await getBase64(file)
        mediaCropper(idName, 'upload', {
          file,
          url: getBlobUrl(dataURLtoBlob(base64))
        })
      } else {
        requestUpload(file, 'upload', idName)
      }
    }
    const requestUpload = async (file, type, idName) => {
      if (props.request) {
        const response = await props.request(file, idName)
        if (response && response.code === 0) {
          if (type === 'quickEdit') {
            handleQuickEditChange(response, idName)
          } else {
            handleChange(response, idName)
          }
        } else {
          emit('errorRequest', response)
          if (props.errorClean) {
            deleteFile(idName)
          } else {
            changeDataValue(idName, {
              loadingText: '',
              uploadStatus: 'exception',
              uploadLoading: false
            })
          }
        }
      } else {
        const base64: string | ArrayBuffer | null = await getBase64(file)
        handleChange({ url: getBlobUrl(dataURLtoBlob(base64)) }, idName)
      }
    }
    const uploadCoverImgHttp = (file) => {
      if (props.request) {
        const response = props.request(file)
        if (response.code === 0) {
          return response.url
        } else {
          emit('errorRequest', response)
        }
      }
      return ''
    }
    const handleChange = async (res, idName) => {
      if (unref(getDataValueRef).find((item) => item.id === idName)) {
        changeDataValue(idName, {
          uploadStatus: 'active',
          uploadLoading: true,
          spinning: true,
          loadingText: '获取信息中...'
        })
        const fileItem = unref(getDataValueRef).find(
          (item) => item.id === idName
        ) as MaterialListItem
        const { name = '' } = fileItem
        let { coverImg = '' } = fileItem
        const { allowFormat, allowPlay } = fileItem
        if (coverImg) {
          const coverFile = dataURLtoFile(coverImg, `${name.split('.')[0]}_cover.png`)
          coverImg = await uploadCoverImgHttp(coverFile)
        }
        changeDataValue(idName, {
          loadingText: '',
          uploadStatus: 'success',
          allowPlay,
          loadStatusMsg: allowFormat ? (allowPlay ? '' : '加载失败') : '无法在线预览',
          uploadLoading: false,
          url: res.url,
          coverImg
        })
        emit(
          'change',
          cloneDeep(unref(getUrlValueRef)),
          cloneDeep(unref(getDataValueRef)).filter((item) => item.url)
        )
      } else {
        changeDataValue(idName, {
          loadingText: '',
          uploadStatus: 'exception',
          uploadLoading: false
        })
      }
    }
    const handleQuickEditChange = async (res, idName) => {
      const mediaAttributes = await getMediaInfos({
        url: res.url
      })
      changeDataValue(idName, {
        uploadStatus: 'success',
        allowPlay: mediaAttributes.play,
        uploadLoading: false,
        url: res.url
      })
      emit(
        'change',
        cloneDeep(unref(getUrlValueRef)),
        cloneDeep(unref(getDataValueRef)).filter((item) => item.url)
      )
    }
    const imageQuickEdit = (file, idName) => {
      const sizeSolt = (file.size / 1024 / 1024).toFixed(2)
      changeDataValue(idName, {
        sizeSolt,
        name: file.name,
        size: file.size,
        progress: 0,
        uploadStatus: 'active',
        uploadLoading: true
      })
      return { file, idName }
    }
    const mediaCropper = async (name, type, info?: { file: File; url: string }) => {
      const fileUrl =
        info?.url || unref(getDataValueRef).find((item) => item.id === name)?.url || ''
      const fileName = fileUrl.split('/')[fileUrl.split('/').length - 1]
      const fileSuffix = fileName.split('.')[1]
      // @ts-ignore
      const ImageEditor = new FilerobotImageEditor(
        {
          language: 'zh-cn',
          translations: {
            'zh-cn': global.filerobotImageZnch
          }
        },
        {
          onBeforeComplete: (e) => {
            const imgData = e.canvas.toDataURL(`image/${fileSuffix}`)
            const { file, idName } = imageQuickEdit(dataURLtoFile(imgData, fileName), name)
            requestUpload(file, type, idName)
            ImageEditor.unmount()
          },
          onClose: (_) => {
            if (props.beforeEditable) requestUpload(info?.file, 'upload', name)
            return false
          },
          onError: (e) => {
            console.log(e)
          }
        }
      )
      ImageEditor.open(fileUrl)
    }
    provideUploadContext({
      uploadList: getDataValueRef
    })
    const view = (type, url) => {
      previewConfig.type = String(type)
      previewConfig.url = url
      previewConfig.visible = true
    }
    const downLoad = async (url) => {
      emit('downLoad', true)
      await download({
        url: url,
        direct: true
      })
      emit('downLoad', false)
    }
    const watermark = async (idName, type) => {
      const fileUrl = unref(getDataValueRef).find((item) => item.id === idName)?.url || ''
      if (props.waterChange && fileUrl) {
        changeDataValue(idName, {
          progress: 0,
          uploadStatus: 'active',
          uploadLoading: true,
          spinning: true,
          loadingText: '正在添加水印...'
        })
        const response = await props.waterChange(fileUrl, type)
        if (response && response.code === 0) {
          changeDataValue(idName, {
            progress: 100,
            uploadStatus: 'success',
            uploadLoading: false,
            spinning: false,
            loadingText: '',
            url: response.url
          })
          emit(
            'change',
            cloneDeep(unref(getUrlValueRef)),
            cloneDeep(unref(getDataValueRef)).filter((item) => item.url)
          )
        } else {
          emit('errorRequest', response)
          changeDataValue(idName, {
            progress: 100,
            uploadStatus: 'success',
            uploadLoading: false,
            spinning: false,
            loadingText: ''
          })
        }
      }
    }
    const deleteFile = async (idName) => {
      const fileUrl = unref(getDataValueRef).find((item) => item.id === idName)
      if (props.deleteBefore) await props.deleteBefore(fileUrl)
      deleteDataValue(idName)
      emit(
        'change',
        cloneDeep(unref(getUrlValueRef)),
        cloneDeep(unref(getDataValueRef)).filter((item) => item.url)
      )
    }

    const renderUploadButton = () => {
      const uploadButtonRender = slots.default?.()
      return (
        uploadButtonRender || (
          <div
            class={{
              [`${baseClassName}-button`]: true,
              [`${baseClassName}-button-circle`]: props.shape === 'circle'
            }}
            style={props.imageStyle}
          >
            <PlusOutlined />
          </div>
        )
      )
    }

    return () => {
      const wordExtraRender = getSlotVNode(slots, props, 'wordExtra')
      const errorExtraRender = getSlotVNode<WithFalse<() => CustomRender>>(
        slots,
        props,
        'errorExtra'
      )
      const placeholderExtra = getSlotVNode<WithFalse<() => CustomRender>>(
        slots,
        props,
        'placeholderExtra'
      )
      return (
        <div
          style={{ ...props.uploadStyle, ...(attrs.style as CSSProperties) }}
          class={getClassName.value}
        >
          <div
            ref={(e) => (uploadCard.value = e)}
            class={{
              [`${baseClassName}-card`]: true,
              [`${props.cardClassName}`]: props.cardClassName
            }}
          >
            {props.listType === 'card' && (
              <UploadCard
                {...getProps.value}
                placeholderExtra={placeholderExtra}
                errorExtra={errorExtraRender}
                baseClassName={baseClassName}
                root={uploadCard.value}
                onView={(type, url) => view(type, url)}
                onDelete={(idName) => deleteFile(idName)}
                onDownload={(url) => downLoad(url)}
                onWaterMark={(idName, type) => watermark(idName, type)}
                onMediaCropper={(name, type, info) => mediaCropper(name, type, info)}
              />
            )}
            {!props.viewUp && (
              <Upload
                class={`${baseClassName}-upload`}
                beforeUpload={(e) => beforeUpload(e)}
                customRequest={(e) => uploadHttp(e)}
                disabled={props.disabled}
                limit={1}
                showUploadList={false}
                name="file"
              >
                {props.listType === 'card'
                  ? unref(getDataValueRef).length < props.limit && renderUploadButton()
                  : renderUploadButton()}
              </Upload>
            )}
          </div>
          {wordExtraRender && <div class={`${baseClassName}-word-extra`}>{wordExtraRender}</div>}
        </div>
      )
    }
  }
})
export default GUpload
