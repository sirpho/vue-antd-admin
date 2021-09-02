import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { CustomRender, WithFalse } from '../../typings'

export default {
  affixTabs: {
    type: Array as PropType<WithFalse<string[]>>,
    default: () => undefined
  },
  logo: {
    type: [ Object, String, Function ] as PropType<CustomRender>,
    default: () => undefined
  }
}
