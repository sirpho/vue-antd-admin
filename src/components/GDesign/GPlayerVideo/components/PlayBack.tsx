import { defineComponent, onMounted } from 'vue'
import { formatDuraton } from '@/utils/util'
import { useVideoContext } from '../context'

const Loading = defineComponent({
  props: {
    prefixCls: String as PropType<string>
  },
  setup(props, { expose }) {
    const { player, isPlaying, play, pause } = useVideoContext()

    const duration = ref(0)
    const currentTime = ref(0)

    onMounted(() => {
      player.value.addEventListener('timeupdate', () => {
        timeChange()
      })
      player.value.addEventListener('durationchange', () => {
        durationChange()
      })
    })

    const removeAllEvents = () => {
      player.value.removeEventListener('timeupdate', () => {
        timeChange()
      })
      player.value.removeEventListener('durationchange', () => {
        durationChange()
      })
    }

    const timeChange = () => {
      const time = player.value?.currentTime || 0
      if (!time) {
        return
      }
      currentTime.value = time
      const newDuration = player.value?.duration || 0
      if (newDuration !== duration.value) {
        duration.value = newDuration
      }
    }

    const durationChange = () => {
      duration.value = player.value.duration || 0
    }

    expose({
      remove: removeAllEvents
    })

    return () => {
      return (
        <>
          <div class={`${props.prefixCls}-player`}>
            {isPlaying.value ? (
              <i onClick={pause} class="playerfont player-Pause icon"></i>
            ) : (
              <i onClick={play} class="playerfont player-Play icon"></i>
            )}
          </div>
          <div class={`${props.prefixCls}-time`}>
            {formatDuraton(currentTime.value)}
            <span style={{ margin: '0 4px' }}>/</span>
            {formatDuraton(duration.value)}
          </div>
        </>
      )
    }
  }
})

export default Loading
