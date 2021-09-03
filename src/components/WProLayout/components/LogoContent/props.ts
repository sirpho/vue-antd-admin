import type { PropType } from 'vue'
import type { CustomRender, WithFalse } from '@wd-pro/pro-layout'
import { siderMenuProps } from '../SiderMenu/props'
import { PropTypes } from '../../utils'
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
