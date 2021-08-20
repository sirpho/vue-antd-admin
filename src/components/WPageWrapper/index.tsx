import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import config from '/config/config'

const { waterMark } = config.defaultSettings

export default defineComponent({
  props: {
    contentStyle: Object as PropType<CSSStyleSheet>
  },
  setup(props, { slots }) {
    const store = useStore()
    const siderRoutes = computed(() => store.getters['routes/siderRoutes'])

    return () => (
      <div class="wd-pro-page-wrapper">
        {
          siderRoutes.value.length === 0 ?
            waterMark ?
              <div>
                <w-pro-watermark>
                  {
                    slots.default ? slots.default() : null
                  }
                </w-pro-watermark>
              </div>
              :
              slots.default ? slots.default() : null
            :
            <div class="wd-pro-grid-content">
              {
                waterMark ?
                  <div class="wd-pro-grid-content-children" style={props.contentStyle}>
                    <w-pro-watermark>
                      {
                        slots.default ? slots.default() : null
                      }
                    </w-pro-watermark>
                  </div>
                  :
                  <div class="wd-pro-grid-content-children" style={props.contentStyle}>
                    {
                      slots.default ? slots.default() : null
                    }
                  </div>
              }
            </div>
        }
      </div>
    )

  }
})
