import {
  FunctionalComponent as FC,
  Ref,
  computed,
  unref
} from 'vue'
import {
  CloudDownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  LoadingOutlined
} from '@ant-design/icons-vue'
import { getPropsSlot } from '/@/components/_util'
import { useUploadContext } from '../UploadContext'

import type { WUploadProps } from '../Upload'

interface UploadCardProps extends WUploadProps {
  root: Ref<any>;
  baseClassName: string;
  onView: (type, url) => void;
  onDelete: (idName) => void;
  onDownload: (url) => void;
  onWaterMark: (idName, type) => void;
  onMediaCropper: (name, type, info?: { file: File; url: string }) => void;
}

const UploadCard: FC<UploadCardProps> = (props: UploadCardProps, { slots }) => {
  const {
    root,
    onView,
    baseClassName,
    onDelete,
    onDownload,
    onWaterMark,
    onMediaCropper
  } = props

  const context = useUploadContext()

  const rootRef = computed(() => root)

  const renderMaterial = (record) => {
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
            <div class="image-slot"><i class="material_font icon-tupian" /></div>}
          />
        )
        break
      case '2':
        show = (
          record.allowPlay && record.url
            ? (
              <div class="image-slot">
                <i class="material_font icon-yinleyinpin" />
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
                src={record.coverImg}
                fallback={errorExtraRender ||
                <div class="image-slot"><i class="material_font icon-shipin" /></div>}
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
            <i class="material_font icon-qitawenjian" />
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
            <div class="image-slot"><i class="material_font icon-tupian" /></div>}
          />
        )
        break
    }
    return show
  }

  const renderExtraMenu = (record) => !props.viewUp && !props.disabled && (
    <a-menu>
      {record.type === '1' && !record.uploadLoading && props.editor && (
        <a-menu-item onClick={() => onMediaCropper(record.id, 'quickEdit')}>
          <i class="material_font icon-tupianbianji" />
          <span style={{ marginLeft: '8px' }}>快编</span>
        </a-menu-item>
      )}
      {(record.type === '1' || record.type === '3') && !record.uploadLoading && props.waterMark && (
        <a-menu-item onClick={() => onWaterMark(record.id, record.type)}>
          <i class="material_font icon-shuiyin" />
          <span style={{ marginLeft: '8px' }}>水印</span>
        </a-menu-item>
      )}
    </a-menu>)

  return (
    <>
      {unref(context.uploadList) && unref(context.uploadList).length > 0 && (
        unref(context.uploadList).map((item, index) => {
          return (
            <a-dropdown
              key={index}
              get-popup-container={() => rootRef.value}
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
                          unref(context.uploadList).every(item => !item.url)
                        }}
                      >
                        {renderMaterial(item)}
                        <div class={`${baseClassName}-card-item-wrapper-icons`}>
                          <>
                            {item.allowPlay && item.url && item.type !== '4' && (
                              <EyeOutlined
                                onClick={() => onView(item.type, item.url)}
                              />
                            )}
                            {item.allowPlay && item.url && props.downLoadAble && (
                              <CloudDownloadOutlined
                                onClick={() => onDownload(item.url)}
                              />
                            )}
                            {props.deleteAble && !props.disabled && !props.viewUp && (
                              <DeleteOutlined
                                onClick={() => onDelete(item.id)}
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
    </>
  )
}

export default UploadCard
