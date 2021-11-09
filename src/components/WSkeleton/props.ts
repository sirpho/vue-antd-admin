import { PropTypes } from '/@/utils'

export default {
  type: PropTypes.string.def('button'),
  loading: PropTypes.looseBool,
  active: PropTypes.looseBool,
  size: {
    type: String || Number,
    default: 'default'
  },
  shape: {
    type: [ String, Number ] as PropType<string | number>,
    default: 'default'
  },
  width: [ String, Number ] as PropType<string | number>,
  propsStyle: PropTypes.style
}
