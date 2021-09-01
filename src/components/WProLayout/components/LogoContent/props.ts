import type { PropType } from 'vue'
import type { CustomRender, WithFalse } from '../../typings'
import { defaultSettingProps } from '../../defaultSettings'
import { PropTypes } from '../../utils'
import { siderMenuProps } from '../SiderMenu/props'

export default {
  ...defaultSettingProps,
  ...siderMenuProps,
  collapsed: PropTypes.looseBool,
  showTitle: PropTypes.looseBool,
  headerLogoRender: {
    type: [ Object, Function ] as PropType<WithFalse<(props: any) => CustomRender>>,
    default: () => undefined
  },
  onMenuHeaderClick: PropTypes.func
}
