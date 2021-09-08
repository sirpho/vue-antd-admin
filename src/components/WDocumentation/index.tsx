import { computed, defineComponent, ExtractPropTypes } from 'vue'
import PropTypes from '/@/hooks/vue-types'
import { getPrefixCls } from '/@/components/_util'
import useMediaQuery from '/@/components/_util/useMediaQuery'

export const documentationProps = {
  anchorLinks: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  contentStyle: PropTypes.style
}

export type DocumentationProps = Partial<ExtractPropTypes<typeof documentationProps>>;

export default defineComponent({
  name: 'WDocumentation',
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
        <w-anchor links={props.anchorLinks} />
        <div style={{ paddingRight: isMobile.value ? undefined : '208px' }}>
          {slots.default?.()}
        </div>
      </div>
    )
  }
})
