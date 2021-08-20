import {
  ref,
  computed,
  watch,
  onMounted,
  getCurrentInstance,
  defineComponent
} from 'vue'
import type { PropType } from 'vue'
import type Colors from '../colors'
import draggable from '../draggable'
import styles from '../style.module.less'

export default defineComponent({
  props: {
    color: {
      type: Object as PropType<Colors>,
      required: true
    },
    vertical: Boolean
  },
  setup(props) {
    const defaultClassName = 'wd-pro-color'

    const instance: any = getCurrentInstance()
    // ref
    const thumb = ref<any>(null)
    const bar = ref<any>(null)
    // data
    const thumbLeft = ref(0)
    const thumbTop = ref(0)
    // computed
    const hueValue = computed(() => {
      return props.color.get('hue')
    })
    // watch
    watch(() => hueValue.value, () => {
      update()
    })

    // methods
    function handleClick(event: Event) {
      const target = event.target

      if (target !== thumb.value) {
        handleDrag(event)
      }
    }

    function handleDrag(event) {
      const el = instance.vnode.el as HTMLElement
      const rect = el.getBoundingClientRect()
      let hue

      if (thumb.value) {
        if (!props.vertical) {
          let left = event.clientX - rect.left
          left = Math.min(left, rect.width - thumb.value.offsetWidth / 2)
          left = Math.max(thumb.value.offsetWidth / 2, left)

          hue = Math.round((left - thumb.value.offsetWidth / 2) / (rect.width - thumb.value.offsetWidth) * 360)
        } else {
          let top = event.clientY - rect.top

          top = Math.min(top, rect.height - thumb.value.offsetHeight / 2)
          top = Math.max(thumb.value.offsetHeight / 2, top)
          hue = Math.round((top - thumb.value.offsetHeight / 2) / (rect.height - thumb.value.offsetHeight) * 360)
        }
      }
      props.color.set('hue', hue)
    }

    function getThumbLeft() {
      const el = instance.vnode.el

      if (props.vertical) return 0
      const hue = props.color.get('hue')

      if (!el || !thumb.value) return 0
      return Math.round(hue * (el.offsetWidth - thumb.value.offsetWidth / 2) / 360)
    }

    function getThumbTop() {
      const el = instance.vnode.el as HTMLElement
      if (!props.vertical) return 0
      const hue = props.color.get('hue')

      if (!el || !thumb.value) return 0
      return Math.round(hue * (el.offsetHeight - thumb.value.offsetHeight / 2) / 360)
    }

    function update() {
      thumbLeft.value = getThumbLeft()
      thumbTop.value = getThumbTop()
    }

    // mounded
    onMounted(() => {
      const dragConfig = {
        drag: event => {
          handleDrag(event)
        },
        end: event => {
          handleDrag(event)
        }
      }

      draggable(bar.value, dragConfig)
      draggable(thumb.value, dragConfig)
      update()
    })

    return () => (
      <div
        class={props.vertical ?
          [ styles[`${defaultClassName}-hus-slider`], styles[`is-vertical`] ]
          :
          styles[`${defaultClassName}-hus-slider`]}

      >
        <div
          ref={e => bar.value = e}
          class={styles[`${defaultClassName}-slider-bar`]}
          onClick={handleClick}
        >
        </div>
        <div
          ref={e => thumb.value = e}
          class={styles[`${defaultClassName}-slider-thumb`]}
          style={{
            left: thumbLeft.value + 'px',
            top: thumbTop.value + 'px'
          }}
        >
        </div>
      </div>
    )
  }
})
