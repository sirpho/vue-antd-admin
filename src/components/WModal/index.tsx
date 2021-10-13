import {
  watch,
  computed,
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref
} from 'vue'
import { Modal as T } from 'ant-design-vue'
import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import { getRandomNumber } from '/@/utils/util'
import { useModalDragMove } from './hooks/useModalDrag'

import styles from './style.module.less'

export default defineComponent({
  props: Object.assign({}, T.props, {
    isFail: {
      type: Boolean,
      required: false
    },
    skeletonLoading: {
      type: Boolean,
      required: false
    },
    fixHeight: {
      type: Boolean,
      default: true,
      required: false
    },
    spinning: {
      type: Boolean,
      default: false,
      required: false
    },
    spinningTip: {
      type: String,
      default: '',
      required: false
    },
    contentStyle: {
      type: Object,
      required: false
    },
    draggable: {
      type: Boolean,
      default: true,
      required: false
    },
    fullscreen: {
      type: Boolean,
      default: true,
      required: false
    }
  }),
  setup(props, { emit, slots }: any) {
    const { proxy }: any = getCurrentInstance()
    const modalClassName = 'wd-pro-modal'
    const modalWrapperRef = ref()
    const innerWidth = ref(window.innerWidth)
    const modalId = ref(getRandomNumber().uuid(15))
    const fullScreen = ref(false)
    const changeProps = computed(() => {
      const newProps: any = {
        ...props,
        centered: props.fixHeight,
        closable: false
      }
      if (props.isFail) newProps.centered = false
      if (props.spinning) newProps.maskClosable = false
      return newProps
    })
    watch(() => props.visible, (_) => {
      useModalDragMove({
        visible: changeProps.value.visible,
        destroyOnClose: changeProps.value.destroyOnClose,
        draggable: changeProps.value.draggable
      })
    }, {
      deep: true,
      immediate: true
    })
    onMounted(() => {
      document.addEventListener('fullscreenchange', fullScreenListener)
      document.addEventListener('webkitfullscreenchange', fullScreenListener)
      document.addEventListener('mozfullscreenchange', fullScreenListener)
      document.addEventListener('msfullscreenchange', fullScreenListener)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('fullscreenchange', fullScreenListener)
      document.removeEventListener('webkitfullscreenchange', fullScreenListener)
      document.removeEventListener('mozfullscreenchange', fullScreenListener)
      document.removeEventListener('msfullscreenchange', fullScreenListener)
    })
    const onCancel = () => {
      if (fullScreen.value) toggleScreen()
      emit('cancel')
    }
    const handleFullScreen = (e) => {
      e?.stopPropagation()
      e?.preventDefault()
      toggleScreen()
    }
    const handleModalClass = () => {
      const publicClass = [ styles[modalClassName] ]
      let heightClass: string[] = []
      if (props.isFail) {
        heightClass = [ styles['height-auto'] ]
      } else if (props.fixHeight) {
        if (innerWidth.value < 1540) {
          heightClass = [ styles['height-lower'] ]
        }
      } else {
        heightClass = [ styles['height-no-fixed'] ]
      }
      return [ ...publicClass, ...heightClass ]
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 切换全屏
     */
    const toggleScreen = () => {
      const modalContentRef = modalWrapperRef.value
        ? modalWrapperRef.value.parentNode.parentNode
        : null
      if (fullScreen.value) {
        const el: any = document
        if (el.exitFullscreen) {
          el.exitFullscreen()
        } else if (el.webkitCancelFullScreen) {
          el.webkitCancelFullScreen()
        } else if (el.mozCancelFullScreen) {
          el.mozCancelFullScreen()
        } else if (el.msExitFullscreen) {
          el.msExitFullscreen()
        }
        if (modalContentRef) modalContentRef['classList'].remove('wd-pro-modal-full-screen')
      } else {
        const el: any = modalContentRef
        el.classList.add('wd-pro-modal-full-screen')
        if (el.requestFullscreen) {
          el.requestFullscreen()
          return true
        } else if (el.webkitRequestFullScreen) {
          el.webkitRequestFullScreen()
          return true
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen()
          return true
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen()
          return true
        }
        proxy.$message.warn('对不起，您的浏览器不支持全屏模式')
        el.classList.remove('wd-pro-modal-full-screen')
        return false
      }
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 监听是否全屏
     */
    const fullScreenListener = (e) => {
      if (e.target.childNodes[2] && e.target.childNodes[2].childNodes[2]) {
        if (e.target.childNodes[2].childNodes[2].id === modalId.value) {
          fullScreen.value = !fullScreen.value
        }
      }
    }
    const renderSolt = () => {
      return Object.keys(slots).map((name) => {
        if (name === 'content') {
          return typeof slots[name] === 'function'
            ? slots[name]
              ? slots[name]()
              : null
            : <template></template>
        } else if (name === 'extra') {
          return <template></template>
        } else {
          typeof slots[name] === 'function'
            ? slots[name]()
            : <template></template>
        }
      })
    }
    const renderContent = () => {
      return (
        <div
          class={
            props.spinning
              ? `${styles[`${modalClassName}-body`]} ${styles[`${modalClassName}-spinning`]} ${modalClassName}-body-wrap`
              : `${styles[`${modalClassName}-body`]} ${modalClassName}-body-wrap`
          }
          style={props.contentStyle}
        >
          {props.spinning ? (
            <div class={styles[`${modalClassName}-spinning-content`]} />
          ) : null}
          {props.skeletonLoading
            ? (<div class={styles[`${modalClassName}-skeleton`]}>
              <a-skeleton loading={props.skeletonLoading} active />
              <a-skeleton loading={props.skeletonLoading} active />
              {props.fixHeight && (
                <a-skeleton loading={props.skeletonLoading} active />
              )}
            </div>)
            : props.isFail
              ? (<a-empty
                class={styles[`${modalClassName}-error-warp`]}
                image="/src/assets/public_image/nodata.png"
              />) : (renderSolt())
          }
          {slots.extra ? slots.extra() : null}
        </div>
      )
    }
    const renderFooter = () => {
      const loading = props.skeletonLoading || props.isFail
      const defaultFooter = (
        <div class="modal-footer">
          <a-button key="back" onClick={onCancel.bind(this)}>
            关闭
          </a-button>
        </div>
      )
      return !slots.footer || props.isFail || loading
        ? defaultFooter
        : slots.footer()
    }
    return () => (
      <a-modal
        {...changeProps.value}
        class={handleModalClass()}
        onCancel={onCancel.bind(this)}
        footer={renderFooter}
      >
        <div class={styles[`${modalClassName}-close`]}>
          <span class={styles[`${modalClassName}-close-x`]}>
            <a-space size={24}>
            {
              fullScreen.value
                ? <FullscreenExitOutlined role="full" onClick={(e) => handleFullScreen(e)} />
                : <FullscreenOutlined role="full" onClick={(e) => handleFullScreen(e)} />
            }
              <CloseOutlined onClick={() => onCancel()} />
          </a-space>
          </span>
        </div>
        <div
          id={modalId.value}
          class={styles[`${modalClassName}-content`]}
          ref={e => modalWrapperRef.value = e}
        >
          <div class={styles[`${modalClassName}-spin`]}>
            <a-spin spinning={props.spinning} tip={props.spinningTip} />
          </div>
          {props.fixHeight
            ? (<w-bars style={{ height: '100%' }}>
              {renderContent()}
            </w-bars>)
            : (renderContent())
          }
        </div>
      </a-modal>
    )
  }
})
