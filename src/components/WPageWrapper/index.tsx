import { defineComponent } from 'vue'

export default defineComponent({
  setup(_, { slots }) {
    return () => (
      <div class="wd-pro-page-wrapper">
        {
          slots.default ? slots.default() : null
        }
      </div>
    )

  }
})
