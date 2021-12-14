import { h, ref, defineComponent } from 'vue'
import { RenderableComponent } from '@gx-design/pro-hooks/typings'
import { onClickOutside } from './index'

export const OnClickOutside = defineComponent<RenderableComponent>({
  name: 'OnClickOutside',
  props: ['as'] as unknown as undefined,
  emits: ['trigger'],
  setup(props, { slots, emit }) {
    const target = ref()
    onClickOutside(target, (e) => {
      emit('trigger', e)
    })

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default())
    }
  },
})