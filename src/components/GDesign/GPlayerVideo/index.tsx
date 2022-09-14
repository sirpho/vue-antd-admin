import { defineComponent, computed, ref, onDeactivated, onBeforeUnmount } from 'vue'
import { getPrefixCls } from '@gx-admin/utils'
import { isArray } from '@/utils/validate'
import { videoProps } from './props'
import { provideVideoContext } from './context'
import type { VideoSource } from './typings'
import Loading from './components/Loading'
import PlayBack from './components/PlayBack'
import Volume from './components/Volume'
import Progress from './components/Progress'

import './style.less'
import { useFullscreen } from '@vueuse/core'

const GPlayerVideo = defineComponent({
  name: 'GPlayerVideo',
  props: videoProps,
  setup(props, { expose }) {
    const className = getPrefixCls({
      suffixCls: 'video'
    })

    const player = ref<HTMLVideoElement>()
    const playerRef = ref<HTMLElement>()
    const isPlaying = ref<boolean>(false)

    const volumeLayer = ref()
    const loadingLayer = ref()
    const progressLayer = ref()
    const playbackLayer = ref()

    const { toggle, isFullscreen } = useFullscreen(playerRef)

    onMounted(() => {
      player.value.addEventListener('play', () => {
        isPlaying.value = true
      })
      player.value.addEventListener('pause', () => {
        isPlaying.value = false
      })
    })

    const videoSource = computed(() => {
      if (isArray(props.src)) return (props.src as VideoSource[])?.[0].src || ''
      return props.src as string
    })

    const play = () => {
      player.value.play()
    }

    const pause = () => {
      player.value.pause()
    }

    provideVideoContext({
      player,
      isPlaying,
      fullScreen: isFullscreen,
      play,
      pause
    })

    const removeAllEvents = () => {
      loadingLayer.value?.remove()
      progressLayer.value?.remove()
      playbackLayer.value?.remove()
      volumeLayer.value?.remove()
    }

    onBeforeUnmount(() => {
      removeAllEvents()
    })

    onDeactivated(() => {
      removeAllEvents()
    })

    expose({
      destroy: () => removeAllEvents()
    })

    return () => {
      return (
        <>
          <div ref={playerRef} class={`${className}-container`}>
            <video
              ref={player}
              src={videoSource.value}
              autoplay={props.autoplay}
              controls={false}
            />
            <div class={`${className}-mask`}>
              <div
                onClick={() => (isPlaying.value ? pause() : play())}
                class={`${className}-play-pause`}
              />
              <Loading ref={(e) => (loadingLayer.value = e)} prefixCls={`${className}`} />
            </div>
            <div class={`${className}-dashboard`}>
              <Progress ref={progressLayer} prefixCls={`${className}-progress`} />
              <div class={`${className}-controls`}>
                <div class={`${className}-controls-playback`}>
                  <PlayBack ref={playbackLayer} prefixCls={`${className}-playback`} />
                </div>
                <div class={`${className}-controls-settings`}>
                  <Volume
                    ref={volumeLayer}
                    muted={props.muted}
                    prefixCls={`${className}-controls-volume`}
                  />
                  {isFullscreen.value ? (
                    <i onClick={toggle} class="playerfont icon player-ExitFullScreen" />
                  ) : (
                    <i onClick={toggle} class="playerfont icon player-FullScreen" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )
    }
  }
})

export default GPlayerVideo
