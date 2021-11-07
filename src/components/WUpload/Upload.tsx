import {
  computed,
  defineComponent,
  ExtractPropTypes,
  onDeactivated,
  onUnmounted,
  ref,
  Teleport,
  unref,
  CSSProperties
} from 'vue'
import { cloneDeep } from 'lodash-es'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  LoadingOutlined,
  EyeOutlined,
  CloudDownloadOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import { download } from '/@/services/common'
import global from '/@/common/global'
import { getPrefixCls, getPropsSlot } from '/@/components/_util'
import { fileName } from '/@/utils/uploadFile'
import {
  checkFileType,
  getFileSuffix,
  getMediaInfos,
  getVideoCoverPicture,
  dataURLtoFile,
  getBase64,
  dataURLtoBlob,
  getBlobUrl
} from '/@/utils/util'
import { proUploadProps } from './props'
import { useUploadData } from './hooks/useUploadData'

import type { MaterialListItem } from './typings'

import './style.less'

export type WUploadProps = Partial<ExtractPropTypes<typeof proUploadProps>>;

const WUpload = defineComponent({
  props: proUploadProps,
  emits: [ 'deleteBefore', 'errorRequest', 'change', 'downLoad' ],
  setup(props, { emit, attrs, slots }) {
    const uploadCard = ref()
    const showViewer = ref(false)
    const previewSrcList = ref<string[]>([])
    const baseClassName = getPrefixCls({
      suffixCls: 'upload',
      defaultPrefixCls: 'wd'
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
      addDataValue,
      changeDataValue,
      changeFileDataValue,
      deleteDataValue,
      deleteFileDataValue
    } = useUploadData(getProps)
    onUnmounted(() => {
      setDataValue([])
    })
    onDeactivated(() => {
      setDataValue([])
    })
    const beforeUpload = async (file) => {
      const fileSuffix = getFileSuffix(file.name)
      const fileType = checkFileType(file.name)
      let isFileType = true
      let isFileSize = true
      let isFileDuration = true
      if (props.fileType.length > 0) {
        isFileType = props.fileType.includes(fileSuffix.toLowerCase())
        if (!isFileType) {
          const fileName = props.fileType.join('，')
          message.error(
            `请选择${props.fileType.length === 1
              ? fileName
              : `（${fileName}）`}格式上传!`
          )
        }
      }
      isFileSize = props.fileSize ? file.size / 1024 / 1024 < props.fileSize : true
      if (!isFileSize) {
        message.error(`请上传${props.fileSize}MB以内的文件!`)
      }
      if ((fileType === '2' || fileType === '3') && isFileType && isFileSize) {
        let fileDuration = 0
        addDataValue({
          name: file.name,
          size: file.size,
          readySuccess: false,
          uploadLoading: true,
          spinning: true,
          loadingText: '正在准备中...'
        })
        const { play, duration } = await getMediaInfos({
          url: file,
          fileType
        })
        if (play) fileDuration = duration || 0
        isFileDuration = props.fileDuration ? fileDuration < props.fileDuration : true
        if ((fileType === '2' || fileType === '3') && !isFileDuration) {
          message.error(`请上传${props.fileDuration}s以内的文件!`)
        }
      }
      return new Promise((resolve) => {
        if (isFileType && isFileSize && isFileDuration) {
          resolve(file)
        } else {
          deleteFileDataValue(file)
        }
      })
    }
    const uploadHttp = async ({ file }) => {
      const idName = fileName(file)
      const type = checkFileType(file.name)
      const fileSuffix = getFileSuffix(file.name)
      let play = true
      let allowFormat = true
      let fileWidth = 0
      let fileHeight = 0
      let fileCoverImg = ''
      let fileDuration = 0
      const sizeSolt = (file.size / 1024 / 1024).toFixed(2)
      const videoNoExplan = global.videoAllowType.includes(fileSuffix.toLowerCase())
      const audioNoExplan = global.audioAllowType.includes(fileSuffix.toLowerCase())
      if (type === '1') {
        const mediaAttributes = await getMediaInfos({
          url: file,
          fileType: type
        })
        play = mediaAttributes.play
        if (play) {
          fileWidth = mediaAttributes.width || 0
          fileHeight = mediaAttributes.height || 0
        }
      }
      if (type === '2' || type === '3') {
        changeFileDataValue(file, {
          uploadLoading: true,
          spinning: true,
          readySuccess: false,
          loadingText: '正在准备中...'
        })
        if (type === '2') {
          allowFormat = fileSuffix ?
            global.audioAllowType.includes(fileSuffix.toLowerCase()) : false
        }
        if (type === '3') {
          allowFormat = fileSuffix ?
            global.videoAllowType.includes(fileSuffix.toLowerCase()) : false
        }
        const checkDuration = (type === '2' && audioNoExplan) ||
          (type === '3' && videoNoExplan)
        if (checkDuration) {
          const mediaAttributes = await getMediaInfos({
            url: file,
            fileType: type
          })
          play = mediaAttributes.play
          if (play && type === '3') {
            fileCoverImg = await getVideoCoverPicture({
              url: file,
              vidoeAllowPlay: true
            })
          }
          fileDuration = play ? mediaAttributes.duration || 0 : 0
        }
        changeFileDataValue(file, {
          id: idName,
          url: '',
          type,
          progress: 0,
          sizeSolt,
          allowFormat,
          allowPlay: play,
          uploadStatus: 'active',
          spinning: false,
          width: fileWidth,
          height: fileHeight,
          coverImg: fileCoverImg,
          duration: fileDuration
        })
      } else {
        addDataValue({
          id: idName,
          url: '',
          type,
          loadingText: props.beforeEditable ? '正在快编中...' : '',
          progress: 0,
          uploadLoading: true,
          spinning: false,
          sizeSolt,
          allowFormat,
          allowPlay: play,
          uploadStatus: 'active',
          name: file.name,
          size: file.size,
          width: fileWidth,
          height: fileHeight
        })
      }
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
        const response = await props.request(file)
        if (response && response.code === 0) {
          if (type === 'quickEdit') {
            handleQuickEditChange(response, idName)
          } else {
            handleChange(response, idName)
          }
        } else {
          emit('errorRequest', response)
          changeDataValue(idName, {
            uploadStatus: 'exception',
            uploadLoading: true
          })
        }
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
      if (unref(getDataValueRef).find(item => item.id === idName)) {
        changeDataValue(idName, {
          uploadStatus: 'active',
          uploadLoading: true,
          spinning: true,
          loadingText: '获取信息中...'
        })
        const fileItem = unref(getDataValueRef).find(item => item.id === idName) as MaterialListItem
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
          loadStatusMsg: allowFormat ? allowPlay ? '' : '加载失败' : '无法在线预览',
          uploadLoading: false,
          url: res.url,
          coverImg
        })
        emit('change', getUrlValueRef, cloneDeep(unref(getDataValueRef)).filter(item => item.url))
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
      emit('change', getUrlValueRef, cloneDeep(unref(getDataValueRef)).filter(item => item.url))
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
      console.log(unref(getDataValueRef))
      const fileUrl = info?.url || unref(getDataValueRef).find(item => item.id === name)?.url || ''
      const fileName = fileUrl.split('/')[fileUrl.split('/').length - 1]
      const fileSuffix = fileName.split('.')[1]
      // @ts-ignore
      const ImageEditor = new FilerobotImageEditor(
        {},
        {
          onBeforeComplete: e => {
            const imgData = e.canvas.toDataURL(`image/${fileSuffix}`)
            const { file, idName } = imageQuickEdit(dataURLtoFile(imgData, fileName), name)
            requestUpload(file, type, idName)
            ImageEditor.unmount()
          },
          onClose: _ => {
            if (props.editor) requestUpload(info?.file, 'upload', name)
            return false
          }
        }
      )
      ImageEditor.open(fileUrl)
    }
    const viewFile = (type, url) => {
      if (type === '1') {
        previewSrcList.value = [ url ]
        showViewer.value = true
      } else if (type === '4') {
        console.log('其他文件')
      } else {}
    }
    const closeViewer = () => {
      previewSrcList.value = []
      showViewer.value = false
    }
    const downLoad = async (url) => {
      emit('downLoad', true)
      await download({
        url: url,
        direct: true,
        showTip: false
      })
      emit('downLoad', false)
    }
    const watermark = async (idName, type) => {
      const fileUrl = unref(getDataValueRef).find(item => item.id === idName)?.url || ''
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
          emit('change', getUrlValueRef, cloneDeep(unref(getDataValueRef)).filter(item => item.url))
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
      const fileUrl = unref(getDataValueRef).find(item => item.id === idName)
      if (props.deleteBefore) await props.deleteBefore(fileUrl)
      deleteDataValue(idName)
      emit('change', getUrlValueRef, cloneDeep(unref(getDataValueRef)).filter(item => item.url))
    }
    const renderFileCard = (record) => {
      const errorExtraRender = getPropsSlot(slots, props, 'errorExtra')
      let show
      switch (record.type) {
        case '1':
          show = (
            <w-image
              fit="cover"
              style={props.imageStyle}
              src={record.url}
              fallback={errorExtraRender ||
              <div class="image-slot"><i class="iconfont icon-tupian" /></div>}
            />
          )
          break
        case '2':
          show = (
            record.allowPlay && record.url
              ? (
                <div class="image-slot">
                  <i class="iconfont icon-yinleyinpin" />
                </div>
              )
              : (
                errorExtraRender || (
                  <div class="image-slot">
                    {record.loadStatusMsg || '加载失败'}
                  </div>
                )
              )
          )
          break
        case '3':
          show = (
            record.allowPlay && record.url
              ? (
                <w-image
                  fit="cover"
                  style={props.imageStyle}
                  src={record.url}
                  fallback={errorExtraRender || <i class="iconfont icon-shipin" />}
                />
              )
              : (
                errorExtraRender || (
                  <div class="image-slot">
                    {record.loadStatusMsg || '加载失败'}
                  </div>
                )
              )
          )
          break
        case '4':
          show = (
            <div class="image-slot">
              <i class="iconfont icon-qitawenjian" />
            </div>
          )
          break
        default:
          show = (
            <w-image
              fit="cover"
              style={props.imageStyle}
              src={record.url}
              fallback={errorExtraRender ||
              <div class="image-slot"><i class="iconfont icon-tupian" /></div>}
            />
          )
          break
      }
      return show
    }
    const renderExtraMenu = (record) => !props.viewUp && !props.disabled && (
      <a-menu>
        {record.type === '1' && !record.uploadLoading && props.editor && (
          <a-menu-item onClick={() => mediaCropper(record.id, 'quickEdit')}>
            <i class="iconfont icon-tupianbianji" />
            <span style={{ marginLeft: '8px' }}>快编</span>
          </a-menu-item>
        )}
        {(record.type === '1' || record.type === '3') && !record.uploadLoading && props.waterMark && (
          <a-menu-item onClick={() => watermark(record.id, record.type)}>
            <i class="iconfont icon-shuiyin" />
            <span style={{ marginLeft: '8px' }}>水印</span>
          </a-menu-item>
        )}
      </a-menu>)
    return () => {
      const wordExtraRender = getPropsSlot(slots, props, 'wordExtra')
      const uploadButtonRender = getPropsSlot(slots, props, 'uploadButton')
      return (
        <div
          style={{ ...props.uplaodStyle, ...attrs.style as CSSProperties }}
          class={getClassName.value}
        >
          <div
            ref={e => uploadCard.value = e}
            class={{
              [`${baseClassName}-card`]: true,
              [`${props.cardClassName}`]: props.cardClassName
            }}
          >
            {unref(getDataValueRef) && unref(getDataValueRef).length > 0 && (
              unref(getDataValueRef).map((item, index) => {
                return (
                  <a-dropdown
                    key={index}
                    get-popup-container={() => uploadCard.value}
                    trigger={[ 'contextmenu' ]}
                    overlay={renderExtraMenu(item)}
                  >
                    <div
                      class={{
                        [`${baseClassName}-card-item`]: true,
                        [`${baseClassName}-card-item-circle`]: props.shape === 'circle'
                      }}
                      style={props.imageStyle}
                    >
                      {
                        item.uploadLoading
                          ? (
                            <div class={`${baseClassName}-card-item-loading`}>
                              {
                                item.spinning || !props.progress
                                  ? (
                                    <a-spin
                                      tip={item.loadingText || (props.progress ? '' : '正在上传中...')}
                                      indicator={<LoadingOutlined style={{ fontSize: '14px' }} spin />}
                                    />
                                  )
                                  : (
                                    props.progress && (
                                      <a-progress
                                        width={70}
                                        percent={item.progress}
                                        status={item.uploadStatus}
                                        type="circle"
                                      />
                                    )
                                  )
                              }
                            </div>
                          )
                          : (
                            <div
                              class={{
                                [`${baseClassName}-card-item-wrapper`]: true,
                                [`${baseClassName}-card-item-wrapper-disabled`]: props.viewUp &&
                                unref(getDataValueRef).every(item => !item.url)
                              }}
                            >
                              {renderFileCard(item)}
                              <div class={`${baseClassName}-card-item-wrapper-icons`}>
                                <>
                                  {item.allowPlay && item.url && item.type !== '4' && (
                                    <EyeOutlined
                                      onClick={() => viewFile(item.type, item.url)}
                                    />
                                  )}
                                  {item.allowPlay && item.url && props.downLoadAble && (
                                    <CloudDownloadOutlined
                                      onClick={() => downLoad(item.url)}
                                    />
                                  )}
                                  {props.deleteAble && !props.disabled && !props.viewUp && (
                                    <DeleteOutlined
                                      onClick={() => deleteFile(item.id)}
                                    />
                                  )}
                                </>
                              </div>
                            </div>
                          )
                      }
                    </div>
                  </a-dropdown>
                )
              })
            )}
            {!props.viewUp && (
              <a-upload
                class={`${baseClassName}-upload`}
                beforeUpload={e => beforeUpload(e)}
                customRequest={e => uploadHttp(e)}
                disabled={props.disabled}
                limit={1}
                showUploadList={false}
                name="file"
              >
                {unref(getDataValueRef).length < props.limit && (
                  uploadButtonRender || (
                    <div class={`${baseClassName}-button`} style={props.imageStyle}>
                      <PlusOutlined />
                    </div>
                  )
                )}
              </a-upload>
            )}
            <Teleport to="body">
              {showViewer.value && (
                <w-image-viewer urlList={previewSrcList.value} onClose={() => closeViewer()} />
              )}
            </Teleport>
          </div>
          {wordExtraRender && (
            <div class={`${baseClassName}-word-extra`}>
              {wordExtraRender}
            </div>
          )}
        </div>
      )
    }
  }
})
export default WUpload
