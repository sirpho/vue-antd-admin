import {
  computed,
  defineComponent,
  ExtractPropTypes,
  PropType,
  Ref,
  ref
} from 'vue'
import type { AutoCompleteProps } from 'ant-design-vue/es/auto-complete'
import { SearchOutlined } from '@ant-design/icons-vue'
import { PropTypes } from '/@/utils'
import { getPrefixCls } from '/@/components/_util'

export const headerSearchProps = {
  onSearch: {
    type: Function as PropType<(value?: string) => void>
  },
  onChange: {
    type: Function as PropType<(value?: string) => void>
  },
  onVisibleChange: {
    type: Function as PropType<(value?: string) => void>
  },
  className: {
    type: String as PropType<String>
  },
  placeholder: {
    type: String as PropType<String>
  },
  options: {
    type: Array as PropType<AutoCompleteProps['options']>
  },
  defaultVisible: PropTypes.looseBool,
  visible: PropTypes.looseBool,
  defaultValue: {
    type: String as PropType<String>
  },
  value: {
    type: String as PropType<String>
  }
}

export type HeaderSearchProps = Partial<ExtractPropTypes<typeof headerSearchProps>>;

export default defineComponent({
  name: 'HeaderSearch',
  props: headerSearchProps,
  emits: [
    'chaneg',
    'visibleChange'
  ],
  setup(props, { emit }) {
    const prefixCls = getPrefixCls({
      suffixCls: 'header-search'
    })

    const inputRef = ref()

    const searchValue: Ref<any> = ref(props.defaultValue || props.value)

    const searchMode: Ref<boolean | undefined> = ref((props.defaultVisible ?? false) || props.visible)

    const inputClass = computed(() => {
      return {
        [`${prefixCls}-input`]: true,
        [`${prefixCls}-show`]: searchMode.value
      }
    })

    const onChange = (value: string) => {
      searchValue.value = value
      emit('chaneg', value)
    }

    const onVisibleChange = (value) => {
      searchMode.value = value
      emit('visibleChange', value)
    }

    return () => {
      const {
        className,
        defaultValue,
        placeholder,
        ...restProps
      } = props

      return (
        <div
          class={[ prefixCls, className ]}
          onClick={() => {
            onVisibleChange(true)
            if (searchMode.value && inputRef.value) {
              inputRef.value.focus()
            }
          }}
        >
          <SearchOutlined
            key="Icon"
            style={{
              cursor: 'pointer'
            }}
          />
          <a-auto-complete
            key="AutoComplete"
            class={inputClass.value}
            value={searchValue.value}
            options={restProps.options}
            onChange={onChange}
          >
            <a-input
              size="small"
              ref={e => inputRef.value = e}
              defaultValue={defaultValue}
              aria-label={placeholder}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (restProps.onSearch) {
                    restProps.onSearch(searchValue.value)
                  }
                }
              }}
              onBlur={() => {
                onVisibleChange(false)
              }}
            />
          </a-auto-complete>
        </div>
      )
    }
  }
})
