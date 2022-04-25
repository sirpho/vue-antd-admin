<script lang="tsx">
import { defineComponent } from 'vue'
import 'remixicon/fonts/remixicon.css'

export default defineComponent({
  name: 'GIcon',
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  render() {
    return <i class={`ri-${this.icon}`} aria-hidden="true" />
  }
})
</script>

<style lang="less" scoped>
[class*='ri'] {
  font-size: 16px;
  vertical-align: -1px;
}
</style>
