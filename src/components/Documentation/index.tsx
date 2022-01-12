import { computed, defineComponent, ExtractPropTypes } from 'vue'
import { useMediaQuery } from '@gx-admin/hooks/event'
import { getPrefixCls } from '@gx-admin/utils'
import { PropTypes } from '/@/utils'

import './style.less'

export const documentationProps = {
  anchorLinks: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  contentStyle: PropTypes.style
}

export type DocumentationProps = Partial<ExtractPropTypes<typeof documentationProps>>;

export default defineComponent({
  name: 'GDocumentation',
  props: documentationProps,
  setup(props, { slots }) {
    const prefixCls = getPrefixCls({
      suffixCls: 'documentation'
    })

    const colSize = useMediaQuery()

    const isMobile = computed(
      () => (colSize.value === 'sm' || colSize.value === 'xs')
    )

    const classNames = computed(() => {
      return {
        [`${prefixCls}`]: true
      }
    })

    return () => (
      <div class={classNames.value} style={props.contentStyle}>
        <g-anchor links={props.anchorLinks} />
        <div style={{ paddingRight: isMobile.value ? undefined : '208px' }}>
          {slots.default?.()}
        </div>
      </div>
    )
  }
})
