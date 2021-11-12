import { defineComponent } from 'vue'
import config from '/config/config'
import { PropTypes } from '/@/utils'

const { waterMark } = config.defaultSettings

export default defineComponent({
  props: {
    contentStyle: PropTypes.style
  },
  setup(props, { slots }) {

    return () => (
      <div class="wd-pro-page-wrapper">
        <div class="wd-pro-grid-content">
          {
            waterMark ?
              <div class="wd-pro-grid-content-children" style={props.contentStyle}>
                <w-pro-watermark>
                  {slots.default?.()}
                </w-pro-watermark>
              </div>
              :
              <div class="wd-pro-grid-content-children" style={props.contentStyle}>
                {slots.default?.()}
              </div>
          }
        </div>
      </div>
    )

  }
})
