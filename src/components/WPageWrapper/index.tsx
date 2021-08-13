import { defineComponent } from 'vue'

export default defineComponent({
  setup(_, { slots }) {
    return () => (
      <div class="wd-pro-page-wrapper">
        <div class="wd-pro-grid-content">
          {
            slots.default ? slots.default() : null
          }
        </div>
      </div>
    )

  }
})
