import { PropTypes } from '/@/utils'
import { siderMenuProps } from '../SiderMenu/props'
import { defaultSettingProps } from '../../defaultSettings'

export default {
  ...defaultSettingProps,
  ...siderMenuProps,
  drawer: PropTypes.looseBool,
  collapsed: PropTypes.looseBool,
  disabledTitle: {
    type: Boolean,
    default: false
  },
  headerLogoRender: {
    type: [ Object, Function ] as PropType<WithFalse<(props: any) => CustomRender>>,
    default: () => undefined
  },
  onMenuHeaderClick: PropTypes.func
}
