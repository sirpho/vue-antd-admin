import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  onUpdated,
  reactive,
  watch,
  ref,
  getCurrentInstance
} from 'vue'
import omit from 'omit.js'
import type { CSSProperties, PropType } from 'vue'
import {
  addObserveTarget,
  removeObserveTarget,
  getTargetRect,
  getFixedTop,
  getFixedBottom
} from './utils/index'
import PropTypes from '../_util/vue-types'
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame'
import styles from './style.module.less'

enum AffixStatus {
  None,
  Prepare,
}

export interface AffixState {
  affixStyle?: CSSProperties;
  placeholderStyle?: CSSProperties;
  status: AffixStatus;
  lastAffix: boolean;
  prevTarget: Window | HTMLElement | null;
  timeout: any;
}

const affixProps = {
  /**
   * 距离窗口顶部达到指定偏移量后触发
   */
  zIndex: PropTypes.number,
  offsetTop: PropTypes.number,
  offset: PropTypes.number,
  /** 距离窗口底部达到指定偏移量后触发 */
  offsetBottom: PropTypes.number,
  /** 固定状态改变时触发的回调函数 */
  // onChange?: (affixed?: boolean) => void;
  prefixCls: PropTypes.string,
  onChange: PropTypes.func,
  onTestUpdatePosition: PropTypes.func,
  root: {
    type: String as PropType<string>,
    default: '#wd-pro-admin>.wd-pro-scrollbar>.wd-pro-scrollbar-wrap'
  }
}

const WAffix = defineComponent({
  props: affixProps,
  setup(props, { slots, emit, expose }) {
    const defaultClassName = 'wd-affix'
    const className = ref<any>('')
    const placeholderNode = ref()
    const fixedNode = ref()
    const state: AffixState = reactive({
      affixStyle: undefined,
      placeholderStyle: undefined,
      status: AffixStatus.None,
      lastAffix: false,
      prevTarget: null,
      timeout: null
    })
    const currentInstance: any = getCurrentInstance()
    const offsetTop = computed(() => {
      return props.offsetBottom === undefined && props.offsetTop === undefined
        ? 0
        : props.offsetTop
    })
    const offsetBottom = computed(() => props.offsetBottom)
    const measure = () => {
      const { status, lastAffix } = state
      const { root } = props
      if (status !== AffixStatus.Prepare || !fixedNode.value || !placeholderNode.value || !root) {
        return
      }

      const targetNode = (document.querySelector(root) as HTMLInputElement)
      if (!targetNode) {
        return
      }

      const newState = {
        status: AffixStatus.None
      } as AffixState
      const targetRect = getTargetRect(targetNode)
      const placeholderReact = getTargetRect(placeholderNode.value as HTMLElement)
      const fixedTop = getFixedTop(placeholderReact, targetRect, offsetTop.value)
      const fixedBottom = getFixedBottom(placeholderReact, targetRect, offsetBottom.value)
      if (fixedTop !== undefined) {
        newState.affixStyle = {
          position: 'fixed',
          top: fixedTop,
          width: placeholderReact.width + 'px',
          height: placeholderReact.height + 'px'
        }
        newState.placeholderStyle = {
          width: placeholderReact.width + 'px',
          height: placeholderReact.height + 'px'
        }
        className.value = styles[`${defaultClassName}`]
      } else if (fixedBottom !== undefined) {
        newState.affixStyle = {
          position: 'fixed',
          bottom: fixedBottom,
          width: placeholderReact.width + 'px',
          height: placeholderReact.height + 'px'
        }
        newState.placeholderStyle = {
          width: placeholderReact.width + 'px',
          height: placeholderReact.height + 'px'
        }
        className.value = styles[`${defaultClassName}`]
      } else {
        newState.affixStyle = undefined
        newState.placeholderStyle = undefined
        className.value = ''
      }

      newState.lastAffix = !!newState.affixStyle
      if (lastAffix !== newState.lastAffix) {
        emit('change', newState.lastAffix)
      }
      // update state
      Object.assign(state, newState)
    }
    const prepareMeasure = () => {
      Object.assign(state, {
        status: AffixStatus.Prepare,
        affixStyle: undefined,
        placeholderStyle: undefined
      })
      currentInstance.update()
      // Test if `updatePosition` called
      if (process.env.NODE_ENV === 'test') {
        emit('testUpdatePosition')
      }
    }

    const updatePosition = throttleByAnimationFrame(() => {
      prepareMeasure()
    })
    const lazyUpdatePosition = throttleByAnimationFrame(() => {
      const { root } = props
      const { affixStyle } = state

      if (root && affixStyle) {
        const targetNode = (document.querySelector(root) as HTMLInputElement)
        if (targetNode && placeholderNode.value) {
          const targetRect = getTargetRect(targetNode)
          const placeholderReact = getTargetRect(placeholderNode.value as HTMLElement)
          const fixedTop = getFixedTop(placeholderReact, targetRect, offsetTop.value)
          const fixedBottom = getFixedBottom(placeholderReact, targetRect, offsetBottom.value)
          if (
            (fixedTop !== undefined && affixStyle.top === fixedTop) ||
            (fixedBottom !== undefined && affixStyle.bottom === fixedBottom)
          ) {
            return
          }
        }
      }
      prepareMeasure()
    })

    expose({
      updatePosition,
      lazyUpdatePosition
    })
    watch(
      () => props.root,
      val => {
        let newTarget: any = null
        if (val) {
          newTarget = (document.querySelector(val) as HTMLInputElement) || null
        }
        if (state.prevTarget !== newTarget) {
          removeObserveTarget(currentInstance)
          if (newTarget) {
            addObserveTarget(newTarget, currentInstance)
            updatePosition()
          }
          state.prevTarget = newTarget
        }
      }
    )
    watch(() => [ props.offsetTop, props.offsetBottom ], updatePosition)
    onMounted(() => {
      const { root } = props
      if (root) {
        state.timeout = setTimeout(() => {
          addObserveTarget((document.querySelector(root) as HTMLInputElement), currentInstance)
          updatePosition()
        })
      }
    })
    onUpdated(() => {
      measure()
    })
    onUnmounted(() => {
      clearTimeout(state.timeout)
      removeObserveTarget(currentInstance);
      (updatePosition as any).cancel();
      (lazyUpdatePosition as any).cancel()
    })
    const restProps = omit(props, [ 'prefixCls', 'offsetTop', 'offsetBottom', 'root' ])
    return () => (
      <div {...restProps} ref={e => placeholderNode.value = e} style={state.placeholderStyle}>
        <div
          class={className.value}
          ref={e => fixedNode.value = e}
          style={{ ...state.affixStyle, zIndex: props.zIndex || 10 }}
        >
          {slots.default ? slots.default() : null}
        </div>
      </div>
    )
  }
})

export default WAffix
