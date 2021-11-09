import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  onUpdated,
  reactive,
  watch,
  ref,
  getCurrentInstance,
  onActivated,
  ExtractPropTypes,
  onDeactivated
} from 'vue'
import type { CSSProperties } from 'vue'
import omit from 'omit.js'
import config from '/config/config'
import { PropTypes } from '/@/utils'
import { getPrefixCls } from '/@/components/_util'
import {
  addObserveTarget,
  removeObserveTarget,
  getTargetRect,
  getFixedTop,
  getFixedBottom
} from './utils/index'
import throttleByAnimationFrame from '../_util/scroll/throttleByAnimationFrame'

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

const { defaultSettings } = config

const affixProps = {
  zIndex: PropTypes.number,
  offsetTop: PropTypes.number,
  offset: PropTypes.number,
  offsetBottom: PropTypes.number,
  prefixCls: PropTypes.string,
  onChange: PropTypes.func,
  onTestUpdatePosition: PropTypes.func,
  root: PropTypes.string.def(defaultSettings.viewScrollRoot)
}

export type AffixProps = Partial<ExtractPropTypes<typeof affixProps>>;

const WAffix = defineComponent({
  name: 'WAffix',
  props: affixProps,
  emits: [ 'change', 'testUpdatePosition' ],
  setup(props, { slots, emit, expose }) {
    const prefixCls = getPrefixCls({
      suffixCls: 'affix',
      defaultPrefixCls: 'wd'
    })
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
      const placeholderReact = getTargetRect(placeholderNode.value)
      const placeholderChildReact = getTargetRect(
        placeholderNode.value.childNodes?.[0].childNodes?.[1] as HTMLElement ||
        placeholderNode.value
      )
      const fixedTop = getFixedTop(placeholderReact, targetRect, offsetTop.value)
      const fixedBottom = getFixedBottom(placeholderReact, targetRect, offsetBottom.value)
      if (fixedTop !== undefined) {
        newState.affixStyle = {
          position: 'fixed',
          top: fixedTop,
          width: placeholderChildReact.width + 'px',
          height: placeholderChildReact.height + 'px'
        }
        newState.placeholderStyle = {
          width: placeholderChildReact.width + 'px',
          height: placeholderChildReact.height + 'px'
        }
        className.value = styles[`${prefixCls}`]
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
        className.value = styles[`${prefixCls}`]
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
    onActivated(() => {
      updatePosition()
    })
    onUpdated(() => {
      measure()
    })
    onDeactivated(() => {
      clearTimeout(state.timeout)
      removeObserveTarget(currentInstance);
      (updatePosition as any).cancel();
      (lazyUpdatePosition as any).cancel()
    })
    onUnmounted(() => {
      clearTimeout(state.timeout)
      removeObserveTarget(currentInstance);
      (updatePosition as any).cancel();
      (lazyUpdatePosition as any).cancel()
    })
    const restProps = omit(props, [ 'prefixCls', 'offsetTop', 'offsetBottom', 'root' ])
    return () => (
      <div
        {...restProps}
        ref={e => placeholderNode.value = e}
        style={state.placeholderStyle}
      >
        <div
          class={className.value}
          ref={e => fixedNode.value = e}
          style={{
            ...state.affixStyle,
            zIndex: props.zIndex || 10,
            maxHeight: `calc(90vh - ${(state.affixStyle?.top || 114) as number + 32}px)`
          }}
        >
          <w-bars style={{ height: '100%' }}>
            {slots.default ? slots.default() : null}
          </w-bars>
        </div>
      </div>
    )
  }
})

export default WAffix
