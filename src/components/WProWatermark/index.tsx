import { computed, defineComponent, ref, watch } from 'vue'
import config from '/config/config'
import styles from './style.module.less'

const { waterMarkTitle } = config.defaultSettings

export default defineComponent({
  props: {
    content: {
      type: String
    },
    style: {
      type: CSSStyleSheet
    },
    className: {
      type: String
    },
    markStyle: {
      type: CSSStyleSheet
    },
    markClassName: {
      type: String
    },
    zIndex: {
      type: Number,
      default: 9
    },
    gapX: {
      type: Number,
      default: 212
    },
    gapY: {
      type: Number,
      default: 222
    },
    width: {
      type: Number,
      default: 120
    },
    height: {
      type: Number,
      default: 64
    },
    rotate: {
      type: Number,
      default: -22
    },
    offsetLeft: {
      type: Number
    },
    offsetTop: {
      type: Number
    },
    image: {
      type: String
    },
    fontSize: {
      type: Number,
      default: 16
    },
    fontColor: {
      type: String,
      default: 'rgba(0,0,0,.15)'
    },
    fontStyle: {
      type: String,
      default: 'normal'
    },
    fontWeight: {
      type: String,
      default: 'normal'
    },
    fontFamily: {
      type: String,
      default: 'sans-serif'
    }
  },
  setup(props, { slots }) {
    const base64Url = ref('')
    const defaultClassName = 'wd-pro-watermark'
    const defaultStyle = computed(() => {
      const style: any = {
        zIndex: props.zIndex,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundSize: `${props.gapX + props.width}px`,
        pointerEvents: 'none',
        backgroundRepeat: 'repeat',
        backgroundImage: `url(${base64Url.value})`,
        ...props.markStyle,
      }
      return style
    })
    const getPixelRatio = (context: any) => {
      if (!context) {
        return 1
      }
      const backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1
      return (window.devicePixelRatio || 1) / backingStore
    }
    const createBase64 = (newProps: any) => {
      const content = newProps.content || waterMarkTitle || 'Wd Pro Admin'
      const canvas = document.createElement('canvas')
      const ctx: any = canvas.getContext('2d')
      const ratio = getPixelRatio(ctx)

      const canvasWidth = `${(newProps.gapX + newProps.width) * ratio}px`
      const canvasHeight = `${(newProps.gapY + newProps.height) * ratio}px`
      const canvasOffsetLeft = newProps.offsetLeft || newProps.gapX / 2
      const canvasOffsetTop = newProps.offsetTop || newProps.gapY / 2

      canvas.setAttribute('width', canvasWidth)
      canvas.setAttribute('height', canvasHeight)

      if (ctx) {
        ctx.translate(canvasOffsetLeft * ratio, canvasOffsetTop * ratio)
        ctx.rotate((Math.PI / 180) * Number(newProps.rotate))
        const markWidth = newProps.width * ratio
        const markHeight = newProps.height * ratio

        if (newProps.image) {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.referrerPolicy = 'no-referrer'
          img.src = newProps.image
          img.onload = () => {
            ctx.drawImage(img, 0, 0, markWidth, markHeight)
            base64Url.value = (canvas.toDataURL())
          }
        } else if (content) {
          const markSize = Number(newProps.fontSize) * ratio
          ctx.font = `${newProps.fontStyle} normal ${newProps.fontWeight} ${markSize}px/${markHeight}px ${newProps.fontFamily}`
          ctx.fillStyle = newProps.fontColor
          ctx.fillText(content, 0, 0)
          base64Url.value = (canvas.toDataURL())
        }
      }
    }
    watch(
      () => props,
      (newProps) => {
        createBase64(newProps)
      },
      {
        deep: true,
        immediate: true
      }
    )
    return () => (
      <div
        style={{
          position: 'relative',
          ...props.style,
        }}
        class={styles[`${defaultClassName}-wrapper`]}
      >
        {
          slots && slots.default ? slots.default() : null
        }
        <div
          class={[ props.markClassName, styles[`${defaultClassName}`] ]}
          style={defaultStyle.value}
        />
      </div>
    )
  }
})
