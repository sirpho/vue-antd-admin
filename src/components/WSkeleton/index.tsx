import { computed, defineComponent, ref, watch, Ref, ExtractPropTypes } from 'vue'
import wSkeletonProps from './props'
import styles from './style.module.less'

const button = [ 'circle', 'round', 'default' ]
const avatar = [ 'circle', 'square' ]

export type WSkeletonProps = Partial<ExtractPropTypes<typeof wSkeletonProps>>;

export default defineComponent({
  props: wSkeletonProps,
  setup(props, { slots }) {
    const defaultClassName = 'wd-skeleton'
    const active: Ref<String> = ref(props.type)
    watch(() => props.type, (val) => {
      active.value = val
    }, {
      deep: true,
      immediate: true
    })
    const handelType = computed(() => {
      let show
      switch (active.value) {
        case 'button':
          show = renderTypeDefault()
          break
        case 'avatar':
          show = renderTypeDefault()
          break
        case 'input':
          show = renderTypeInput()
          break
        case 'image':
          show = renderTypeImage()
          break
      }
      return show
    })
    const handelSizeClass = computed(() => {
      if (props.size === 'default' || typeof props.size === 'number') return ''
      return styles[`${defaultClassName}-${active.value}-${props.size}`]
    })
    const handelSize = computed(() => {
      let style = {}
      if (typeof props.size === 'number') {
        switch (active.value) {
          case 'button':
            break
          case 'avatar':
            style = {
              width: `${props.size}px`,
              height: `${props.size}px`,
              lineHeight: `${props.size}px`
            }
            break
          case 'input':
            break
          case 'image':
            break
        }
      }
      return style
    })
    const handelShape = computed(() => {
      let shape
      switch (active.value) {
        case 'button':
          shape = button.find(item => item === props.shape) || 'default'
          break
        case 'avatar':
          shape = avatar.find(item => item === props.shape) || 'circle'
          break
      }
      return styles[`${defaultClassName}-${active.value}-${shape}`]
    })
    const renderTypeDefault = () => (
      <span
        style={{ ...props.propsStyle, ...handelSize.value }}
        class={
          props.shape ?
            [
              styles[`${defaultClassName}-${active.value}`],
              handelSizeClass.value,
              handelShape.value
            ]
            :
            [ styles[`${defaultClassName}-${active.value}`], handelSizeClass.value ]
        }
      />
    )
    const renderTypeInput = () => (
      <span
        style={{ width: '200px', ...props.propsStyle }}
        class={[ styles[`${defaultClassName}-${active.value}`], handelSizeClass.value ]}
      />
    )
    const renderTypeImage = () => (
      <div class={styles[`${defaultClassName}-${active.value}`]}>
        <svg viewBox="0 0 1098 1024"
          xmlns="http://www.w3.org/2000/svg"
          class={styles[`${defaultClassName}-image-svg`]}>
          <path d="M365.714286 329.142857q0 45.714286-32.036571 77.677714t-77.677714 32.036571-77.677714-32.036571-32.036571-77.677714 32.036571-77.677714 77.677714-32.036571 77.677714 32.036571 32.036571 77.677714zM950.857143 548.571429l0 256-804.571429 0 0-109.714286 182.857143-182.857143 91.428571 91.428571 292.571429-292.571429zM1005.714286 146.285714l-914.285714 0q-7.460571 0-12.873143 5.412571t-5.412571 12.873143l0 694.857143q0 7.460571 5.412571 12.873143t12.873143 5.412571l914.285714 0q7.460571 0 12.873143-5.412571t5.412571-12.873143l0-694.857143q0-7.460571-5.412571-12.873143t-12.873143-5.412571zM1097.142857 164.571429l0 694.857143q0 37.741714-26.843429 64.585143t-64.585143 26.843429l-914.285714 0q-37.741714 0-64.585143-26.843429t-26.843429-64.585143l0-694.857143q0-37.741714 26.843429-64.585143t64.585143-26.843429l914.285714 0q37.741714 0 64.585143 26.843429t26.843429 64.585143z"
            class={styles[`${defaultClassName}-image-path`]}></path>
        </svg>
      </div>
    )
    const renderSkeleton = () => (
      <div
        class={
          props.active ?
            [
              styles[defaultClassName],
              styles[`${defaultClassName}-element`],
              styles[`${defaultClassName}-active`]
            ]
            :
            [ styles[defaultClassName], styles[`${defaultClassName}-element`] ]
        }
      >
        {handelType.value}
      </div>
    )
    return () => (
      <>
        {
          props.loading ?
            renderSkeleton()
            :
            slots && slots.default ? slots.default() : renderSkeleton()
        }
      </>
    )
  }
})
