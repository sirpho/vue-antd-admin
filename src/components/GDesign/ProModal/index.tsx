import {
  computed,
  defineComponent, ExtractPropTypes,
  onUnmounted,
  ref,
  watchEffect
} from 'vue'
import { Modal, Empty, Skeleton } from 'ant-design-vue'
import { omit } from 'lodash-es'
import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import Nodata from '/@/assets/public_images/nodata.png'
import { getRandomNumber } from '/@/utils/util'
import { getPropsSlot, getPrefixCls } from '@gx-admin/utils'
import { modalProps, proModalProps } from './props'
import { useModalDragMove } from './hooks/useModalDrag'

import './style.less'

export type ModalProps = Partial<ExtractPropTypes<typeof modalProps>>;

export type ProModalProps = Partial<ExtractPropTypes<typeof proModalProps>>;

export default defineComponent({
  props: proModalProps,
  setup(props, { emit, slots, attrs }) {
    const modalClassName = getPrefixCls({
      suffixCls: 'modal',
      isPor: true
    })
    const modalWrapperRef = ref()
    const innerWidth = ref(window.innerWidth)
    const modalId = ref(getRandomNumber().uuid(15))
    const fullScreen = ref(false)
    const getModalWidth = computed(() => props.width === 520 || !props.width ? '850px' : props.width)
    const getProps = computed(() => {
      const newProps: Recordable = {
        ...props,
        centered: props.fixHeight,
        closable: false
      }
      if (props.isFail) newProps.centered = false
      if (props.spinning) newProps.maskClosable = false
      return omit(newProps, [ 'width' ])
    })
    watchEffect(() => {
      useModalDragMove({
        visible: getProps.value.visible,
        destroyOnClose: getProps.value.destroyOnClose,
        draggable: getProps.value.draggable
      })
    })
    onUnmounted(() => {
      emit('cancel')
    })
    const onCancel = () => {
      emit('cancel')
    }
    const handleFullScreen = (e) => {
      e?.stopPropagation()
      e?.preventDefault()
      fullScreen.value = !fullScreen.value
    }
    const handleModalClass = computed(() => {
      const publicClass = [ modalClassName ]
      let heightClass: string[] = []
      if (props.isFail) {
        heightClass = [ 'height-auto' ]
      } else if (props.fixHeight) {
        if (innerWidth.value < 1540) {
          heightClass = [ 'height-lower' ]
        }
      } else {
        heightClass = [ 'height-no-fixed' ]
      }
      const fullScreenClass = fullScreen.value ? 'gx-pro-modal-full-screen' : ''
      return [
        ...publicClass,
        ...heightClass,
        fullScreenClass,
        attrs.class
      ]
    })
    const renderSolt = () => {
      return Object.keys(slots).map((name) => {
        if (name === 'extra') {
          return <template></template>
        } else if (name === 'footer') {
          return <template></template>
        } else {
          return slots[name]?.()
        }
      })
    }
    const renderContentSlot = () => {
      return getPropsSlot(slots, props, 'content')
    }
    const renderSlotContent = () => {
      return slots.content
        ? renderSolt()
        : (
          <>
            {renderContentSlot()}
            {renderSolt()}
          </>
        )
    }
    const renderContent = () => {
      const extraRender = getPropsSlot(slots, props, 'extra')
      return (
        <div
          class={{
            [`${modalClassName}-body`]: true,
            [`${modalClassName}-body-wrap`]: true,
            [`${modalClassName}-spinning`]: props.spinning
          }}
          style={props.contentStyle}
        >
          {props.spinning
            ? (
              <div class={`${modalClassName}-spinning-content`} />
            )
            : null}
          {props.skeletonLoading && (
            <div class={`${modalClassName}-skeleton`} style={{ marginTop: `${props.title ? '' : '55px'}` }}>
              <Skeleton loading={props.skeletonLoading} active />
              <Skeleton loading={props.skeletonLoading} active />
              {props.fixHeight && (
                <Skeleton loading={props.skeletonLoading} active />
              )}
            </div>
          )}
          {props.isFail && <Empty className={`${modalClassName}-error-warp`} image={Nodata} />}
          <div class={{
            [`${modalClassName}-grid`]: true,
            [`${modalClassName}-grid-active`]: props.skeletonLoading || props.isFail
          }}
          >
            {renderSlotContent()}
          </div>
          {extraRender}
        </div>
      )
    }
    const renderFooter = () => {
      const footerRender = getPropsSlot(slots, props, 'footer')
      const loading = props.skeletonLoading || props.isFail
      const defaultFooter = (
        <div class="modal-footer">
          <a-button key="back" onClick={() => onCancel()}>
            关闭
          </a-button>
        </div>
      )
      return footerRender
        ? (
          props.isFail || loading
            ? defaultFooter
            : footerRender
        )
        : props.showDefaultFooter ? defaultFooter : null
    }
    return () => {
      return (
        <Modal
          {...omit(getProps.value, 'onCancel')}
          wrapClassName={getProps.value.visible ? '' : `${modalClassName}-wrap`}
          class={handleModalClass.value}
          width={getModalWidth.value}
          onCancel={() => onCancel()}
          footer={renderFooter()}
          bodyStyle={fullScreen.value ? { height: `${window.innerHeight - 110}px !important` } : undefined}
        >
          {props.fullscreen && props.showClose && (
            <div class={`${modalClassName}-close`}>
              <span class={`${modalClassName}-close-x`}>
                <a-space size={24}>
                  {props.fullscreen && (
                    fullScreen.value
                      ? <FullscreenExitOutlined role="full" onClick={(e) => handleFullScreen(e)} />
                      : <FullscreenOutlined role="full" onClick={(e) => handleFullScreen(e)} />
                  )}
                  {props.showClose && (
                    <CloseOutlined onClick={() => onCancel()} />
                  )}
                </a-space>
              </span>
            </div>
          )}
          <div
            id={modalId.value}
            class={`${modalClassName}-content`}
            ref={e => modalWrapperRef.value = e}
          >
            {props.spinning && (
              <div class={`${modalClassName}-spin`}>
                <a-spin spinning={props.spinning} tip={props.spinningTip} />
              </div>
            )}
            {props.fixHeight
              ? (
                <g-bars style={{ height: '100%' }}>
                  {renderContent()}
                </g-bars>
              )
              : (renderContent())
            }
          </div>
        </Modal>
      )
    }
  }
})
