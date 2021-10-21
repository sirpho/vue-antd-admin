import { PropType } from 'vue'
import config from '/config/config'
import PropTypes from '/@/hooks/vue-types'

const { waterMarkTitle } = config.defaultSettings

export const waterMarkProps = {
  className: PropTypes.string,
  style: PropTypes.style,
  markStyle: PropTypes.style,
  markClassName: PropTypes.string,
  gapX: PropTypes.number,
  gapY: PropTypes.number,
  zIndex: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  offsetTop: PropTypes.number,
  offsetLeft: PropTypes.number,
  rotate: PropTypes.number,
  image: PropTypes.string,
  content: {
    type: String,
    default: waterMarkTitle || 'Wd Pro Admin'
  },
  fontColor: PropTypes.string,
  fontStyle: {
    type: String as PropType<'none' | 'normal' | 'italic' | 'oblique'>
  },
  fontFamily: PropTypes.string,
  fontWeight: {
    type: [ String, Number ] as PropType<'normal' | 'light' | 'weight' | number>
  },
  fontSize: {
    type: [ String, Number ] as PropType<string | number>
  }
}
