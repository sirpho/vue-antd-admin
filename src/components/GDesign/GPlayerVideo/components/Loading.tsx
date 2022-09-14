import { defineComponent, ref, onMounted } from 'vue'
import { useVideoContext } from '../context'

const Loading = defineComponent({
  name: 'Loading',
  props: {
    prefixCls: String as PropType<string>
  },
  setup(props, { expose }) {
    const { player } = useVideoContext()

    const show = ref(false)
    const _timeout = ref()

    onMounted(() => {
      player.value.addEventListener('canplay', () => {
        hideLoading()
      })
      player.value.addEventListener('canplaythrough', () => {
        hideLoading()
      })
      player.value.addEventListener('play', () => {
        hideLoading()
      })
      player.value.addEventListener('loadedmetadata', () => {
        hideLoading()
      })
      player.value.addEventListener('seeked', () => {
        hideLoading()
      })
      player.value.addEventListener('error', () => {
        hideLoading()
      })
      player.value.addEventListener('playing', () => {
        hideLoading()
      })
      player.value.addEventListener('seeking', () => {
        showLoading()
      })
      player.value.addEventListener('stalled', () => {
        showLoading()
      })
      player.value.addEventListener('loadstart', () => {
        showLoading()
      })
    })

    const removeAllEvents = () => {
      player.value.removeEventListener('canplay', () => {
        hideLoading()
      })
      player.value.removeEventListener('canplaythrough', () => {
        hideLoading()
      })
      player.value.removeEventListener('play', () => {
        hideLoading()
      })
      player.value.removeEventListener('loadedmetadata', () => {
        hideLoading()
      })
      player.value.removeEventListener('seeked', () => {
        hideLoading()
      })
      player.value.removeEventListener('error', () => {
        hideLoading()
      })
      player.value.removeEventListener('playing', () => {
        hideLoading()
      })
      player.value.removeEventListener('seeking', () => {
        showLoading()
      })
      player.value.removeEventListener('stalled', () => {
        showLoading()
      })
      player.value.removeEventListener('loadstart', () => {
        showLoading()
      })
    }

    const showLoading = (isForce?: boolean) => {
      if (isForce) {
        show.value = true
        return
      }
      window.clearTimeout(_timeout.value)
      _timeout.value = setTimeout(() => {
        show.value = true
      }, 600)
    }

    const hideLoading = () => {
      window.clearTimeout(_timeout.value)
      show.value = false
    }

    expose({
      items: 123,
      remove: removeAllEvents
    })

    return () => {
      return (
        <div
          style={show.value ? undefined : { display: 'none' }}
          class={{
            [`${props.prefixCls}-layer`]: true,
            [`${props.prefixCls}-loading`]: true
          }}
        >
          <div class={`${props.prefixCls}-loading-wrapper`}>
            <div class="playerfont player-jiazai" />
            <div>加载中...</div>
          </div>
        </div>
      )
    }
  }
})

export default Loading
