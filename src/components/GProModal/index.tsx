import {
  computed,
  defineComponent, ExtractPropTypes,
  onUnmounted,
  ref,
  watchEffect
} from 'vue'
import { Modal, Empty, Skeleton } from 'ant-design-vue'
import type { LegacyButtonType } from 'ant-design-vue/lib/button/buttonTypes'
import { omit } from 'lodash-es'
import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import Nodata from '/@/assets/public_images/nodata.png'
import { PropTypes } from '/@/utils'
import { getRandomNumber } from '/@/utils/util'
import type { SizeType } from '@gx-design/pro-utils'
import { getPropsSlot, tuple, getPrefixCls } from '@gx-design/pro-utils'
import { useModalDragMove } from './hooks/useModalDrag'

import './style.less'

function noop() {}

const ButtonTypes = tuple('default', 'primary', 'ghost', 'dashed', 'link', 'text')

const ButtonHTMLTypes = tuple('submit', 'button', 'reset')

const ButtonShapes = tuple('circle', 'round')

export const buttonTypes = () => ({
  prefixCls: PropTypes.string,
  type: PropTypes.oneOf(ButtonTypes),
  htmlType: PropTypes.oneOf(ButtonHTMLTypes).def('button'),
  shape: PropTypes.oneOf(ButtonShapes),
  size: {
    type: String as PropType<SizeType>
  },
  loading: {
    type: [ Boolean, Object ] as PropType<boolean | { delay?: number }>,
    default: (): boolean | { delay?: number } => false
  },
  disabled: PropTypes.looseBool,
  ghost: PropTypes.looseBool,
  block: PropTypes.looseBool,
  danger: PropTypes.looseBool,
  icon: PropTypes.VueNode,
  href: PropTypes.string,
  target: PropTypes.string,
  title: PropTypes.string,
  onClick: {
    type: Function as PropType<(event: MouseEvent) => void>
  }
})

export const modalProps = {
  prefixCls: PropTypes.string,
  /** 对话框是否可见*/
  visible: PropTypes.looseBool,
  /** 确定按钮 loading*/
  confirmLoading: PropTypes.looseBool,
  /** 标题*/
  title: PropTypes.any,
  /** 是否显示右上角的关闭按钮*/
  closable: PropTypes.looseBool,
  closeIcon: PropTypes.any,
  /** 点击确定回调*/
  onOk: {
    type: Function as PropType<(e: MouseEvent) => void>
  },
  /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调*/
  onCancel: {
    type: Function as PropType<(e: MouseEvent) => void>
  },
  afterClose: PropTypes.func.def(noop),
  /** 垂直居中 */
  centered: PropTypes.looseBool,
  /** 宽度*/
  width: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  /** 底部内容*/
  footer: PropTypes.any,
  /** 确认按钮文字*/
  okText: PropTypes.any,
  /** 确认按钮类型*/
  okType: {
    type: String as PropType<LegacyButtonType>
  },
  /** 取消按钮文字*/
  cancelText: PropTypes.any,
  icon: PropTypes.any,
  /** 点击蒙层是否允许关闭*/
  maskClosable: PropTypes.looseBool,
  /** 强制渲染 Modal*/
  forceRender: PropTypes.looseBool,
  okButtonProps: PropTypes.shape(buttonTypes).loose,
  cancelButtonProps: PropTypes.shape(buttonTypes).loose,
  destroyOnClose: PropTypes.looseBool,
  wrapClassName: PropTypes.string,
  maskTransitionName: PropTypes.string,
  transitionName: PropTypes.string,
  getContainer: PropTypes.any,
  zIndex: PropTypes.number,
  bodyStyle: PropTypes.style,
  maskStyle: PropTypes.style,
  mask: PropTypes.looseBool,
  keyboard: PropTypes.looseBool,
  wrapProps: PropTypes.object,
  focusTriggerAfterClose: PropTypes.looseBool
}

export const proModalProps = {
  ...modalProps,
  isFail: PropTypes.bool,
  skeletonLoading: PropTypes.bool,
  fixHeight: PropTypes.bool.def(true),
  spinning: PropTypes.bool,
  spinningTip: {
    type: String,
    default: ''
  },
  contentStyle: PropTypes.style,
  draggable: PropTypes.bool.def(true),
  showClose: PropTypes.bool.def(true),
  showDefaultFooter: PropTypes.bool.def(false),
  fullscreen: PropTypes.bool.def(true),
  content: PropTypes.VueNode,
  extra: PropTypes.VueNode
}

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
          footer={renderFooter}
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
