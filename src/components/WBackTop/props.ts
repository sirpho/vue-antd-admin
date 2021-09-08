import PropTypes from '/@/hooks/vue-types'
import config from '/config/config'

const { defaultSettings } = config

export default {
  visibilityHeight: PropTypes.number.def(100),
  duration: PropTypes.number.def(450),
  root: PropTypes.string.def(defaultSettings.viewScrollRoot),
  targetStyle: PropTypes.style
}
