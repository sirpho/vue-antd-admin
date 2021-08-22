import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  onActivated,
  reactive,
  ref,
  watch,
  nextTick
} from 'vue'
import { VerticalAlignTopOutlined } from '@ant-design/icons-vue'
import PropTypes from '../_util/vue-types'
import getScroll from '../_util/getScroll'
import scrollTo from '../_util/scrollTo'
import addEventListener from '../_util/Dom/addEventListener'
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame'
import styles from './style.module.less'

const WBackTop = defineComponent({
  props: {
    root: {
      type: String,
      required: false,
      default: '#wd-pro-admin>.wd-pro-scrollbar>.wd-pro-scrollbar-wrap'
    },
    visibilityHeight: {
      type: Number,
      required: false,
      default: 100
    },
    targetStyle: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    },
    duration: PropTypes.number.def(450)
  },
  setup(props, { emit, slots }) {
    const className = 'wd-back-top'
    const innerWidth = ref(window.innerWidth)
    const state = reactive({
      visible: false,
      animated: false,
      animatedCssName: '',
      scrollEvent: null
    }) as {
      visible: boolean;
      animated: boolean;
      animatedCssName: string;
      scrollEvent: { remove: () => void } | null;
    }
    const bindScrollEvent = () => {
      const { root } = props
      const container = (document.querySelector(root) as HTMLInputElement)
      state.scrollEvent = addEventListener(container, 'scroll', (e: Event) => {
        handleScroll(e)
      })
      handleScroll({
        target: container
      })
    }
    const scrollRemove = () => {
      if (state.scrollEvent) {
        state.scrollEvent.remove()
      }
      (handleScroll as any).cancel()
    }
    watch(
      () => props.root,
      () => {
        scrollRemove()
        nextTick(() => {
          bindScrollEvent()
        })
      }
    )
    onMounted(() => {
      nextTick(() => {
        bindScrollEvent()
        window.addEventListener('resize', getWidth)
      })
    })
    onActivated(() => {
      nextTick(() => {
        bindScrollEvent()
      })
    })
    onUnmounted(() => {
      scrollRemove()
      window.removeEventListener('resize', getWidth)
    })
    watch(innerWidth, (value) => {
      innerWidth.value = value
    })
    const targetStyle = computed(() => {
      const style = props.targetStyle
      if (innerWidth.value < 992) return {
        right: '50px',
        ...style
      }
      return style
    })
    /**
     * @Author      gx12358
     * @DateTime    2021/7/14
     * @lastTime    2021/7/14
     * @description 监听屏幕宽度
     */
    const getWidth = () => {
      innerWidth.value = window.innerWidth
    }
    const handleScroll = throttleByAnimationFrame((e: Event | { target: any }) => {
      const { visibilityHeight } = props
      const scrollTop = getScroll(e.target, true)
      state.visible = scrollTop > visibilityHeight
    })
    const scrollToTop = (e) => {
      const { root, duration } = props
      scrollTo(0, {
        getContainer: () => (document.querySelector(root) as HTMLInputElement),
        duration
      })
      emit('click', e)
    }
    const contentSlots = () => <div class={styles[`${className}-icon`]}>
      <VerticalAlignTopOutlined />
    </div>
    return () => state.visible ?
      <div
        class={[ styles[className], 'animated', state.animatedCssName ]}
        onClick={scrollToTop}
        style={targetStyle.value}
      >
        <div class={styles[`${className}-content`]}>
          {
            slots.default ? slots.default() : contentSlots()
          }
        </div>
      </div>
      :
      null
  }
})

export default WBackTop
