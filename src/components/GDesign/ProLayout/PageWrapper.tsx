import { defineComponent } from 'vue'
import config from '/config/config'
import { getPrefixCls } from '@gx-admin/utils'
import { PropTypes } from '/@/utils'

const { waterMark } = config.defaultSettings

export default defineComponent({
  name: 'GProPageWrapper',
  props: {
    contentStyle: PropTypes.style
  },
  setup(props, { slots }) {
    const pageWrapper = getPrefixCls({
      suffixCls: 'page-wrapper',
      isPor: true
    })

    const gridPrefixCls = getPrefixCls({
      suffixCls: 'grid-content',
      isPor: true
    })

    return () => (
      <div class={pageWrapper}>
        <div class={gridPrefixCls}>
          {
            waterMark ?
              <div class={`${gridPrefixCls}-children`} style={props.contentStyle}>
                <g-pro-watermark>
                  {slots.default?.()}
                </g-pro-watermark>
              </div>
              :
              <div class={`${gridPrefixCls}-children`} style={props.contentStyle}>
                {slots.default?.()}
              </div>
          }
        </div>
      </div>
    )

  }
})
