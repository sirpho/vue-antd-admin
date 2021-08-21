import { computed, defineComponent, onMounted, onUnmounted, onUpdated, reactive, ref } from 'vue'
import type { CSSProperties, PropType } from 'vue';
import { useStore } from 'vuex'
import { getTargetRect, getFixedTop, getFixedBottom } from './utils/index'
import styles from './style.module.less'

export interface AffixState {
  affixStyle?: CSSProperties;
  placeholderStyle?: CSSProperties;
}

const affixProps = {
  offsetTop: {
    type: Number as PropType<number>,
    default: 20
  },
  offsetBottom: {
    type: Number as PropType<number>,
    default: 20
  },
  root: {
    type: Number as PropType<string>,
    default: '#wd-pro-admin>.wd-pro-scrollbar>.wd-pro-scrollbar-wrap'
  },
};

const WAffix = defineComponent({
  props: affixProps,
  setup(props, { slots }) {
    const defaultClassName = 'wd-affix'
    const store = useStore()
    const className = ref<any>('')
    const placeholderNode = ref<any>(null)
    const fixedNode = ref<any>(null)
    const state: AffixState = reactive({
      affixStyle: undefined,
      placeholderStyle: undefined
    })
    const fixedHeader = computed(() => store.getters['settings/fixedHeader'])
    const offsetTop = computed(() => {
      return props.offsetBottom === undefined && props.offsetTop === undefined
        ? 0
        : props.offsetTop
    })
    const offsetBottom = computed(() => props.offsetBottom)
    onMounted(() => {
      (document.querySelector(props.root) as HTMLInputElement).addEventListener(
        'scroll',
        handleScroll
      )
      measure()
    })
    onUpdated(() => {
      measure()
    })
    onUnmounted(() => {
      (document.querySelector(props.root) as HTMLInputElement).removeEventListener(
        'scroll',
        handleScroll
      )
    })
    const handleScroll = () => {
      measure()
    }
    const measure = () => {
      const targetNode = document.querySelector(props.root)
      if (!targetNode) {
        return
      }

      const targetRect = getTargetRect(targetNode)
      const placeholderReact = getTargetRect(placeholderNode.value as HTMLElement)
      const fixedTop = getFixedTop(placeholderReact, targetRect, offsetTop.value, fixedHeader.value)
      const fixedBottom = getFixedBottom(
        placeholderReact,
        targetRect,
        offsetBottom.value,
        fixedHeader.value
      )
      if (fixedTop !== undefined) {
        state.affixStyle = {
          position: 'fixed',
          top: fixedTop,
          width: placeholderReact.width + 'px',
          height: placeholderReact.height + 'px'
        }
        state.placeholderStyle = {
          width: placeholderReact.width + 'px',
          height: placeholderReact.height + 'px'
        }
        className.value = styles[`${defaultClassName}`]
      } else if (fixedBottom !== undefined) {
        state.affixStyle = {
          position: 'fixed',
          bottom: fixedBottom,
          width: placeholderReact.width + 'px',
          height: placeholderReact.height + 'px'
        }
        state.placeholderStyle = {
          width: placeholderReact.width + 'px',
          height: placeholderReact.height + 'px'
        }
        className.value = styles[`${defaultClassName}`]
      } else {
        state.affixStyle = undefined
        state.placeholderStyle = undefined
        className.value = ''
      }
    }
    return () => (
      <div ref={e => placeholderNode.value = e} style={state.placeholderStyle}>
        <div
          class={className.value}
          ref={e => fixedNode.value = e}
          style={state.affixStyle}
        >
          {slots.default ? slots.default() : null}
        </div>
      </div>
    )
  }
})

export default WAffix
