import { defineComponent } from 'vue'
import config from '/config/config'
import { PropTypes } from '/@/utils'

const { waterMark } = config.defaultSettings

export default defineComponent({
  name: 'GProPageWrapper',
  props: {
    contentStyle: PropTypes.style
  },
  setup(props, { slots }) {

    return () => (
      <div class="gx-pro-page-wrapper">
        <div class="gx-pro-grid-content">
          {
            waterMark ?
              <div class="gx-pro-grid-content-children" style={props.contentStyle}>
                <g-pro-watermark>
                  {slots.default?.()}
                </g-pro-watermark>
              </div>
              :
              <div class="gx-pro-grid-content-children" style={props.contentStyle}>
                {slots.default?.()}
              </div>
          }
        </div>
      </div>
    )

  }
})
