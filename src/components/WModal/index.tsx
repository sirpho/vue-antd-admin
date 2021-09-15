import { computed, defineComponent, ref } from 'vue'
import { Modal as T } from 'ant-design-vue'
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
    }
  }),
  setup(props, { emit, slots }: any) {
    const modalClassName = 'wd-pro-modal'
    const innerWidth = ref(window.innerWidth)
    const changeProps = computed(() => {
      const newProps: any = {
        ...props,
        centered: props.fixHeight
      }
      if (props.isFail) newProps.centered = false
      if (props.spinning) newProps.maskClosable = false
      return newProps
    })
    const onCancel = () => {
      emit('cancel')
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
    const renderSolt = () => {
      return Object.keys(slots).map((name) => {
        if (name === 'content') {
          return typeof slots[name] === 'function' ? slots[name] ? slots[name]() : null  : <template></template>
        } else if (name === 'extra') {
          return <template></template>
        } else {
          typeof slots[name] === 'function' ? slots[name]() : <template></template>
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
          {props.skeletonLoading ? (
            <div class={styles[`${modalClassName}-skeleton`]}>
              <a-skeleton loading={props.skeletonLoading} active />
              <a-skeleton loading={props.skeletonLoading} active />
              <a-skeleton loading={props.skeletonLoading} active />
            </div>
          ) : props.isFail ? (
            <a-empty
              class={styles[`${modalClassName}-error-warp`]}
              image="/src/assets/public_image/nodata.png"
            />
          ) : (
            renderSolt()
          )}
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
        <div class={styles[`${modalClassName}-content`]}>
          <div class={styles[`${modalClassName}-spin`]}>
            <a-spin spinning={props.spinning} tip={props.spinningTip} />
          </div>
          {props.fixHeight ? (
            <w-bars style={{ height: '100%' }}>{renderContent()}</w-bars>
          ) : (
            renderContent()
          )}
        </div>
      </a-modal>
    )
  }
})
