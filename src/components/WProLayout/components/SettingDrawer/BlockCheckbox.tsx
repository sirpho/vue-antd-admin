import { computed, defineComponent } from 'vue'
import { CheckOutlined } from '@ant-design/icons-vue'
import { PropTypes } from '/@/utils'

const BlockCheckboxProps = {
  value: PropTypes.string,
  list: PropTypes.array,
  className: PropTypes.string
}

const BlockCheckbox = defineComponent({
  props: BlockCheckboxProps,
  emits: [ 'change' ],
  setup(props, { emit }) {
    const baseClassName = computed(() => `${props.className}-block-checbox`)

    const items = computed(() => props.list || [
      {
        key: 'side',
        title: '侧边菜单布局'
      },
      {
        key: 'mix',
        title: '混合菜单布局'
      }
    ])

    const disableStyle = {
      cursor: 'not-allowed'
    }

    const handleChange = (key: string) => {
      emit('change', key)
    }

    return () => {
      const { value } = props
      return (
        <div class={baseClassName.value} key={value} style={{ minHeight: '42px' }}>
          {items.value.map((item: any) => (
            <a-tooltip title={item.title} key={item.title}>
              <div
                class={[ `${baseClassName.value}-item`, `${baseClassName.value}-item-${item.key}` ]}
                style={item.disable && disableStyle}
                onClick={() => !item.disabled && handleChange(item.key)}
              >
                <CheckOutlined
                  class={`${baseClassName.value}-selectIcon`}
                  style={{
                    display: value === item.key ? 'block' : 'none'
                  }}
                />
              </div>
            </a-tooltip>
          ))}
        </div>
      )
    }
  }
})

export default BlockCheckbox
