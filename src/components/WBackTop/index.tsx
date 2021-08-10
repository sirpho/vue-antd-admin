import { computed, defineComponent, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { VerticalAlignTopOutlined } from '@ant-design/icons-vue'
import styles from './style.module.less'

const WBackTop = defineComponent({
  props: {
    root: {
      type: String,
      required: false,
      default: '#wd-pro-admin .wd-pro-scrollbar-wrap'
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
    }
  },
  setup(props, { emit, slots }) {
    const className = 'wd-back-top'
    const innerWidth = ref(window.innerWidth)
    const state = reactive({
      visible: false,
      animated: false,
      animatedCssName: ''
    })
    onMounted(() => {
      (document.querySelector(props.root) as HTMLInputElement).addEventListener(
        'scroll',
        handleScroll
      )
      window.addEventListener('resize', getWidth)
    })
    onUnmounted(() => {
      (document.querySelector(props.root) as HTMLInputElement).removeEventListener(
        'scroll',
        handleScroll
      )
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
    const handleScroll = (e) => {
      if (e.target) {
        if (e.target.scrollTop >= props.visibilityHeight) {
          state.visible = true
          state.animatedCssName = 'fadeIn'
        } else {
          state.animatedCssName = 'fadeOut'
          setTimeout(() => {
            if (e.target.scrollTop < props.visibilityHeight) state.visible = false
          }, 600)
        }
      }
    }
    const backTop = () => {
      (document.querySelector(props.root) as HTMLInputElement).scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      emit('topClick', (document.querySelector(props.root) as HTMLInputElement).scrollTop)
    }
    const contentSlots = () => <div class={styles[`${className}-icon`]}>
      <VerticalAlignTopOutlined />
    </div>
    return () => state.visible ?
      <div class={[ styles[className], 'animated', state.animatedCssName ]} onClick={backTop} style={targetStyle.value}>
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
