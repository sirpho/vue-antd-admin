import type { PropType } from 'vue'
import type { CustomRender, WithFalse } from '../../typings'
import { defaultSettingProps } from '../../defaultSettings'
import { PropTypes } from '../../utils'
import { siderMenuProps } from '../SiderMenu/props'

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
