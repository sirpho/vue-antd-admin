import type { CSSProperties, ExtractPropTypes } from 'vue'
import { computed, defineComponent, ref, Teleport, watch, onDeactivated, onUnmounted } from 'vue'
import { Empty } from 'ant-design-vue'
import { default as ResizeObserver } from 'ant-design-vue/es/vc-resize-observer'
import Player from 'xgplayer'
import Music from 'xgplayer-music'
import Nodata from '/@/assets/public_images/nodata.png'
import MusicPng from '/@/assets/public_images/music.png'
import global from '/@/common/global'
import { getPrefixCls } from '@gx-admin/utils'
import { getFileSuffix, getRandomNumber } from '/@/utils/util'
import { isString, isArray } from '/@/utils/validate'
import { gMaterialViewProps } from './props'

import './style.less'

export type GMaterialViewProps = Partial<ExtractPropTypes<typeof gMaterialViewProps>>

const videoPlayerConfig = {
  id: 'g-video-player',
  autoplay: false,
  ignores: ['fullscreen'],
  loop: true,
  download: true,
  fluid: true,
  videoInit: true,
  cssFullscreen: true,
  screenShot: true,
  playbackRate: [0.5, 0.75, 1, 1.5, 2],
  pip: true,
  lang: 'zh-cn',
  enterLogo: {
    url: '',
    width: 231,
    height: 42
  },
  enterBg: {
    color: 'rgba(0,0,0,0.87)'
  },
  enterTips: {
    background:
      'linear-gradient(to right, rgba(0,0,0,0.87), #3D96FD, rgba(86,195,248), #3D96FD, rgba(0,0,0,0.87))'
  }
}

const audioPlayerConfig = {
  id: 'g-video-player'
}

export default defineComponent({
  props: gMaterialViewProps,
  emits: ['update:visible', 'change'],
  setup(props, { attrs, emit }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'material-view'
    })

    const musicPlayer = ref()
    const videoPlayer = ref()
    const responsive = ref(false)
    const showViewer = ref(false)
    const spinning = ref(false)
    const spinningTip = ref('正在加载中...')
    const skeletonLoading = ref(false)

    const getModalTitle = computed(() => (props.type === '2' ? '音频播放' : '视频播放'))

    const getViewUrl = computed(() => {
      if (props.type === '1' && isString(props.url)) {
        return [props.url]
      }
      if ((props.type === '2' || props.type === '3') && isArray(props.url)) {
        return props.url[0]
      }
      return props.url
    })

    const allowPlay = computed(() => {
      if (props.type === '1') {
        return true
      }
      const fileSuffix = getFileSuffix(getViewUrl.value as string)
      if (props.type === '2') {
        return global.audioAllowType.includes(fileSuffix.toLowerCase())
      }
      return global.videoAllowType.includes(fileSuffix.toLowerCase())
    })

    const getPlayerConfig = computed(() => {
      if (props.type === '1') {
        return props.config || {}
      }
      if (props.type === '2') {
        return {
          ...audioPlayerConfig,
          ...props.config
        }
      }
      return {
        ...videoPlayerConfig,
        ...props.config
      }
    })

    const getClassName = computed(() => {
      return {
        [`${baseClassName}`]: true,
        [`${attrs.class}`]: attrs.class
      }
    })

    const getPlayerStyle = computed(() => {
      return {
        height: '100%',
        ...props.playerStyle
      } as CSSProperties
    })

    const setResponsive = (value: boolean) => {
      responsive.value = value
    }

    const openViewer = () => {
      if (props.type !== '1') {
        spinning.value = true
        setTimeout(() => {
          if (props.type === '2') {
            musicPlayer.value = new Music({
              ...getPlayerConfig.value,
              url: [
                {
                  src: getViewUrl.value as string,
                  name: 'song01',
                  vid: getRandomNumber().uuid(15),
                  poster: MusicPng
                }
              ]
            })
          } else {
            videoPlayer.value = new Player({
              ...getPlayerConfig.value,
              url: getViewUrl.value as string
            })
          }
          spinning.value = false
        }, 1000)
      }
    }

    const closeViewer = () => {
      spinning.value = false
      spinningTip.value = '正在加载中...'
      if (allowPlay.value) {
        videoPlayer.value &&
          typeof videoPlayer.value?.destroy === 'function' &&
          videoPlayer.value?.destroy()
      }
      videoPlayer.value = null
      musicPlayer.value = null
      showViewer.value = false
      emit('update:visible', false)
      emit('change', showViewer.value)
    }

    watch(
      () => props.visible,
      (visible) => {
        showViewer.value = visible
        if (visible) {
          openViewer()
        }
      }
    )

    onUnmounted(() => {
      showViewer.value = false
      emit('update:visible', false)
      emit('change', false)
    })

    onDeactivated(() => {
      showViewer.value = false
      emit('update:visible', false)
      emit('change', false)
    })

    const renderModalContent = () => (
      <>
        {allowPlay.value && getPlayerConfig.value?.id ? (
          <div
            style={
              props.type === '2'
                ? { height: '50px' }
                : props.type === '3'
                ? { height: responsive.value ? '400px' : '590px' }
                : undefined
            }
            class={`${baseClassName}-player`}
          >
            <div style={getPlayerStyle.value} id={getPlayerConfig.value?.id} />
          </div>
        ) : (
          <Empty image={Nodata} description="该格式不支持在线播放" />
        )}
      </>
    )

    return () => {
      const { type } = props
      return (
        <ResizeObserver
          key="resize-observer"
          onResize={({ width }) => {
            setResponsive(width < 1540)
          }}
        >
          {type && getViewUrl.value && (
            <div class={getClassName.value}>
              <Teleport to="body">
                {showViewer.value && type === '1' && (
                  <g-image-viewer urlList={getViewUrl.value} onClose={() => closeViewer()} />
                )}
              </Teleport>
              <g-pro-modal
                class={baseClassName}
                title={getModalTitle.value}
                visible={showViewer.value && type !== '1'}
                width={850}
                showDefaultFooter
                adaptive={type === '3'}
                skeletonLoading={skeletonLoading.value}
                spinning={spinning.value}
                spinningTip={spinningTip.value}
                onCancel={() => closeViewer()}
              >
                {renderModalContent()}
              </g-pro-modal>
            </div>
          )}
        </ResizeObserver>
      )
    }
  }
})
