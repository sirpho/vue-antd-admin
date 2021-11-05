import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch,
  CSSProperties,
  Teleport
} from 'vue'
import isServer from '/@/components/_util/isServer'
import { getPrefixCls, getPropsSlot } from '/@/components/_util'
import ImageViewer from './components/ImageViewer'
import { wImagePorps } from './props'

import './style.less'

const isSupportObjectFit = () => document.documentElement.style.objectFit !== undefined

let prevOverflow = ''

const ObjectFit = {
  NONE: 'none',
  CONTAIN: 'contain',
  COVER: 'cover',
  FILL: 'fill',
  SCALE_DOWN: 'scale-down'
}

const WImage = defineComponent({
  props: wImagePorps,
  name: 'WImage',
  inheritAttrs: false,
  emits: [ 'error' ],
  setup(props, { slots, emit, attrs }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'image',
      defaultPrefixCls: 'wd'
    })

    const hasLoadError = ref(false)
    const loading = ref(true)
    const imgWidth = ref(0)
    const imgHeight = ref(0)
    const showViewer = ref(false)
    const container = ref<any>(null)

    const imageStyle = computed(() => {
      const { fit } = props
      if (!isServer && fit) {
        return isSupportObjectFit()
          ? { 'object-fit': fit }
          : getImageStyle(fit)
      }
      return {}
    })

    const alignCenter = computed(() => {
      const { fit } = props
      return !isServer && !isSupportObjectFit() && fit !== ObjectFit.FILL
    })

    const preview = computed(() => {
      const { previewSrcList } = props
      return Array.isArray(previewSrcList) && previewSrcList.length > 0
    })
    const imageIndex = computed(() => {
      const { src, previewSrcList } = props
      let previewIndex = 0
      const srcIndex = previewSrcList.indexOf(src)
      if (srcIndex >= 0) {
        previewIndex = srcIndex
      }
      return previewIndex
    })

    const getAttrs = computed(() => attrs)

    const getImageStyle = (fit) => {
      const imageWidth = imgWidth.value
      const imageHeight = imgHeight.value

      if (!container.value) return {}
      const {
        clientWidth: containerWidth,
        clientHeight: containerHeight
      } = container.value
      if (!imageWidth || !imageHeight || !containerWidth || !containerHeight) return {}

      const imageAspectRatio = imageWidth / imageHeight
      const containerAspectRatio = containerWidth / containerHeight

      if (fit === ObjectFit.SCALE_DOWN) {
        const isSmaller = imageWidth < containerWidth && imageHeight < containerHeight
        fit = isSmaller ? ObjectFit.NONE : ObjectFit.CONTAIN
      }

      switch (fit) {
        case ObjectFit.NONE:
          return { width: 'auto', height: 'auto' }
        case ObjectFit.CONTAIN:
          return (imageAspectRatio < containerAspectRatio) ? { width: 'auto' } : { height: 'auto' }
        case ObjectFit.COVER:
          return (imageAspectRatio < containerAspectRatio) ? { height: 'auto' } : { width: 'auto' }
        default:
          return {}
      }
    }

    const loadImage = () => {
      if (isServer) return

      const attributes = getAttrs.value

      // reset status
      loading.value = true
      hasLoadError.value = false

      const img = new Image()
      img.onload = e => handleLoad(e, img)
      img.onerror = handleError

      // bind html attrs
      // so it can behave consistently
      Object.keys(attributes)
        .forEach(key => {
          // avoid onload to be overwritten
          if (key.toLowerCase() === 'onload') return
          const value = attributes[key] as string
          img.setAttribute(key, value)
        })
      img.src = props.src
    }

    const handleLoad = (_: Event, img: HTMLImageElement) => {
      imgWidth.value = img.width
      imgHeight.value = img.height
      loading.value = false
      hasLoadError.value = false
    }

    const handleError = (e: Event) => {
      loading.value = false
      hasLoadError.value = true
      emit('error', e)
    }

    const clickHandler = () => {
      if (!preview.value || props.disablePreview) {
        return
      }
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      showViewer.value = true
    }

    const closeViewer = () => {
      document.body.style.overflow = prevOverflow
      showViewer.value = false
    }

    watch(() => props.src, () => {
      loadImage()
    })

    onMounted(() => {
      loadImage()
    })

    return () => {
      const fallbackRender = getPropsSlot(slots, props, 'fallback')
      const placeholderRender = getPropsSlot(slots, props, 'placeholder')

      return (
        <>
          <div
            ref={e => container.value = e}
            style={(getAttrs.value.style || {}) as CSSProperties}
          >
            {
              loading.value
                ? (
                  placeholderRender || (
                    <div class={`${baseClassName}-placeholder`} />
                  )
                )
                : hasLoadError.value
                  ? (
                    fallbackRender || (
                      <div class={`${baseClassName}-error`}>
                        加载失败
                      </div>
                    )
                  )
                  : (
                    <img
                      class={{
                        [`${baseClassName}-inner`]: true,
                        [`${baseClassName}-inner-center`]: alignCenter.value,
                        [`${baseClassName}-preview`]: preview.value
                      }}
                      {...getAttrs.value}
                      src={props.src}
                      style={imageStyle.value as CSSProperties}
                      onClick={() => clickHandler()}
                    />
                  )
            }
            <Teleport to="body" disabled={!props.appendToBody}>
              {preview.value && showViewer.value && (
                <ImageViewer
                  zIndex={props.zIndex}
                  initialIndex={imageIndex.value}
                  urlList={props.previewSrcList}
                  onHideOnClickModal={props.hideOnClickModal}
                  onClose={() => closeViewer()}
                />
              )}
            </Teleport>
          </div>
        </>
      )
    }
  }
})

WImage.isWImage = true

export default WImage
