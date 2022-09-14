import { defineComponent, ref, onMounted } from 'vue'
import { useVideoContext } from '../context'
import { drag, getMatchRangeTime, getElementOffsets } from '../utils/util'

const Progress = defineComponent({
  props: {
    prefixCls: String as PropType<string>,
    visible: Boolean as PropType<boolean>
  },
  setup(props, { expose }) {
    const context = useVideoContext()

    const input = ref<HTMLElement>()
    const thumb = ref<HTMLElement>()

    const _dragEl = ref<HTMLElement>()

    const progress = ref(0)
    const bufferProgress = ref(0)

    const progressStyle = computed(() => {
      if (progress.value === 0 || progress.value === 100) return `${progress.value}%`
      else return `calc(${progress.value}% - 6px)`
    })

    onMounted(() => {
      context.player.value.addEventListener('timeupdate', () => {
        timeUpdate()
      })

      context.player.value.addEventListener('progress', () => {
        downLoad()
      })

      context.player.value.addEventListener('loadstart', () => {
        loadstart()
      })
    })

    const timeUpdate = () => {
      if (_dragEl.value) {
        return
      }
      const time = context.player.value?.currentTime || 0
      const duration = context.player.value?.duration || 0
      progress.value = Number(((time / duration) * 100).toFixed(2))
    }

    const downLoad = () => {
      const currentTime = context.player.value?.currentTime || 0
      const bufferTime = getMatchRangeTime(currentTime, context.player.value?.buffered)
      const duration = context.player.value?.duration || 0
      if (bufferTime > 0 && duration > 0) {
        bufferProgress.value = Number(((bufferTime / duration) * 100).toFixed(2))
      }
    }

    const loadstart = () => {
      const currentTime = context.player.value.currentTime || 0
      const bufferTime = getMatchRangeTime(currentTime, context.player.value.buffered)
      const duration = context.player.value.duration || 0
      bufferProgress.value = Number(((bufferTime / duration) * 100).toFixed(2))
    }

    const seek = (e) => {
      const offsets = getElementOffsets(e.currentTarget)
      if (context.fullScreen.value) {
        offsets.left = 0
      }
      const _clientRect = e.currentTarget.getBoundingClientRect()
      const left = e.pageX - _clientRect.left
      const maxVal = e.currentTarget.offsetWidth
      const val = ((left / maxVal) * 100).toFixed(2)
      progress.value = Number(val)
      const duration = context.player.value.duration || 0
      context.player.value.currentTime = (left / maxVal) * duration
    }

    const initDrag = (e) => {
      e.preventDefault()
      _dragEl.value = thumb.value
      const maxVal = input.value.offsetWidth
      let marginLeft = getComputedStyle(_dragEl.value, null).marginLeft.includes('px')
        ? Number(getComputedStyle(_dragEl.value, null).marginLeft.split('px')[0])
        : Number(getComputedStyle(_dragEl.value, null).marginLeft)
      if (marginLeft) {
        marginLeft = parseFloat(marginLeft)
      }

      const coor = {
        x: e.pageX - _dragEl.value.offsetLeft + marginLeft,
        y: e.clientY - _dragEl.value.offsetTop,
        maxLeft: maxVal
      }

      if (context.fullScreen.value) {
        coor.x = e.pageX - _dragEl.value.offsetLeft
      }

      const move = function (ev) {
        if (!_dragEl.value) {
          return
        }
        const newCoor = drag(ev, _dragEl.value, coor)
        if (newCoor) {
          const left = newCoor.left
          const val = Number(((left / maxVal) * 100 + 2.5).toFixed(2))
          progress.value = val < 0 ? 0 : val > 100 ? 100 : val
          const duration = context.player.value.duration || 0
          context.player.value.currentTime = duration
        }
      }

      const stopMove = function () {
        _dragEl.value = null
        document.removeEventListener('mousemove', move, false)
        document.removeEventListener('mouseup', stopMove, false)
      }

      document.addEventListener('mousemove', move, false)
      document.addEventListener('mouseup', stopMove, false)
    }

    const handleMouseDown = (e) => initDrag(e)

    const removeAllEvents = () => {
      context.player.value.removeEventListener('timeupdate', () => {
        timeUpdate()
      })

      context.player.value.removeEventListener('progress', () => {
        downLoad()
      })

      context.player.value.removeEventListener('loadstart', () => {
        loadstart()
      })
    }

    expose({
      remove: removeAllEvents
    })

    return () => {
      return (
        <div ref={input} class={`${props.prefixCls}-wrapper`} onClick={seek}>
          <div class={`${props.prefixCls}-container`}>
            <div
              class={`${props.prefixCls}-loaded`}
              style={{ width: `${bufferProgress.value}%` }}
            />
            <div class={`${props.prefixCls}-playered`} style={{ width: progressStyle.value }}>
              <div
                ref={thumb}
                class={`${props.prefixCls}-thumb-drag`}
                onMousedown={handleMouseDown}
              />
            </div>
          </div>
        </div>
      )
    }
  }
})

export default Progress
