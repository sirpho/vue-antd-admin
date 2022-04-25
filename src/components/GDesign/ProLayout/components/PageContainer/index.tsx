import { defineComponent } from 'vue'
import { Card } from 'ant-design-vue'
import config from '/config/config'
import { useMemo } from '@gx-admin/hooks/core'
import { getPrefixCls } from '@gx-admin/utils'
import { PropTypes } from '/@/utils'
import ProWatermark from '@gx-design/ProWatermark'

const { waterMark } = config.defaultSettings

export default defineComponent({
  name: 'GProPageWrapper',
  props: {
    contentStyle: PropTypes.style,
    useCard: PropTypes.bool.def(true)
  },
  setup(props, { slots }) {
    const prefixedClassName = getPrefixCls({
      suffixCls: 'page-container',
      isPor: true
    })

    const gridPrefixCls = getPrefixCls({
      suffixCls: 'grid-content',
      isPor: true
    })

    const slotsDom = useMemo(() => (
      <>{props.useCard ? <Card bordered={false}>{slots.default?.()}</Card> : slots.default?.()}</>
    ))

    const content = useMemo(() => (
      <div class={`${prefixedClassName}-children-content`}>{slotsDom.value}</div>
    ))

    const renderContentDom = useMemo(() => (
      <>{waterMark ? <ProWatermark>{content.value}</ProWatermark> : content.value}</>
    ))

    return () => {
      return (
        <div class={prefixedClassName}>
          <div class={gridPrefixCls}>
            <div class={`${gridPrefixCls}-children`} style={props.contentStyle}>
              {renderContentDom.value}
            </div>
          </div>
        </div>
      )
    }
  }
})
