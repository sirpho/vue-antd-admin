import {
  computed,
  defineComponent,
  nextTick, onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  provide,
  watch
} from 'vue'
import { debounce } from 'lodash'
import { getPrefixCls } from '@gx-design/pro-utils'
import { proColorProps } from './props'
import Color from './colors'
import HueSlider from './components/HueSlider'
import SvPanel from './components/SvPanel'
import AlphaSlider from './components/AlphaSlider'
import Predefine from './components/Predefine'

import './style.less'

export default defineComponent({
  props: proColorProps,
  emits: [ 'change', 'update:value' ],
  setup(props, { emit }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'color',
      defaultPrefixCls: 'wd'
    })

    const root = ref<any>(null)
    const hue = ref(null)
    const svPanel = ref(null)
    const alpha = ref(null)
    const predefine = ref(null)

    const color = reactive(new Color({
      enableAlpha: props.showAlpha,
      format: props.colorFormat || ''
    })) as Color

    const showPicker = ref(false)
    const customInput = ref('')

    const currentColor = computed(() => {
      return !props.value ? '' : color.value
    })
    // watch
    watch(() => props.value, (val) => {
      if ((val || val == '') && val !== color.value) {
        color.fromString(val)
      }
      if (val && val.includes('rgba')) {
        color.setState({
          enableAlpha: true,
          format: 'rgb'
        })
      } else if (val && val.includes('hex')) {
        color.setState({
          enableAlpha: false,
          format: 'hex'
        })
      }
    }, {
      deep: true,
      immediate: true
    })

    watch(() => color.value, (value) => {
      emit('update:value', value)
      emit('change', value)
    })

    const setShowPicker = (value) => {
      showPicker.value = value
    }

    const debounceSetShowPicker = debounce(setShowPicker, 100)

    const hide = () => {
      debounceSetShowPicker(false)
      resetColor()
    }

    const resetColor = () => {
      nextTick(() => {
        if (props.value) color.fromString(props.value)
      })
    }

    onMounted(() => {
      document.addEventListener('mousedown', (e: any) => {
        const color = document.getElementsByClassName('wd-pro-color')[0]
        const picker = document.getElementsByClassName('wd-pro-color-picker')[0]
        if (!e.path.includes(color) && !e.path.includes(picker)) {
          hide()
        }
      })
      if (props.value) {
        color.fromString(props.value)
        customInput.value = currentColor.value
      }
    })

    onBeforeUnmount(() => {
      document.removeEventListener('mousedown', () => {})
    })

    const handleShowPicker = () => {
      if (props.disabled || props.readonly) return
      showPicker.value = true
    }

    provide('currentColor', currentColor)

    const contentSlot = () => (
      <>
        <div class={`${baseClassName}-main-wrapper`}>
          <HueSlider className={baseClassName} class="hue-slider" ref={e => hue.value = e} color={color} vertical />
          <SvPanel className={baseClassName} ref={e => svPanel.value = e} color={color} />
        </div>
        {
          (props.value && props.value.includes('rgba')) || props.showAlpha ?
            <AlphaSlider className={baseClassName} ref={e => alpha.value = e} color={color} />
            :
            null
        }
        {
          props.predefine ?
            <Predefine className={baseClassName} ref={e => predefine.value = e} color={color} colors={props.predefine} />
            :
            null
        }
      </>
    )

    return () => (
      <div class="wd-pro-color-warp" ref={e => root.value = e}>
        <a-popover
          trigger="click"
          placement="right"
          get-popup-container={() => root.value}
          overlayClassName={[ baseClassName, `${baseClassName}-popover` ]}
          visible={showPicker.value}
          content={contentSlot()}
        >
          <div
            class={{
              [`${baseClassName}-picker`]: true,
              [`${baseClassName}-color-picker`]: true,
            }}
            onClick={() => handleShowPicker()}
          >
            {props.disabled && (
              <div class={`${baseClassName}-color-picker-disabled`} />
            )}
            <div
              style={{
                backgroundColor: color.value,
                width: '36px',
                height: '14px',
                borderRadius: '2px'
              }}
            />
          </div>
        </a-popover>
      </div>
    )
  }
})
