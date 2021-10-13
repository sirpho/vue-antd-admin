import { computed, defineComponent, FunctionalComponent } from 'vue'
import { CheckOutlined } from '@ant-design/icons-vue'
import { changeTheme } from '/@/components/_util/theme'
import { PropTypes } from '../../utils'

const ThemeColorProps = {
  title: PropTypes.string,
  value: PropTypes.string,
  colors: PropTypes.array,
  className: PropTypes.string
}

const Tag: FunctionalComponent<{ color: string; check: boolean; className: string }> = ({
  color,
  check,
  className
}) => {

  return (
    <div class={`${className}-block`} style={{ backgroundColor: color }}>
      { check ? <CheckOutlined /> : null }
    </div>
  )
}

const ThemeColor = defineComponent({
  props: ThemeColorProps,
  emits: [ 'change' ],
  setup(props, { emit }) {
    const baseClassName = computed(() => `${props.className}-theme-color`)

    const handleChange = (key: string) => {
      emit('change', key)
      changeTheme(key)
    }

    return () => {
      const { value, title, colors = [], className } = props
      return (
        <div class={baseClassName.value} style={{ marginBottom: '24px' }}>
          <h3 class={`${className}-title`}>{title}</h3>
          <div class={`${baseClassName.value}-content`}>
            {colors.map((item: any) => {
              const check = value === item.color
              return (
                <a-tooltip key={item.color} title={item.fileName}>
                  <Tag
                    className={className}
                    class={`${baseClassName.value}-block`}
                    color={item.color}
                    check={check}
                    onClick={() => handleChange(item.color)}
                  />
                </a-tooltip>
              )
            })}
          </div>
        </div>
      )
    }
  }
})

export default ThemeColor
