import { defineComponent, onMounted, ref } from 'vue'
import { useVideoContext } from '../context'

const Loading = defineComponent({
  props: {
    prefixCls: String as PropType<string>,
    muted: Boolean as PropType<boolean>
  },
  setup(props, { expose }) {
    const { player } = useVideoContext()

    const input = ref()
    const thumb = ref()
    const _dragEl = ref()

    const volume = ref(0)
    const isClick = ref(false)
    const isMove = ref(false)
    const dragStartValue = ref(0)
    const isMuted = ref(false)

    watch(
      () => props.muted,
      (val) => {
        isMuted.value = val
      },
      {
        immediate: true
      }
    )

    onMounted(() => {
      player.value.addEventListener('canplay', () => {
        canplay()
      })
    })

    const canplay = () => {
      volume.value = parseInt(player.value?.volume * 100)
      dragStartValue.value = volume.value
    }

    const toggle = () => {
      isMuted.value = !isMuted.value
      if (isMuted.value) {
        player.value.muted = true
        volume.value = 0
      } else {
        player.value.muted = false
        volume.value = parseInt(player.value?.volume * 100)
      }
    }

    const seek = (e) => {
      if (isMove.value) return
      isClick.value = true
      let top = e.offsetY
      if (e.target.className === 'volume-current') {
        top += e.target.offsetTop
      } else if (e.target.className === 'thumb-drag') {
        return
      }
      const maxVal = e.currentTarget.offsetHeight
      let value = 1 - top / maxVal
      value = value >= 1 ? 1 : value <= 0 ? 0 : value
      if (isMuted.value) {
        player.value.muted = false
      }
      player.value.volume = value
      volume.value = parseInt(value * 100)
      dragStartValue.value = volume.value
      isMove.value = false
      setTimeout(() => {
        isClick.value = false
      }, 100)
    }

    const initDrag = (e) => {
      e.preventDefault()
      _dragEl.value = thumb.value
      const maxVal = input.value.offsetHeight

      const coor = {
        y: e.pageY,
        maxLeft: maxVal
      }

      const move = function (ev) {
        if (!_dragEl.value) {
          return
        }
        isMove.value = true
        const value = ev.pageY - coor.y
        const col = value >= 0 ? dragStartValue.value - value : -value + dragStartValue.value
        volume.value = col >= maxVal ? maxVal : col <= 0 ? 0 : col
        player.value.volume = volume.value / 100
      }

      const stopMove = function () {
        _dragEl.value = null
        dragStartValue.value = volume.value
        setTimeout(() => {
          isMove.value = false
        }, 100)
        document.removeEventListener('mousemove', move, false)
        document.removeEventListener('mouseup', stopMove, false)
      }

      document.addEventListener('mousemove', move, false)
      document.addEventListener('mouseup', stopMove, false)
    }

    const handleMouseDown = (e) => {
      if (!isClick.value) initDrag(e)
    }

    const removeAllEvents = () => {
      player.value.removeEventListener('canplay', () => {
        canplay()
      })
    }

    expose({
      remove: removeAllEvents
    })

    return () => {
      return (
        <div class={props.prefixCls}>
          {isMuted.value ? (
            <i onClick={toggle} class="playerfont icon player-Mute"></i>
          ) : (
            <i onClick={toggle} class="playerfont icon player-Volume"></i>
          )}
          <div class={`${props.prefixCls}-panel`}>
            <div ref={input} class="progress" onClick={seek}>
              <div class="volume-current" style={{ height: volume.value + '%' }}>
                <div ref={thumb} class="thumb-drag" onMousedown={handleMouseDown} />
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
})

export default Loading
