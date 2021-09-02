import {  CSSProperties, defineComponent } from 'vue'
import config from '/config/config'

const { waterMark } = config.defaultSettings

export default defineComponent({
  props: {
    contentStyle: CSSStyleSheet as PropType<CSSProperties>
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
