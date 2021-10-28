import {
  computed,
  defineComponent,
  ref,
  watchEffect
} from 'vue'
import { omit } from 'lodash-es'
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
  setup(props, { emit, slots, attrs }) {
    const modalClassName = 'wd-pro-modal'
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
    const onCancel = () => {
      emit('cancel')
    }
    const handleFullScreen = (e) => {
      e?.stopPropagation()
      e?.preventDefault()
      fullScreen.value = !fullScreen.value
    }
    const handleModalClass = computed(() => {
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
      const fullScreenClass = fullScreen.value ? 'wd-pro-modal-full-screen' : ''
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
        } else {
          return slots[name]?.()
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
          {props.spinning
            ? (
              <div class={styles[`${modalClassName}-spinning-content`]} />
            )
            : null}
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
          <a-button key="back" onClick={() => onCancel()}>
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
        {...getProps.value}
        class={handleModalClass.value}
        width={getModalWidth.value}
        onCancel={() => onCancel()}
        footer={renderFooter}
        bodyStyle={fullScreen.value ? { height: `${window.innerHeight - 110}px !important` } : undefined}
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
