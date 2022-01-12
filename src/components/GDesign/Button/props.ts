import { PropTypes } from '/@/utils'
import type { SizeType } from '@gx-admin/utils'
import { tuple } from '@gx-design/utils'

const ButtonTypes = tuple('default', 'primary', 'ghost', 'dashed', 'link', 'text')

const ButtonHTMLTypes = tuple('submit', 'button', 'reset')

const ButtonShapes = tuple('circle', 'round')

export const buttonTypes = () => ({
  prefixCls: PropTypes.string,
  type: PropTypes.oneOf(ButtonTypes),
  htmlType: PropTypes.oneOf(ButtonHTMLTypes).def('button'),
  shape: PropTypes.oneOf(ButtonShapes),
  size: {
    type: String as PropType<SizeType>
  },
  loading: {
    type: [ Boolean, Object ] as PropType<boolean | { delay?: number }>,
    default: (): boolean | { delay?: number } => false
  },
  disabled: PropTypes.looseBool,
  ghost: PropTypes.looseBool,
  block: PropTypes.looseBool,
  danger: PropTypes.looseBool,
  icon: PropTypes.VueNode,
  href: PropTypes.string,
  target: PropTypes.string,
  title: PropTypes.string,
  onClick: {
    type: Function as PropType<(event: MouseEvent) => void>
  }
})
