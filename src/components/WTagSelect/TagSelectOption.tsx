import { defineComponent, ExtractPropTypes } from 'vue'
import { tagSelectOptionProps } from './props'

export type TagSelectOptionProps = Partial<ExtractPropTypes<typeof tagSelectOptionProps>>;

const WTagSelectOption = defineComponent({
  name: 'WTagSelectOption',
  props: tagSelectOptionProps,
  inheritAttrs: false,
  setup(props, { slots }) {
    return () => (
      <a-checkable-tag
        checked={!!props.checked}
        key={props.value}
        onChange={(state) => props.onChange && props.onChange(props.value || '', state)}
      >
        {slots.default?.()}
      </a-checkable-tag>
    )
  }
})

WTagSelectOption.isTagSelectOption = true

export default WTagSelectOption
