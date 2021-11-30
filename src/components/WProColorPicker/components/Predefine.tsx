import { ref, watch, watchEffect, defineComponent, inject } from 'vue'
import Color from '../colors'
import styles from '../style.module.less'

export default defineComponent({
  props: {
    colors: { type: Array, required: true },
    color: {
      type: Object as PropType<Color>,
      required: true
    }
  },
  setup(props) {
    const defaultClassName = 'wd-pro-color'

    const currentColor: any = inject('currentColor')

    const parseColors = (colors, color) => {
      return colors.map(value => {
        const c = new Color()
        c.enableAlpha = true
        c.format = 'rgba'
        c.fromString(value)
        c.selected = c.value === color.value
        return c
      })
    }

    //data
    const rgbaColors = ref(parseColors(props.colors, props.color))

    //watch
    watch(() => currentColor.value, val => {
      const color = new Color()
      color.fromString(val)

      rgbaColors.value.forEach(item => {
        item.selected = color.compare(item)
      })
    })
    watchEffect(() => {
      rgbaColors.value = parseColors(props.colors, props.color)
    })

    const handleSelect = (index) => {
      props.color.fromString(props.colors[index])
    }

    const handleRgbaClass = (record) => {
      const className = [ styles[`${defaultClassName}-predefine-color-selector`] ]
      if (record.selected) className.push(styles.selected)
      if (record._alpha < 100) className.push(styles['is-alpha'])
      return className
    }

    return () => (
      <div class={styles[`${defaultClassName}-predefine`]}>
        <div class={styles[`${defaultClassName}-predefine-colors`]}>
          {
            rgbaColors.value.map((item, index) => (
              <div
                key={index}
                class={handleRgbaClass(item)}
                onClick={() => handleSelect(index)}
              >
                <div style={{ backgroundColor: item.value }}></div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
})
